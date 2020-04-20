const Sequelize = require('sequelize');

module.exports = new Sequelize('rest-api', 'root', 'tudorin', {
    host: 'localhost',
    dialect : 'mysql',
    port : 3306
});