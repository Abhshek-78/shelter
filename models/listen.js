const mongoose = require('mongoose');
const review = require('./review');
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
            ref:review,
        },
    ]
});

const Listen = mongoose.model('Listen', ListenSchema);
module.exports = Listen;