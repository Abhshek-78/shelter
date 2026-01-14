const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const ListenSchema = new Schema({
    Title: {
        type: String,
        
    },
    Description: String,
    Img: {
        type: String,
        default: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
        set: (v) => (typeof v === 'string' && v.trim() === '') 
            ? 'https://images.unsplash.com/photo-1524758631624-e2822e304c36' 
            : v,
    },
    price: Number,
    location: String,
    country: String,
    review:[
        {
            type:Schema.Types.ObjectId,
            ref: 'review',
        },
    ]
});

// Remove associated reviews when a listing is deleted
ListenSchema.post('findOneAndDelete', async function(listing) {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } });
    }
});



const Listen = mongoose.model('Listen', ListenSchema);
module.exports = Listen;