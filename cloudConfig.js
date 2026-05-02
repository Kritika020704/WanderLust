const cloudinary = require("cloudinary").v2;
const multerStorageCloudinary = require("multer-storage-cloudinary");

const CloudinaryStorage = multerStorageCloudinary.CloudinaryStorage;

// config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,   // 👈 THIS is important
  params: {
    folder: "wanderlust_DEV",
    allowed_formats: ["png", "jpg", "jpeg"], // 👈 also fixed spelling
  },
});

module.exports = {
  cloudinary,
  storage,
};