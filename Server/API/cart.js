const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const { authenticationAuthorization } = require("../Middleware/authMiddleware");

// Allow User to Add a Game to their Cart
router.post(
  "/cart",
  authenticationAuthorization("USER", "ADMIN"),
  async (req, res) => {
    try {
        const { gameId, userId } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        const game = await prisma.game.findUnique({
            where: {
                id: gameId,
            },
        });

        if (!user || !game) {
            return res.status(404).json({ error: "User or game not found" });
        }

        const existingCartItem = await prisma.cart.findFirst({
            where: {
                userId,
                gameId,
            },
        });

        let cartItem;
        if (existingCartItem) {
            return res.status(400).json({ error: "Game already in cart" });
        } else {
            cartItem = await prisma.cart.create({
                data: {
                    userId,
                    gameId,
                },
            });
        }
        res.status(201).json(cartItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
