require('dotenv').config();
const mongoose = require('mongoose');
const data = require('./data.js');
const Listing = require('../models/listing');

// Mongo URI (env or local fallback)
const mongoUri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/your_local_db_name';

console.log('Using Mongo URI:', mongoUri);

async function initDB() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // 2. Clear existing data
    await Listing.deleteMany({});
    console.log('🧹 Cleared Listing collection');

    // 3. Normalize data (handle both export formats)
    let docs = Array.isArray(data)
      ? data
      : (data && data.data ? data.data : []);

    if (!docs || docs.length === 0) {
      console.warn('⚠️ No documents found in data.js');
      return;
    }

    // 4. Add owner field correctly (ObjectId)
    const User = require("../models/user");

// get one real user
const user = await User.findOne();

if (!user) {
  console.log("❌ No user found in DB");
  return;
}

// add owner to all docs
docs = docs.map((obj) => ({
  ...obj,
  owner: user._id
}));
    

    // 5. Insert into DB
    const res = await Listing.insertMany(docs);
    console.log(`🚀 Inserted ${res.length} documents`);

  } catch (err) {
    console.error('❌ Error during DB init:', err);
  } finally {
    // 6. Disconnect cleanly
    await mongoose.disconnect();
    console.log('🔌 Mongoose disconnected. Exiting.');
    process.exit(0);
  }
}

// Run script
initDB();