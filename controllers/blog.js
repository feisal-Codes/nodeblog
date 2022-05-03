const Post = require("../models/post");



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
    Post.findById(postId)
      .populate("author")
      .then(post => {
        // console.log("********************");
  
        // console.log(post.getLikes());
  
        // console.log("********************");
        // console.log(post);
        res.render("blog/post-detail", {
          post: post,
          likes: post.getLikes(),
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
  