const express = require('express');
const router = express.Router({mergeParams: true});
const warpAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/Expresserror.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing = require("../models/listen.js");
const Review = require("../models/review.js");
const {isLoggedIn} = require("../middleware.js");
const reviewController=require("../controllers/review.js");
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
router.post("/",isLoggedIn,warpAsync(reviewController.CreateReview));
// delete review write (ensure this is defined before the catch-all 404)
router.delete('/:reviewId',isLoggedIn, warpAsync(reviewController.DeleteReview));
module.exports = router;