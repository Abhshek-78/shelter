const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const methodoveride = require('method-override');
const ejsmate=require('ejs-mate');
const Listing = require("./models/listen.js");
const session=require('express-session');
const { MongoStore } = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const Localstrategy=require('passport-local');
const User=require('./models/user.js');


const ExpressError=require("./utils/Expresserror.js");

const Mongo_Url=process.env.ATLAS_URI;

const listingsRoutes=require("./routes/listings.js");
const reviewRoutes=require("./routes/review.js");
const userRoutes=require("./routes/users.js");
async function main(){
    await mongoose.connect(Mongo_Url);
}
main().then(()=>{
    console.log('Mongoose is connected');
}).catch((err)=>{
    console.log('Mongoose is not connected',err);
});
 //middleware
const store = new MongoStore({
    mongoUrl: Mongo_Url,
    touchAfter: 24 * 60 * 60,
});
store.on('error', (err) => {
    console.log('session store error', err);
});
const sessionOption={
    store,
    secret:process.env.SECREAT,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expire:Date.now()+1000*60*60*24*7,//it is usse to set expire of sesion  is milisecond 
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    }
    
}




app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});

app.use((err,req,res,next)=>{
    let {statuscode=500,message="something went wrong"}=err;
    res.render("error.ejs",{message});
    //res.status(statuscode).send(message);
    
});


// set view engine and views dir before routes
app.set('view engine','ejs');
app.set("views", path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodoveride('_method'));
app.use(express.json());

app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,'public')));

/*app.use("/newusers",async(req,res)=>{
    let newUser=new User({
        email:"cssp5431@gmail.com",
        username:"cssp5431"

    });
    let RegisterUser=await User.register(newUser,"mystrongpassword");
    res.send(RegisterUser);
});*/
// Home route
/*app.get('/', (req, res) => {
    res.send('Hello I am ready to work');
});*/


app.use('/listings',listingsRoutes);
app.use('/listings/:id/review',reviewRoutes);
app.use('/',userRoutes);

app.all(/.*/, (req, res) => {
    res.status(404).send(' page Not Found');
});


// start server after routes
app.listen(port, () => {
    console.log(`Server is running on port  :  ${port}`);
});



