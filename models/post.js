const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    body: {
      type: String,
      require: true,
    },
    author: {
      // name: { type: String,required:true },
      // authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    likes: {
      type: Number,
    },

    comments: [
      {
        commentId: {
          type: Schema.Types.ObjectId,
          ref: "Comment",
        },
        commentUser: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    //   },
  },
  {
    timestamps: true,
  }
);

PostSchema.methods.addLike = function () {
  this.likes += 1;
  return this.likes;
};

PostSchema.methods.addDislike = function () {
  if (this.likes >= 1) {
    this.likes -= 1;
  }
  return this.likes;
};

PostSchema.methods.addComent = function (commentId, commentUser) {
  return this.comments.push({ commentId: commentId, commentUser: commentUser });
};

PostSchema.methods.getComments = function () {
  const sorted= this.comments;
  return sorted;
};

PostSchema.methods.getLikes = function () {
  return this.likes;
};

PostSchema.methods.getExtract = function () {
  const maxLength = 150;
  return this.body.substr(0, maxLength);
};

module.exports = mongoose.model("Post", PostSchema);
