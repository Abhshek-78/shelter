const express = require('express');

const path = require('path');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const methodoveride = require('method-override');
const ejsmate=require('ejs-mate');
const Listing = require("./models/listen.js");
const Review = require('./models/review.js');
const warpAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/Expresserror.js");
const Mongo_url = 'mongodb://127.0.0.1:27017/rooms';
const {listingSchema,reviewSchema}=require("./schema.js");
async function main(){
    await mongoose.connect(Mongo_url);
}
main().then(()=>{
    console.log('Mongoose is connected');
}).catch((err)=>{
    console.log('Mongoose is not connected',err);
});
 //middleware
 app.use((err,req,res,next)=>{
    let {statuscode=500,message="something went wrong"}=err;
    res.render("error.ejs",{message});
    //res.status(statuscode).send(message);
    
});

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");

        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

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

// Route to get all listings
app.get('/listings', warpAsync(async (req, res) => {

    try {
        const AllListing = await Listing.find({});
        res.render('listings/index', { listings: AllListing });
    } catch (err) {
        console.error('Failed to load listings:', err);
        res.status(500).send('Server error');
    }
}));
//create new listing route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//route for extract data from form and save to db
app.post("/listings",validateListing,warpAsync(async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

}));

// show route specific data – use correct variable name and render view without extension
app.get('/listings/:id',warpAsync( async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate("review");
        console.log('SHOW listing.Img =>', listing && listing.Img);
        if (!listing) return res.status(404).send('Listing not found');
        res.render('listings/show', { listing });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));

//edit listing route
app.get('/listings/:id/edit', warpAsync( async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
}));
//update listing route
app.put('/listings/:id',warpAsync( async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete listing route
app.delete('/listings/:id',async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Deleted Successfully");
    res.redirect('/listings');
});

//posting review route
app.post("/listings/:id/review/",warpAsync( async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
        let newReview=new Review(req.body.review);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
   
    res.redirect(`/listings/${listing.id}`);
}));
// delete review write (ensure this is defined before the catch-all 404)
app.delete('/listings/:id/review/:reviewId', warpAsync( async (req, res) => {
        const { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${id}`);
}));

app.all(/.*/, (req, res) => {
    res.status(404).send(' page Not Found');
});


// start server after routes
app.listen(port, () => {
    console.log(`Server is running on port  :  ${port}`);
});



