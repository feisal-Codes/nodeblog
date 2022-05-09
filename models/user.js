const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    likes: [
      {
        postId: {
          type: Schema.Types.ObjectId,
          ref: "Post",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//takes a post id as an arguement
UserSchema.methods.addLikes = function (postId) {
  //adding likes for the first time

  if (this.likes.length == 0) {
    this.likes.push({ postId });
    return true;
  }

  //if a like for a post does not exist , add like

  const LikeExists = this.likes.find(post => {
    return post.postId.toString() == postId;
  });
  if (LikeExists == undefined) {
    this.likes.push({ postId });
    return true;
  } else if (LikeExists) {
    const filteredArray = this.likes.filter(post => {
      return post.postId.toString() != postId;
    });
    this.likes = filteredArray;
    return false;
  }
};

UserSchema.methods.getLikes = function () {
  return this.likes;
};

module.exports = mongoose.model("User", UserSchema);
