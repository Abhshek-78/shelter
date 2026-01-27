const mongoose = require('mongoose');
const Review = require('./review');
const { string } = require('joi');
const Schema = mongoose.Schema;


const ListenSchema = new Schema({
    Title: {
        type: String,
        
    },
    Description: String,
    Img: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    review:[
        {
            type:Schema.Types.ObjectId,
            ref: 'review',
        },
    ],
    owner :{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

// Remove associated reviews when a listing eleted
ListenSchema.post('findOneAndDelete', async function(listing) {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } });
    }
});



const Listen = mongoose.model('Listen', ListenSchema);
module.exports = Listen;