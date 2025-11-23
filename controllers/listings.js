const Listing = require("../models/listing");
const mapToken = process.env.MAP_TOKEN;
var NodeGeocoder = require('node-geocoder');

let geocoder;

// Initialize geocoder only if MAP_TOKEN is provided
if (mapToken) {
    var options = {
        provider: process.env.GEOCODER_PROVIDER || 'opencage', // Using opencage or mapbox as alternatives
        // Optional depending of the providers
        httpAdapter: 'https', // Default
        apiKey: mapToken, // for Mapquest, OpenCage, Google Premier
        formatter: null         // 'gpx', 'string', ...
    };

    geocoder = NodeGeocoder(options);
}

//Index Route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

//New route
module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

//Show Route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
};


//Create Route
module.exports.createListing = async (req, res, next) => {
    let newlisting = new Listing(req.body.listing);
    console.log(req.user);
    newlisting.owner = req.user._id;

    // Handle image upload
    if (req.file) {
        // When using Cloudinary, req.file contains the URL and public_id
        newlisting.image = {
            url: req.file.path,      // Cloudinary URL
            filename: req.file.filename // Cloudinary public_id
        };
    } else {
        // Default image if no file is uploaded
        newlisting.image = {
            url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
            filename: "default"
        };
    }

    // Only try to geocode if geocoder is configured
    if (geocoder && req.body.listing.location) {
        try {
            const response = await geocoder.geocode(req.body.listing.location);
            //newlisting.geometry = response[0];
        } catch (error) {
            console.log("Geocoding error:", error.message);
            // Continue without location data if geocoding fails
        }
    }

    await newlisting.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};


//Edit Route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/h_300,w_250");
    res.render("./listings/edit.ejs", { listing , originalImageUrl });
};


//Update Route
module.exports.updateListing =  async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true, new: true });

    // Update image if provided
    if (req.file) {
        // When using Cloudinary, req.file contains the URL and public_id
        listing.image = {
            url: req.file.path,      // Cloudinary URL
            filename: req.file.filename // Cloudinary public_id
        };
        await listing.save();
    }

    // Only try to geocode if geocoder is configured
    if (geocoder && req.body.listing.location) {
        try {
            const response = await geocoder.geocode(req.body.listing.location);
            //listing.geometry = response[0];
            //await listing.save();
        } catch (error) {
            console.log("Geocoding error:", error.message);
            // Continue without updating location data if geocoding fails
        }
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//Delete Listing
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};


module.exports.filter = async(req,res,next)=>{
    let {id} = req.params;
    let allListings = await Listing.find({category: id});
    if(allListings.length != 0){
        res.render("listings/index.ejs", { allListings });
    }else{
        req.flash("error",`No listing with ${id}`);
        res.redirect("/listings")
    }
}

module.exports.search = async (req, res) => {
    let { location } = req.query;

    const allListings = await Listing.find({ location });
    res.render("./listings/index.ejs", { allListings });
};