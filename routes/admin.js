const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const adminController = require("../controllers/admin")
const isAuth= require("../middleware/isAuth")



//post routes
//add a post
router.post("/add-post",isAuth, adminController.addPost);
//edit post

router.post("/edit-post", isAuth, adminController.editPost);



//delete post
router.post("/delete-post", isAuth, adminController.deletePost);

//get routes
//get all post authored by user

router.get("/", isAuth,  adminController.getPosts);

//get specific post authored by user

router.get("/post/:postId", isAuth, adminController.getPost);

//get add a post form
router.get("/add-post",isAuth, adminController.getAddPost);
//get edit post

router.get("/edit-post/:postId", isAuth, adminController.getEditPost);




module.exports = router;
