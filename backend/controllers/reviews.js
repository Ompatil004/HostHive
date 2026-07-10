const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//Create Review
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // Populate review author info before returning
    const populatedReview = await Review.findById(newReview._id).populate("author");

    res.status(201).json({ message: "New review created!", review: populatedReview });
}; 

//Delete Review
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "Review Deleted!" });
};