const express = require('express');
const routers = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { isLoggedIn } = require('../middleware.js');
const {ReturnTo} = require('../middleware.js');
const userController=require("../controllers/user.js");
const user = require('../models/user');



routers.get("/signup",userController.Rendersignup);
routers.post("/signup",wrapAsync(userController.Signup));
routers.get("/login",ReturnTo,userController.Renderlogin);
routers.post("/login",passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}) , userController.Checklogin);
routers.get("/logout",userController.Logout);



module.exports = routers;