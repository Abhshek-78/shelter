const mongoose =require("mongoose");
const Schema=mongoose.Schema;
const { default: passportLocalMongoose }=require("passport-local-mongoose");

const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
});
UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("user",UserSchema);
