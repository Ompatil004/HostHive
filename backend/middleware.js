const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "You must be logged in to perform this action!" });
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ error: "Listing not found!" });
    }
    if (!listing.owner._id.equals(req.user._id)) {
        return res.status(403).json({ error: "You are not authorized to modify this listing!" });
    }
    next();
};

module.exports.validateSchema = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
  
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      return res.status(400).json({ error: errMsg });
    } else {
      next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        return res.status(400).json({ error: errMsg });
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ error: "Review not found!" });
    }
    if (!review.author._id.equals(req.user._id)) {
        return res.status(403).json({ error: "You are not authorized to delete this review!" });
    }
    next();
};