const Sequelize = require('sequelize');
const dbConnection = require('../utils/db-connection');

let Post = dbConnection.define('posts', {

    title : {
        type : Sequelize.DataTypes.STRING,
        allowNull : false
    },

    imageUrl : {
        type : Sequelize.DataTypes.STRING,
        allowNull : false
    },

    content : {
        type : Sequelize.DataTypes.STRING,
    }

});

module.exports = Post;