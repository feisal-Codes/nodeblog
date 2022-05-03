const Post = require("../models/post");
const Comment= require("../models/comment");
const post = require("../models/post");



exports.getPosts = (req, res, next) => {
    Post.find()
      .then(results => {
        // console.log(results);
        res.render("blog/blog", {
          posts: results,
        });
        // res.send("hey")
      })
      .catch(err => {
        console.log(err);
      });
  };
  exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    const loadComments= req.query.comment;

    Post.findById(postId)
      .populate("author")
      .then(post => {
       
        res.render("blog/post-detail", {
          post: post,
          likes: post.getLikes(),
          comments:loadComments,
        });
        // res.send("Hey")
      })
      .catch(err => {
        console.log(err);
      });
  };

  //like post

  exports.likePost = (req, res, next) => {
    const postId = req.params.postId;
    const like = req.query.like;
    Post.findById(postId)
      .then(post => {
        if (!post) {
          res.redirect("/admin");
        } else if (like == "true") {
          const isPostLiked = req.user.addLikes(postId);
          isPostLiked ? post.addLike() : post.addDislike();
        } else {
          res.redirect("/admin");
        }
        post.save();
        return req.user.save();
      })
      .then(() => {
        console.log(req.user.getLikes());
        res.redirect("/post/"+postId);
        // res.send(req.user.getLikes());
      })
      .catch(err => {
        console.log(err);
      });
  };
  
  //add comment

  exports.addComment=(req,res, next)=>{
 
    const postId=req.body.postId;
    const updatedComment = req.body.comment;

    Post.findById(postId).then((post)=>{
         const comment= new Comment({
           text:updatedComment,
           userId:req.user._id,
           postId:post._id
         })
      
         comment.save().then((comment)=>{
          
           post.addComent(comment._id);
           post.save()
           res.redirect("/post/"+postId);
          }).catch(err=>{console.log(err)})
          
    }).catch(err=>{
        console.log(err)
      })
     
    
    

  }