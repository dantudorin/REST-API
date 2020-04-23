const express = require('express');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const sqlConnection = require('./utils/db-connection');
const shopRoute = require('./routes/shop');
const feedRoute = require('./routes/feed');
const multer = require('multer');
const path = require('path');

//DB Tabels
const User = require('./models/User');
const Post = require('./models/Post');
const RegisterUser = require('./models/RegisterUser');

require('dotenv').config();
let SERVER_PORT = process.env.SERVER_PORT || 3000;

const application = express();

//Body - parser
application.use(bodyParser.json());

//Create static route to public images folder
application.use('/images', express.static(__dirname + '/images'));

//Create multer configurations
let storage = multer.diskStorage({

    destination : (req, file, cb) => {
        cb(null, './images')
    },

    filename : (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

let filter = (req, file, cb) => {

    if(file.mimetype === 'image/png' ||
       file.mimetype === 'image/jpg' ||
       file.mimetype === 'image/jpeg'  
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }

}

application.use(multer({storage : storage, fileFilter : filter}).single('imageUrl'));

// Adding CORS 
application.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
});


//Application routes
application.use('/auth', authRoute);
application.use('/all', shopRoute);
application.use('/feed', feedRoute);


//Error Handler
application.use((error, req, res, next) => {

    console.log(error);
    return res.status(500).json({message : 'Something went wrong with the server!'});

})

//Tables initialization if they do not exist in database and then starts the server 
//{force : true}

User.hasMany(Post);

sqlConnection.sync()
             .then(() => {
                 application.listen(SERVER_PORT);
             })
             .catch(error => {
                 console.log('Error! Could not start server due to:' + error.toString());
             });
