const express = require('express');
const feedController = require('../controllers/feed');
const { check } = require('express-validator');

const router = express.Router();

router.post('/post', [
    check('title', 'Fill the title field').isLength({min : 5}),
    check('content', 'Please add a description').isLength({min : 5})
] , feedController.postPost);

router.get('/post/:postId', feedController.getPost);

module.exports = router;