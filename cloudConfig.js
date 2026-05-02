const cloudinary = require('cloudinary').v2;

// universal import (handles all versions)
const cloudinaryStorage = require("multer-storage-cloudinary");
const CloudinaryStorage =
  cloudinaryStorage.CloudinaryStorage || cloudinaryStorage;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png", "jpg", "jpeg"], // fixed spelling
  },
});

module.exports = {
  cloudinary,
  storage,
};