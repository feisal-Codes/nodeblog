const Post = require("../models/post");
const Comment= require("../comment");
const post = require("../models/post");



exports.getPosts = (req, res, next) => {
    Post.find().sort({createdAt:-1}).populate("author")
      .then(results => {
        console.log("**************************************")
        console.log(results);
        console.log("**************************************")

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
      .populate("comments.commentId"  )
      .populate("comments.commentUser")
      .then(post => {
      //  console.log(post.author)
       console.log("******************")
       console.log(post.getComments())
       console.log("******************")

        res.render("blog/post-detail", {
          post: post,
          likes: post.getLikes(),
          comments:{loadComments:loadComments,commentsData:post.getComments()},
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
        // res.redirect("/post/"+postId);
        res.redirect("back")
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
          
           post.addComent(comment._id, req.user._id);
           post.save()
           res.redirect("/post/"+postId+"?comment=true");
          }).catch(err=>{console.log(err)})
          
    }).catch(err=>{
        console.log(err)
      })
     
    
    

  }

 