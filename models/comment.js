const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const CommentsSchema=new Schema({
   text:{
       type:String,
       required:true
   },
    userId:{
        type:Schema.Types.ObjectId
    },
    postId:{
        type:Schema.Types.ObjectId
    }
})

module.exports= mongoose.model("Comment", CommentsSchema)