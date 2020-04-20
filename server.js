const express = require('express');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const sqlConnection = require('./utils/db-connection');
const shopRoute = require('./routes/shop');

//DB Tabels
const User = require('./models/User');

require('dotenv').config();
let SERVER_PORT = process.env.SERVER_PORT || 3000;

const application = express();

application.use(bodyParser.json());

application.use('/auth', authRoute);
application.use('/all', shopRoute);

application.use((error, req, res, next) => {

    return res.status(500).json({message : 'Something went wrong with the server!'});

})

//Tables initialization if they do not exist in database and then starts the server 
//{force : true}
sqlConnection.sync()
             .then(() => {
                 application.listen(SERVER_PORT);
             })
             .catch(error => {
                 console.log('Error! Could not start server due to:' + error.toString());
             });
