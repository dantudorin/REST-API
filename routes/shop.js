const express = require('express');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/userInformation', isAuth, (req, res, next) => {
    return res.status(200).json({userId : req.userId});
});

module.exports = router;