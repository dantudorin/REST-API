const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const authorization = req.get('Authorization');
    let decodedToken;
    
    if(!authorization) return res.status(422).json({message : 'No authorization header was found.'}); 
    let token = authorization.split(' ')[1];

    try {
        decodedToken = jwt.verify(token, process.env.LOGIN_SECRET); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : 'invalid token'});
    }

    req.userId = decodedToken.userId;
    next();

}