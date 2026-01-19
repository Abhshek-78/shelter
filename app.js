const express = require('express');

const path = require('path');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const methodoveride = require('method-override');
const ejsmate=require('ejs-mate');
const Listing = require("./models/listen.js");
const session=require('express-session');
const flash=require('connect-flash');


const ExpressError=require("./utils/Expresserror.js");
const Mongo_url = 'mongodb://127.0.0.1:27017/rooms';

const listingsRoutes=require("./routes/listings.js");
const reviewRoutes=require("./routes/review.js");
async function main(){
    await mongoose.connect(Mongo_url);
}
main().then(()=>{
    console.log('Mongoose is connected');
}).catch((err)=>{
    console.log('Mongoose is not connected',err);
});
 //middleware
const sessionOption={
    secret:"this_is_super_secret",
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

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
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
// Home route
app.get('/', (req, res) => {
    res.send('Hello I am ready to work');
});

app.use('/listings',listingsRoutes);


app.use('/listings/:id/review',reviewRoutes);

app.all(/.*/, (req, res) => {
    res.status(404).send(' page Not Found');
});


// start server after routes
app.listen(port, () => {
    console.log(`Server is running on port  :  ${port}`);
});



