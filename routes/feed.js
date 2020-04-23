const express = require('express');
const feedController = require('../controllers/feed');
const { check } = require('express-validator');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/post', [
    check('title', 'Fill the title field').isLength({min : 5}),
    check('content', 'Please add a description').isLength({min : 5})], isAuth, feedController.postPost);

router.get('/post/:postId', feedController.getPost);
router.get('/posts', feedController.getAllPosts);

router.put('/post/update/:postId', [
    check('title', 'Fill the title field').isLength({min : 5}),
    check('content', 'Please add a description').isLength({min : 5})], isAuth, feedController.updatePost);

router.delete('/post/delete/:postId', isAuth, feedController.deletePost);

module.exports = router;