const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const adminController = require("../controllers/admin")


//post routes
//add a post
router.post("/add-post",adminController.addPost);
//edit post

router.post("/edit-post",adminController.editPost);

//add like and dislikes
router.post("/add-like",adminController.addLike)
router.post("/add-dislike",adminController.addDislike)


//delete post
router.post("/delete-post", adminController.deletePost);

//get routes
//get all post authored by user

router.get("/", adminController.getPosts);

//get specific post authored by user

router.get("/post/:postId", adminController.getPost);

//get add a post form
router.get("/add-post",adminController.getAddPost);
//get edit post

router.get("/edit-post/:postId", adminController.getEditPost);
router.get("/like-post/:postId", adminController.likePost);




module.exports = router;
