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
      // Check if the Game is already in the User's Cart
      const existingCartItem = await prisma.cart.findFirst({
        where: {
          userId,
          gameId,
        },
      });

      let cartItem;
      // Stops user from adding duplicates to their cart
      if (existingCartItem) {
        return res.status(400).json({ error: "Game already in cart" });
      } else {
        // Creates new cart item if game is not already in the users cart
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

module.exports = router;
