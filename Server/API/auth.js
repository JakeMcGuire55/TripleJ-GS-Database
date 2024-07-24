const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Intermediate Function for Creating User Data in Database
const insertUserIntoDB = async (username, email, hashedPassword, role) => {
    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role,
            },
        });
        return user;
    } catch (error) {
        console.error(error);
    }
};

// Route for User Registration. Takes username, password, email, and role as arguments. Hashes password upon submission, and returns created user credentials. 
router.post("/register", async (req, res) => {
    try {
        const {username, password, email, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const doesUserExist = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (doesUserExist) {
            return res.status(400).json({ error: "User already exists" });
        }
        const user = await insertUserIntoDB(username, email, hashedPassword, role);
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route for User Login. Takes email and password as arguments. Issues accessToken upon successful login

module.exports = router;
