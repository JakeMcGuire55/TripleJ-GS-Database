const express = require('express');
const app = express();
const PORT = process.env.DATABASE_URL || 3000;
require('dotenv').config();

const gamesRoutes = require('./API/games');
// const usersRoutes = require('./routes/API/users');
app.use(express.json());

app.use('/api', gamesRoutes);
// app.use('/api', usersRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})