const mongoose = require("mongoose");
const Listing = require("./models/listing");
const axios = require("axios");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);

async function getCoordinates(location) {
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

  if (response.data.length === 0) return null;

  const { lat, lon } = response.data[0];
  return [parseFloat(lon), parseFloat(lat)];
}

async function fixListings() {
  const listings = await Listing.find({ geometry: { $exists: false } });

  for (let listing of listings) {
    console.log("Fixing:", listing.title);

    const coords = await getCoordinates(listing.location);

    if (coords) {
      listing.geometry = {
        type: "Point",
        coordinates: coords
      };
      await listing.save();
    }
  }

  console.log("Done fixing listings");
  mongoose.connection.close();
}

fixListings();