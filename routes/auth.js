const express = require('express');
const authController = require('../controllers/auth');
const { check } = require('express-validator');

const router = express.Router();

router.post('/signup', [
    check('email','not enough characters').isLength({min : 5}),
    check('email', 'invalid email format').isEmail()

], authController.signUp);

router.get('/signup/:regToken', authController.checkRegisterToken);

router.post('/register', [
    check('email','not enough characters').isLength({min : 5}),
    check('email', 'invalid email format').isEmail(),

    check('username', 'username has no propper length').isLength({min : 5}),

    check('password', 'password has no propper length').isLength( {min : 5}),
    check('password').custom( (value, {req}) => {
        console.log(value);    
        if(value !== req.body.confirm_password){
                throw new Error('passwords mismatched');
        }else {
            return true;
        }
    })
] ,authController.register);

module.exports = router;