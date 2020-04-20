const Sequelize = require('sequelize');
const sqlConnection = require('../utils/db-connection');

let RegisterUser = sqlConnection.define('register-users', {

    id : {primaryKey : true, autoIncrement : true, type : Sequelize.DataTypes.INTEGER, allowNull : false },

    email : {type : Sequelize.DataTypes.STRING, allowNull : false, unique : true},

    token : {type : Sequelize.DataTypes.STRING, allowNull : false, unique : true}

    },
    {
        timestamps : false
    });

module.exports = RegisterUser;