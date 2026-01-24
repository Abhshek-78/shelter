const express = require('express');
const routers = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { isLoggedIn } = require('../middleware.js');
const {ReturnTo} = require('../middleware.js');



routers.get("/signup",(req,res)=>{
    res.render("users/Signup.ejs");
    
});
routers.post("/signup",wrapAsync(async(req,res,next)=>{
    try{
         let {username,email,password}=req.body;
        const newUser=new User({username,email,password});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to shelter");
            res.redirect("/listings");
            
        });
        

    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }

}));
routers.get("/login",ReturnTo,(req,res)=>{
    res.render("users/Login.ejs");
});
routers.post("/login",passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}) , async(req,res)=>{
    
    req.flash("success","welcome back!");
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);

});
routers.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);

        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
      
    });
});



module.exports = routers;