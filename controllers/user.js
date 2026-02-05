const Review=require("../models/review.js");
const Listing=require("../models/listen.js");
const User=require("../models/user.js");
module.exports.Rendersignup=(req,res)=>{
    res.render("users/Signup.ejs");
    
}

module.exports.Signup=async(req,res,next)=>{
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

}
//login renderr
module.exports.Renderlogin=(req,res)=>{
    res.render("users/Login.ejs");
}
//login post function is in routes/users.js
module.exports.Checklogin=async(req,res)=>{
    
    req.flash("success","welcome back!");
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);

}
//logout
module.exports.Logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);

        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
      
    });
}

// Admin functions
module.exports.listUsers = async (req, res) => {
    const users = await User.find({});
    res.render('users/admin_index', { users });
};

module.exports.renderEditUser = async (req, res) => {
    const { id } = req.params;
    const userToEdit = await User.findById(id);
    if (!userToEdit) {
        req.flash('error','User not found');
        return res.redirect('/admin/users');
    }
    res.render('users/edit_user', { user: userToEdit });
};

module.exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, isAdmin } = req.body.user;
    await User.findByIdAndUpdate(id, { username, email, isAdmin: isAdmin === 'on' || isAdmin === true });
    req.flash('success','User updated');
    res.redirect('/admin/users');
};