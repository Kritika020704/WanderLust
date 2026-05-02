const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { data } = require("./data");

mongoose
  .connect("mongodb+srv://kritikagupta361_db_user:kritika%402004@cluster0.8i1tubk.mongodb.net/wanderlust")
  
  .then(async () => {
    console.log("✅ DB connected");

    await Listing.deleteMany({});
    console.log("🗑️ Old listings deleted");

    await Listing.insertMany(data);
    console.log("🎉 Listings inserted");

    process.exit();
  })
  .catch(err => {
    console.error("❌ Error:", err);
  });
