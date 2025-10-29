const mongoose = require('mongoose');
// require local file in same folder
const initdata = require('./data.js');
const Listing = require('../models/listen.js');
const Mongo_url = 'mongodb://127.0.0.1:27017/rooms';

main()
    .then(async () => {
        console.log("connect to db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(Mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
}

const initdb = async () => {
    await Listing.deleteMany({});
    // use the exported property name 'data' from data.js
    const raw = Array.isArray(initdata.data) ? initdata.data : [];
    const listings = raw.map(item => ({
        Title: item.Title,
        Description: item.Description,
        Img: item.Img && typeof item.Img === 'object' ? (item.Img.url || '') : (item.Img || ''),
        price: item.price,
        location: item.location,
        country: item.country
    }));
    await Listing.insertMany(listings);
    console.log("Data Imported:", listings.length);
}
//module.exports = initdb;
initdb();



