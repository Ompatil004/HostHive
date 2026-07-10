const Listing = require("../models/listing");
const mapToken = process.env.MAP_TOKEN;
var NodeGeocoder = require('node-geocoder');

let geocoder;

if (mapToken) {
    var options = {
        provider: process.env.GEOCODER_PROVIDER || 'opencage',
        httpAdapter: 'https',
        apiKey: mapToken,
        formatter: null
    };
    geocoder = NodeGeocoder(options);
}

//Index Route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.json(allListings);
};

//Show Route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      return res.status(404).json({ error: "Listing you requested for does not exist!" });
    }
    res.json(listing);
};

//Create Route
module.exports.createListing = async (req, res, next) => {
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    
    if (req.file) {
        let filename = req.file.filename;
        let url = '/uploads/' + filename;
        newlisting.image = { url, filename };
    } else {
        newlisting.image = {
            url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
            filename: "default"
        };
    }

    if (geocoder && req.body.listing.location) {
        try {
            const response = await geocoder.geocode(req.body.listing.location);
        } catch (error) {
            console.log("Geocoding error:", error.message);
        }
    }

    await newlisting.save();
    res.status(201).json({ message: "New listing created!", listing: newlisting });
};

//Update Route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true, new: true });

    if (!listing) {
        return res.status(404).json({ error: "Listing not found!" });
    }

    if (req.file) {
        let filename = req.file.filename;
        let url = '/uploads/' + filename;
        listing.image = { url, filename };
        await listing.save();
    }

    if (geocoder && req.body.listing.location) {
        try {
            const response = await geocoder.geocode(req.body.listing.location);
        } catch (error) {
            console.log("Geocoding error:", error.message);
        }
    }

    res.json({ message: "Listing Updated!", listing });
};

//Delete Listing
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        return res.status(404).json({ error: "Listing not found!" });
    }
    res.json({ message: "Listing Deleted!", listing: deletedListing });
};

module.exports.filter = async (req, res, next) => {
    let { id } = req.params;
    let allListings = await Listing.find({ category: id });
    res.json(allListings);
};

module.exports.search = async (req, res) => {
    let { location } = req.query;
    const allListings = await Listing.find({ location: { $regex: new RegExp(location, "i") } });
    res.json(allListings);
};