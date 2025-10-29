const express = require('express');
const Listing = require("./models/listen.js");
const path = require('path');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const methodoveride = require('method-override');
const ejsmate=require('ejs-mate');

const Mongo_url = 'mongodb://127.0.0.1:27017/rooms';
async function main(){
    await mongoose.connect(Mongo_url);
}
main().then(()=>{
    console.log('Mongoose is connected');
}).catch((err)=>{
    console.log('Mongoose is not connected',err);
});

// set view engine and views dir before routes
app.set('view engine','ejs');
app.set("views", path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodoveride('_method'));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,'public')));
// Home route
app.get('/', (req, res) => {
    res.send('Hello I am ready to work');
});

// Route to get all listings
app.get('/listings', async (req, res) => {
    try {
        const AllListing = await Listing.find({});
        res.render('listings/index', { listings: AllListing });
    } catch (err) {
        console.error('Failed to load listings:', err);
        res.status(500).send('Server error');
    }
});
//create new listing route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//route for extract data from form and save to db
app.post("/listings",async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

});

// show route specific data – use correct variable name and render view without extension
app.get('/listings/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        console.log('SHOW listing.Img =>', listing && listing.Img);
        if (!listing) return res.status(404).send('Listing not found');
        res.render('listings/show', { listing });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

//edit listing route
app.get('/listings/:id/edit', async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
});
//update listing route
app.put('/listings/:id', async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});
//delete listing route
app.delete('/listings/:id', async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Deleted Successfully");
    res.redirect('/listings');
});

// start server after routes
app.listen(port, () => {
    console.log(`Server is running on port  :  ${port}`);
});



