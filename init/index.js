const mongoose = require('mongoose');
// require local file in same folder
const initdata = require('./data.js');
const Listing = require('../models/listen.js');
const { init } = require('../models/user.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
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
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "648f3c4f2f4c3c0015c6e1b9a" }));
    // use the exported property name 'data' from data.js
    const raw = Array.isArray(initdata.data) ? initdata.data : [];

    const listingPromises = raw.map(async (item) => {
        let geometry = null;
        if (item.location && mapToken) {
            try {
                const response = await geocodingClient
                    .forwardGeocode({ query: item.location, limit: 1 })
                    .send();
                if (response && response.body && response.body.features && response.body.features.length > 0) {
                    geometry = {
                        type: 'Point',
                        coordinate: response.body.features[0].geometry.coordinates
                    };
                }
            } catch (err) {
                console.error(`Geocoding failed for ${item.location}:`, err.message || err);
            }
        }

        return {
            Title: item.Title,
            Description: item.Description,
            Img: item.Img && typeof item.Img === 'object' ? item.Img : { url: item.Img },
            price: item.price,
            discount: item.discount || 0,
            location: item.location,
            address: item.address || '',
            catogery: item.catogery || item.category || '',
            country: item.country,
            geometry
        };
    });

    const listings = await Promise.all(listingPromises);
    await Listing.insertMany(listings);
    console.log("Data Imported:", listings.length);
}
//module.exports = initdb;
initdb();



