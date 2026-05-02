const Listing = require("../models/listing");
const axios = require("axios");

/*async function getCoordinates(location) {
  const url = "https://nominatim.openstreetmap.org/search";

  const response = await axios.get(url, {
    params: {
      q: location,
      format: "json",
      limit: 1
    },
    headers: {
      "User-Agent": "wanderlust-app"
    }
  });

  if (response.data.length === 0) {
    throw new Error("Location not found");
  }

  const { lat, lon } = response.data[0];

  return [parseFloat(lon), parseFloat(lat)]; // [lng, lat]
}
*/
async function getCoordinates(location) {
  try {
    const url = "https://nominatim.openstreetmap.org/search";

    const response = await axios.get(url, {
      params: {
        q: location,
        format: "json",
        limit: 1
      },
      headers: {
        "User-Agent": "wanderlust-app/1.0 (kritikagupta361@gmail.com)"
      }
    });

    if (response.data.length === 0) {
      return [0, 0]; // default coords if not found
    }

    const { lat, lon } = response.data[0];
    return [parseFloat(lon), parseFloat(lat)];

  } catch (err) {
    console.log("Geocoding failed:", err.message);
    return [0, 0]; // don't crash the server
  }
}
//module.exports.index = async (req, res) => {
  //const listings = await Listing.find({});
    //res.render("listings/index", { listings });
  //};
  module.exports.index = async (req, res) => {
    let { search } = req.query;
  
    let query = {};
  
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { country: { $regex: search, $options: "i" } }
        ]
      };
    }
  
    const listings = await Listing.find(query);
  
    res.render("listings/index", { listings });
  };

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  };

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", 
    populate: {
      path: "author",
    },
  })
  .populate("owner");
    if(!listing) {
      req.flash("error","Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  };

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;

if (req.file) {
  const url = req.file.path;
  const filename = req.file.filename;

  listing.image = { url, filename };
}

 // 🌍 ADD 
 const coords = await getCoordinates(listing.location);

 listing.geometry = {
   type: "Point",
   coordinates: coords
 };

await listing.save();
req.flash("success", "New listing created!");
res.redirect("/listings");
  };

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error", "listing you requested for doesn't exist");
      res.redirect("/listings");
    }
    let orginialImageUrl = listing.image.url;
    orginialImageUrl = orginialImageUrl.replace("//upload", "/upload/h_100,w_100,c_fill");
    res.render("listings/edit.ejs", {listing,orginialImageUrl});
  };

  module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "send valid data for listing");
    }
  
    let { id } = req.params;
  
    // 🟢 STEP 1: get listing first
    let listing = await Listing.findById(id);
  
    // 🟢 STEP 2: update basic fields
    Object.assign(listing, req.body.listing);
  
    // 🟢 STEP 3: update geometry (IMPORTANT)
    if (req.body.listing.location) {
      const coords = await getCoordinates(req.body.listing.location);
  
      if (coords) {
        listing.geometry = {
          type: "Point",
          coordinates: coords
        };
      }
    }
  
    // 🟢 STEP 4: image logic (your existing)
    if (req.file) {
      const url = req.file.path;
      const filename = req.file.filename;
  
      listing.image = { url, filename };
    }
  
    // 🟢 STEP 5: save
    await listing.save();
  
    res.redirect(`/listings/${id}`);
  };

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("deletedListing");
    res.redirect("/listings");
  };