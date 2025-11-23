const Joi = require('joi');
module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        Title:Joi.string().required(),
        Description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        
    })
});