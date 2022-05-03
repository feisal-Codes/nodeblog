const Post = require("../models/post");
const User = require("../models/user");


//get all post by user
exports.getPosts = (req, res, next) => {
  Post.find({ author: req.user._id })
    .then(results => {
      console.log(results);
      res.render("admin/blog", {
        posts: results,
      });
    })
    .catch(err => {
      console.log(err);
    });
};
//get specific post
exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  console.log("hereeeeeeeeeeeeeeee");
  Post.findById(postId)
    .populate("author")
    .then(post => {
      console.log("********************");

      console.log(post.getLikes());

      console.log("********************");
      console.log(post);
      res.render("admin/post-detail", {
        post: post,
        likes: post.getLikes(),
      });
    })
    .catch(err => {
      console.log(err);
    });
};

//add post
exports.addPost = (req, res, next) => {
  const title = req.body.title;
  const body = req.body.body;
  console.log(title, body);

  const post = new Post({
    title: title,
    body: body,
    author: req.user._id,
    likes: 0,
  });
  post
    .save()
    .then(result => {
      console.log(result);
      res.redirect("/admin");
    })
    .catch(err => {
      console.log(err);
    });
};
//get add post form
exports.getAddPost = (req, res, next) => {
  res.render("admin/add_post", {
    editing: false,
  });
};

//like post

//post edit post

exports.editPost = (req, res, next) => {
  const updatedTitle = req.body.title;
  const updatedBody = req.body.body;
  const postId = req.body.postId;

  Post.findById(postId)
    .then(post => {
      console.log("The post we are interested in");
      console.log(post);
      post.title = updatedTitle;
      post.body = updatedBody;
      return post.save();
    })

    .then(result => {
      console.log(result);
      res.redirect("/admin");
    })
    .catch(err => {
      console.log(err);
    });
};

//get edit post
exports.getEditPost = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/admin");
  }

  const postId = req.params.postId;

  Post.findById(postId).then(post => {
    if (!post) {
      return res.redirect("/admin");
    }
    res.render("admin/add_post", {
      pageTitle: "Edit post",
      path: "/admin/edit-post",
      editing: editMode,
      post: post,
    });
  });
};

//post likes
exports.addLike = (req, res, next) => {
  const like = req.body.like;
  const postId = req.body.postId;
  console.log(
    "*********************************************#####################"
  );
  console.log(like);
  Post.findById(postId)
    .then(post => {
      post.addLike();

      return post.save();
    })
    .then(() => {
      res.redirect("back");
    })
    .catch(err => {
      console.log(err);
    });

  // res.redirect('back');
};

exports.addDislike = (req, res, next) => {
  const postId = req.body.postId;
  Post.findById(postId)
    .then(post => {
      post.addDislike();
      return post.save();
    })
    .then(() => {
      res.redirect("back");
    })
    .catch(err => {
      console.log(err);
    });
};

//delete post
exports.deletePost = (req, res, next) => {
  const postId = req.body.postId;
  Post.findByIdAndRemove(postId)
    .then(result => {
      console.log("Post removed");
      User.addLikes(postId);
      req.user.save();
      res.redirect("/admin");
    })
    .catch(err => {
      console.log(err);
    });
};
