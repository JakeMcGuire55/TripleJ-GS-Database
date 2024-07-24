const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

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
