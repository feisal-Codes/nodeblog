const express= require("express");
const router = express.Router()
const BlogController = require("../controllers/blog")
const authController= require("../controllers/auth")

//get login 
router.get("/login", authController.getLogin)
router.post("/login", authController.postLogin)
router.get("/signup", authController.getSignup)
router.post("/signup", authController.postSignup)





//get all blogs

router.get("/", BlogController.getPosts);



// //get specific post
router.get("/post/:postId", BlogController.getPost);


//like post

router.get("/like-post/:postId", BlogController.likePost);

//add comment

router.post("/add-comment", BlogController.addComment);




module.exports= router;