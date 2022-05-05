const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const CommentsSchema=new Schema({
   text:{
       type:String,
       required:true
   },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:"Post"
    }
})

module.exports= mongoose.model("Comment", CommentsSchema)