const express = require('express');
const router = express.Router({mergeParams: true});
const warpAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/Expresserror.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing = require("../models/listen.js");
const Review = require("../models/review.js");
const {isLoggedIn} = require("../middleware.js");
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};
//posting review route
router.post("/",isLoggedIn,warpAsync( async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
        let newReview=new Review(req.body.review);
        newReview.author=req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
   req.flash("success","Successfully add a new review");
    res.redirect(`/listings/${listing.id}`);
}));
// delete review write (ensure this is defined before the catch-all 404)
router.delete('/:reviewId',isLoggedIn, warpAsync( async (req, res) => {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        
        // Check if user is the author of the review
        if(!review.author.equals(req.user._id)){
            req.flash("error","You do not have permission to delete this review");
            return res.redirect(`/listings/${id}`);
        }
        
        await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Successfully delete a review");
        res.redirect(`/listings/${id}`);
}));
module.exports = router;