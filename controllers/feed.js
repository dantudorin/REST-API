const { validationResult } = require('express-validator');
const Post = require('../models/Post');

exports.postPost = async (req, res, next) => {

    try {
        let error = validationResult(req);

        if(!error.isEmpty()) return res.status(422).json({message : error.array()[0].msg});

        if(!req.file) return res.status(422).json({message : 'Please choose a picture'});

        let title = req.body.title;
        let imageUrl = req.file.path;
        let content = req.body.content;

        await Post.create({
            title,
            imageUrl,
            content
        });

        return res.status(200).json({message : 'New Post was created'});

    } catch (error) {
        console.log(error);
        next(error);
    }

};

exports.getPost = async (req, res, next) => {
    
    try {
        let postId = req.params.postId;
        let post = await Post.findOne({where : {id : postId}});

        if(post) return res.status(200).json({message : post});

        return res.status(404).json({message : 'Post not found'});
    } catch (error) {
        console.log(error);
        next(error);
    }
}