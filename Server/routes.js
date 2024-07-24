const gamesRoutes = require('./API/games');
const userRoutes = require('./API/auth');

module.exports = function(app) {
    app.use('/api', gamesRoutes);
    app.use('/api', userRoutes);
};