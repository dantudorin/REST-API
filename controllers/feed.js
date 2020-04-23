const { validationResult } = require('express-validator');
const Post = require('../models/Post');
const clearImage = require('../utils/clear-image');
const User = require('../models/User');

exports.postPost = async (req, res, next) => {

    try {
        let error = validationResult(req);

        if(!error.isEmpty()) return res.status(422).json({message : error.array()[0].msg});

        if(!req.file) return res.status(422).json({message : 'Please choose a picture'});
        
        let userId = req.userId;
        
        let user = await User.findOne({where : {id : userId}});
        
        if(!user) return res.status(422).json({message : 'User not found'}); 
    
        let title = req.body.title;
        let imageUrl = req.file.path;
        let content = req.body.content;

        let post = await Post.create({title, imageUrl, content});
        user.setPosts(post);

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

exports.getAllPosts = async (req, res, next) => {

    try {
        let page = req.query.page || 1;
        let itemsPerPage = 3;
        let offset = (page - 1) * itemsPerPage;

        let posts = await Post.findAll({
            offset, 
            limit : itemsPerPage 
        });

        if(!page) return res.status(200).json({posts : null});

        let totalItems = await Post.count();

        return res.status(200).json({posts, totalItems});
        
    } catch (error) {
        console.log(error);
        next(error);
    }

}

exports.updatePost = async (req, res, next) => {

    try {
        let error = validationResult(req);

        if(!error.isEmpty()) return res.status(422).json({message : error.array()[0].msg});

        let title = req.body.title;
        let imageUrl = req.body.imageUrl;
        let content = req.body.content;

        if(req.file) {
            imageUrl = req.file.path;
        }

        let postId = req.params.postId;
        let post = await Post.findOne({where : {id : postId}});

        if(!post) return res.status(404).json({message : 'Post not found.'});

        if(post.imageUrl !== imageUrl) {
            console.log(post.imageUrl);
            try {
                clearImage(post.imageUrl);
            } catch (error) {
                console.log(error);
                throw error;                
            }
        }

        await post.update({title, imageUrl, content});

        return res.status(200).json({message : 'Post has been updated.'});

    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.deletePost = async (req, res, next) => {

    try {        
        let postId = req.params.postId;
        let userId = req.userId;

        let user = await User.findOne({where : {id : userId}});
        if(!user) return res.status(422).json({message : 'User not found.'});

        let post = await Post.findOne({where : {id : postId}});
        if(!post) return res.status(422).json({message : 'Post not found.'});

        if(user.id !== post.userId) return res.status(422).json({message : 'You don\'t have permission to delete this post'});

        clearImage(post.imageUrl);
        post.destroy();
        return res.status(200).json({message : 'Post has been removed from db.'});

    } catch (error) {
        console.log(error);
        next(error);        
    }
}