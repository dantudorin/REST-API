const { validationResult } = require('express-validator');
const User = require('../models/User');
const RegisterUser = require('../models/RegisterUser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const emailSender = require('../utils/email');
const { Op } = require('sequelize');

exports.signUp = async (req, res, next) => {

    try{
        let error = validationResult(req);

        if(!error.isEmpty()) {
            return res.status(422).json({error : error.array()[0].msg});
        }

        let email = req.body.email;
        let user = await User.findOne({ where : {email}});

        if(user) {
            return res.status(400).json({message : 'User already exists!'});
        }
        
        let registerUser = await RegisterUser.findOne({ where : {email}});
        let token = await jwt.sign(
            {target : 'registration token for user'}, 
            process.env.REGISTER_SECRET, {expiresIn : '1d'}
        );
        
        console.log(token);

        if(!registerUser) {

            await RegisterUser.create({
                email,
                token
            });

        //    emailSender.sendEmail(email, token, 'register-user');
            return res.status(201).json({message : 'user registration token has been created!'});
        } 
        
        await registerUser.update({ token });

    //    emailSender.sendEmail(email, token, 'register-user');
        return res.status(200).json({message : 'user registration token has been updated!'});
    
    }catch (error) {
        console.log(error);
        next(error);
    }
    
};

exports.checkRegisterToken = async (req, res, next) => {
    try {
        let token = req.params.regToken;

        if(token) {  
            let regUser = await RegisterUser.findOne( {where : {token}});

            if(regUser) {
                
                try {
                    let valid = jwt.verify(regUser.token, process.env.REGISTER_SECRET);
                } catch (error) {
                    return res.status(400).json({message : 'invalid token'});
                }
                
                return res.status(200).json({message : 'token is valid', email : regUser.email});    

            }

            return res.status(400).json({message : 'user associated with this token could not be found'});            

        }
        
        return res.status(400).json({message : 'token not found'});

    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.register = async (req, res, next) => {
    try {
        let error = validationResult(req);   
        
        if(!error.isEmpty()) {
            return res.status(422).json({error : error.array()[0].msg});
        }

        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;

        let user = await User.findOne({ where : {email}});
        if(user) return res.status(400).json({message : 'A user with this email already exists'});
        
        user = await User.findOne({ where : {username}});
        if(user) return res.status(400).json({message : 'username in use. Please choose another one'});
        
        password = await bcrypt.hash(password, 12);

        let regUser = await RegisterUser.findOne({ where : {email}});

        if(!regUser) return res.status(409).json({message : 'no user matched to this token'})
        
        try {
            let valid = jwt.verify(regUser.token, process.env.REGISTER_SECRET);    
        } catch (error) {
            return res.status(400).json({message : 'invalid token'}); 
        }
        
        await User.create({email, username, password});
        await regUser.destroy();        

        return res.status(200).json({message : 'User has been created'});

    } catch (error) {
        console.log(error);
        next(error);
    }  
};

exports.login = async (req, res, next) => {
    try {
        let error = validationResult(req);

        if(!error.isEmpty()) return res.status(422).json({error : error.array()[0].msg});

        let credential = req.body.credential;
        let password = req.body.password;
        
        let user = await User.findOne({ where : {
            [Op.or] : [{email : credential} , {username : credential}]
        }});
        
        if(!user) return res.status(400).json({message : 'user not found'});

        let result = await bcrypt.compare(password, user.password);

        if(!result) return res.status(400).json({ message : 'password missmatched'});
        
        let token = jwt.sign({email : user.email, userId : user.id}, process.env.LOGIN_SECRET, { expiresIn : '3d'});

        return res.status(200).json({token});

    } catch (error) {
        console.log(error);
        next(error);
    }
}