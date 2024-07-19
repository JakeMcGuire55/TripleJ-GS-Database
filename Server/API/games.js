const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require('express');
// const { authenticationToken, authorizeRoles } = require("../../middleware/authMiddleware");
const router = express.Router();

// GET All Games Endpoint (Access = Public)
router.get("/games", async (req, res) => {
    try {
        const games = await prisma.game.findMany();
        res.status(200).json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET Game by Specified Game ID (Access = Public)
router.get("/games/:id", async (req, res) => {
    try {
        const game = await prisma.game.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
        });
        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }
        res.status(200).json(game);
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Could Not Locate Game"});
    }
});
module.exports = router;