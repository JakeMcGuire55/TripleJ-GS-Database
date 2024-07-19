const gamesRoutes = require('./API/games');

module.exports = function(app) {
    app.use('/api', gamesRoutes);
};