const express = require('express');
const router = express.Router();
const warpAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/Expresserror.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing = require("../models/listen.js");
const mongoose = require('mongoose');
const { isLoggedIn, isAdmin } = require('../middleware.js');
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const path = require('path');
const {storage} = require("../cloudconfig.js");

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|svg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
        }
    }
})


// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid listing ID');
    }
    next();
};

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");

        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//create new listing route
router.get("/new",isLoggedIn,(req,res)=>{
    
    res.render("listings/new.ejs");
});

// Admin listings management page
router.get('/admin', isLoggedIn, isAdmin, warpAsync(listingController.AdminIndex));

router
    .route('/')
    // Route to get all listings
    .get(warpAsync(listingController.Index));

    //route for extract data from form and save to db
router.post("/",isLoggedIn,validateListing,upload.single('listing[Img]'),warpAsync(listingController.CreateNewListing));

// show route specific data – use correct variable name and render view without extension
router.get('/:id',validateObjectId,warpAsync(listingController.ShowListing));

//edit listing route
router.get('/:id/edit',isLoggedIn, validateObjectId, warpAsync(listingController.EditListing));
//update listing route
router.put('/:id',isLoggedIn,validateObjectId,upload.single('listing[Img]'),warpAsync(  listingController.UpdateListing));
//delete listing route
router.delete('/:id',isLoggedIn,validateObjectId,warpAsync( listingController.DeleteListing));
module.exports = router;
