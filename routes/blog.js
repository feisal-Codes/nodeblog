const express= require("express");
const router = express.Router()
const BlogController = require("../controllers/blog")
const authController= require("../controllers/auth")
const isAuth= require("../middleware/isAuth")

//get login 
router.get("/login", authController.getLogin)
router.post("/login", authController.postLogin)
router.get("/signup", authController.getSignup)
router.post("/signup", authController.postSignup)
router.post('/logout', authController.postLogout);






//get all blogs

router.get("/", isAuth, BlogController.getPosts);



// //get specific post
router.get("/post/:postId",isAuth, BlogController.getPost);


//like post

router.get("/like-post/:postId" ,isAuth, BlogController.likePost);

//add comment

router.post("/add-comment" ,isAuth, BlogController.addComment);




module.exports= router;