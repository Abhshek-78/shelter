//it use use to chech user is login are not
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash("error","you must be logged in first");
        return res.redirect("/login");
    }
    next();
}
module.exports.ReturnTo=(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo=req.session.returnTo;
    }
    next();
};

