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
      // Check if the User Exists
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      // Check if the Game Exists
      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!user || !game) {
        return res.status(404).json({ error: "User or game not found" });
      }

      // Create a Cart for the user if they don't have one
      let cart = await prisma.cart.findUnique({
        where: {
          userId: parseInt(userId),
        },
      });
      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId: parseInt(userId),
          },
        });
      }

      // Check if the Game is already in the User's Cart
      const existingCartItem = await prisma.gameInCart.findFirst({
        where: {
          cartId: cart.id,
          gameId,
        },
      });

      let cartItem;
      // Stops user from adding duplicates to their cart
      if (existingCartItem) {
        return res.status(400).json({ error: "Game already in cart" });
      } else {
        // Creates new cart item if game is not already in the users cart
        cartItem = await prisma.gameInCart.create({
          data: {
            cartId: cart.id,
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

// Allow User to Delete a Game from their Cart
router.delete(
  "/cart",
  authenticationAuthorization("USER", "ADMIN"),
  async (req, res) => {
    try {
      const { userId, gameId } = req.body;

      // Check if Game exists in Cart
      const cartItem = await prisma.cart.findFirst({
        where: {
          userId,
          gameId,
        },
      });

      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      // Delete the Game From Cart
      await prisma.cart.delete({
        where: {
          id: cartItem.id,
        },
      });

      res.status(200).json({ message: "Game removed from cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get All Games in the Cart for the logged in User
router.get(
  "/cart/:userId",
  authenticationAuthorization("USER", "ADMIN"),
  async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      // Check if User exists in database
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Fetch all cart items
      const cartItems = await prisma.cart.findMany({
        where: { userId: parseInt(userId) },
        include: { games: true }, //Include game details
      });

      res.status(200).json(cartItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
