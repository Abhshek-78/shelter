const express = require('express');
const router = express.Router();
const warpAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/Expresserror.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing = require("../models/listen.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");

        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


// Route to get all listings
router.get('/', warpAsync(async (req, res) => {

    try {
        const AllListing = await Listing.find({});
        res.render('listings/index', { listings: AllListing });
    } catch (err) {
        console.error('Failed to load listings:', err);
        res.status(500).send('Server error');
    }
}));
//create new listing route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//route for extract data from form and save to db
router.post("/",validateListing,warpAsync(async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

}));

// show route specific data – use correct variable name and render view without extension
router.get('/:id',warpAsync( async (req, res) => {
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
router.get('/:id/edit', warpAsync( async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
}));
//update listing route
router.put('/:id',warpAsync( async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete listing route
router.delete('/:id',async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Deleted Successfully");
    res.redirect('/listings');
});
module.exports = router;
