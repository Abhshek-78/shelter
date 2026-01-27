const Listing = require("../models/listen");
const { cloudinary } = require("../cloudconfig");

module.exports.Index=async (req, res) => {

    try {
        const AllListing = await Listing.find({});
        res.render('listings/index', { listings: AllListing });
    } catch (err) {
        console.error('Failed to load listings:', err);
        res.status(500).send('Server error');
    }
};
//create new listing function
module.exports.CreateNewListing=async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    
    // If file is uploaded, save the file path and filename
    if (req.file) {
        newListing.Img = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    
    await newListing.save();
    req.flash("success","Successfully made a new shelter");
    res.redirect("/listings");
    
}
//show lisitng function
module.exports.ShowListing=async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate({
            path: "review",
            populate: {
                path: "author"
            }
        });
        console.log('SHOW listing.Img =>', listing && listing.Img);
        if (!listing) return res.status(404).send('Listing not found');
        res.render('listings/show', { listing });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}
//edit routes function
module.exports.EditListing= async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    // Check if user is the owner of the listing
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","You do not have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }
    
    res.render('listings/edit.ejs', { listing });
}
//update listing function
module.exports.UpdateListing= async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    // Check if user is the owner of the listing
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","You do not have permission to update this listing");
        return res.redirect(`/listings/${id}`);
    }
    
    // If new file is uploaded, delete old image and update with new one
    if (req.file) {
        // Delete old image from Cloudinary if it exists
        if (listing.Img && listing.Img.filename) {
            try {
                await cloudinary.uploader.destroy(listing.Img.filename);
            } catch (err) {
                console.error("Error deleting image from Cloudinary:", err);
            }
        }
        // Update with new image
        req.body.listing.Img = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success"," succesfully updated shelter");
    res.redirect(`/listings/${id}`);
}
//delete listing function
module.exports.DeleteListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    // Check if user is the owner of the listing
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","You do not have permission to delete this listing");
        return res.redirect(`/listings/${id}`);
    }
    
    // Delete image from Cloudinary if it exists
    if (listing.Img && listing.Img.filename) {
        try {
            await cloudinary.uploader.destroy(listing.Img.filename);
        } catch (err) {
            console.error("Error deleting image from Cloudinary:", err);
        }
    }
    
    await Listing.findByIdAndDelete(id);
    console.log("Deleted Successfully");
    req.flash("success","Successfully made delete shelter");
    res.redirect('/listings');
}