// test-atlas.js — put in project root (MAJORPROJECT)
require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    const uri = process.env.MONGO_URL;
    if (!uri) throw new Error('MONGO_URL not set in .env');
    console.log('Trying to connect to:', uri.slice(0, 60) + (uri.length > 60 ? '…' : ''));
    await mongoose.connect(uri);
    console.log('OK - connected to Atlas');
    await mongoose.disconnect();
    console.log('Disconnected. Test complete.');
  } catch (err) {
    console.error('Connection failed:', err.message || err);
    process.exit(1);
  }
})();
