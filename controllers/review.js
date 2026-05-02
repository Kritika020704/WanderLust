const Listing = require("../models/listing");
const review = require("../models/review");

module.exports.createReview = async(req, res) => {

    let listing = await Listing.findById(req.params.id)
    req.body.review.rating = Number(req.body.review.rating);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  };

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
  
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });
  
    await review.findByIdAndDelete(reviewId);
  
    res.redirect(`/listings/${id}`);
  };