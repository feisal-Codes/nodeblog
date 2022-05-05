const express= require("express");
const router = express.Router()
const BlogController = require("../controllers/blog")


//get all blogs

router.get("/", BlogController.getPosts);



// //get specific post
router.get("/post/:postId", BlogController.getPost);


//like post

router.get("/like-post/:postId", BlogController.likePost);

//add comment

router.post("/add-comment", BlogController.addComment);


module.exports= router;