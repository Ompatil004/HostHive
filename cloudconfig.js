const cloudinary = require('cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
        folder: 'HostHive', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif']
    }
});

module.exports = {
    storage: storage,
};