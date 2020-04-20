const sqlConnection = require('../utils/db-connection');
const Sequelize = require('sequelize');

let User = sqlConnection.define('users', {
    id : {primaryKey : true, autoIncrement : true, type : Sequelize.DataTypes.INTEGER, allowNull : false },

    email : {type : Sequelize.DataTypes.STRING, unique : true, allowNull : false},

    password : {type : Sequelize.DataTypes.STRING, allowNull : false},
    
    username : {type : Sequelize.DataTypes.STRING, unique : true, allowNull : false}, 
        
    }, 
    {
        timestamps : false
    });

module.exports = User;