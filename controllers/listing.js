const Listing = require("../models/listen");
const { cloudinary } = require("../cloudconfig");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.Index = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, minRating, minDiscount } = req.query;

        // If no filters are provided, use the simple find (faster and simpler)
        const noFilters = !category && !minPrice && !maxPrice && !minRating && !minDiscount;
        if (noFilters) {
            const AllListing = await Listing.find({});
            return res.render('listings/index', { listings: AllListing, selectedCategory: category || '', filters: req.query });
        }

        const pipeline = [];
        if (category) pipeline.push({ $match: { catogery: category } });

        // Compute effectivePrice after percentage discount (discount stored as percent)
        pipeline.push({
            $addFields: {
                discountPct: { $ifNull: ['$discount', 0] },
                effectivePrice: {
                    $subtract: [
                        { $ifNull: ['$price', 0] },
                        {
                            $multiply: [
                                { $ifNull: ['$price', 0] },
                                { $divide: [{ $ifNull: ['$discount', 0] }, 100] }
                            ]
                        }
                    ]
                }
            }
        });

        const priceMatch = {};
        if (minPrice) priceMatch.$gte = Number(minPrice);
        if (maxPrice) priceMatch.$lte = Number(maxPrice);
        if (Object.keys(priceMatch).length) pipeline.push({ $match: { effectivePrice: priceMatch } });

        if (minDiscount) pipeline.push({ $match: { discount: { $gte: Number(minDiscount) } } });

        // Join reviews and compute average rating
        pipeline.push(
            { $lookup: { from: 'reviews', localField: 'review', foreignField: '_id', as: 'reviews' } },
            { $addFields: { avgRating: { $cond: [{ $eq: [{ $size: '$reviews' }, 0] }, null, { $avg: '$reviews.rating' }] } } }
        );

        if (minRating) pipeline.push({ $match: { avgRating: { $gte: Number(minRating) } } });

        const AllListing = await Listing.aggregate(pipeline);
        res.render('listings/index', { listings: AllListing, selectedCategory: category || '', filters: req.query });
    } catch (err) {
        console.error('Failed to load listings (aggregation):', err);
        res.status(500).send('Server error');
    }
};
//create new listing function
module.exports.CreateNewListing=async(req,res)=>{
    try {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        
        // If file is uploaded, save the file path and filename
        if (req.file) {
            newListing.Img = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        
        // Geocode the location
        if (req.body.listing.location) {
            try {
                const response = await geocodingClient
                    .forwardGeocode({
                        query: req.body.listing.location,
                        limit: 1
                    })
                    .send();
                
                if (response.body.features.length > 0) {
                    newListing.geometry = {
                        type: 'Point',
                        coordinate: response.body.features[0].geometry.coordinates
                    };
                }
            } catch (geocodeErr) {
                console.error('Geocoding error:', geocodeErr);
            }
        }
        
        if (req.body.listing.discount) req.body.listing.discount = Number(req.body.listing.discount);
        
        await newListing.save();
        req.flash("success","Successfully made a new shelter");
        res.redirect("/listings");
    } catch (err) {
        console.error('Error creating listing:', err);
        req.flash("error", "Error creating listing");
        res.redirect("/listings/new");
    }
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
    
    try {
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
        
        // Geocode the location if it's changed
        if (req.body.listing.location && req.body.listing.location !== listing.location) {
            try {
                const response = await geocodingClient
                    .forwardGeocode({
                        query: req.body.listing.location,
                        limit: 1
                    })
                    .send();
                
                if (response.body.features.length > 0) {
                    req.body.listing.geometry = {
                        type: 'Point',
                        coordinate: response.body.features[0].geometry.coordinates
                    };
                }
            } catch (geocodeErr) {
                console.error('Geocoding error:', geocodeErr);
            }
        }
        
        if (req.body.listing.discount) req.body.listing.discount = Number(req.body.listing.discount);
        
        await Listing.findByIdAndUpdate(id, {...req.body.listing});
        req.flash("success"," succesfully updated shelter");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error('Error updating listing:', err);
        req.flash("error", "Error updating listing");
        res.redirect(`/listings/${id}`);
    }
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
    
    req.flash("success","Successfully made delete shelter");
    res.redirect('/listings');
}

