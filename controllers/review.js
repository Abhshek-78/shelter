const Review=require("../models/review.js");
const Listing=require("../models/listen.js");
module.exports.CreateReview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
        let newReview=new Review(req.body.review);
        newReview.author=req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
   req.flash("success","Successfully add a new review");
    res.redirect(`/listings/${listing.id}`);
}
//delete review function
module.exports.DeleteReview= async (req, res) => {
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
}