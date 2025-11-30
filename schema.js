//joi is used for validation 
const Joi = require('joi');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        category: Joi.string().valid(
            "trending",
            "rooms",
            "amazingviews",
            "iconic cities",
            "amazing pools",
            "beach",
            "cabins",
            "OMG",
            "farms",
            "camping",
            "castles"
        ).required()
    }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

module.exports = { listingSchema, reviewSchema };