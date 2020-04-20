const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;
    
    try {
        decodedToken = jwt.verify(token, process.env.LOGIN_SECRET); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : 'invalid token'});
    }

    req.userId = decodedToken.userId;
        next();

}