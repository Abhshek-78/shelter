const { default: mongoose } = require('mongoose');
const mongoos=require('mongoose');
const Schema=mongoos.Schema;
const reviewSchema= new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    CreatedAt:{
        type:Date,
        default:Date.now(),
    },
});

module.exports=mongoos.model("review",reviewSchema);