const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
//configure cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret:process.env.CLOUS_API_SECREATELEY 
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shelter_images', // folder name in cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'svg' ],
  },
});
module.exports={
    cloudinary,
    storage,
};
