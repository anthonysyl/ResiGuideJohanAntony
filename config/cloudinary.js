
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');



// Configura cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configura storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        
        folder: 'conjuntos', // El nombre de la carpeta en Cloudinary
        format: async (req, file) => 'png', // 'jpeg', 'png', etc.
    }
});
const storageNoticias = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'noticias',
        format: async (req, file) => 'png',
    }
});

// ... (resto de tu configuración de Cloudinary)
const uploadCloudinary = multer({ storage: storage });
const uploadNoticias = multer({ storage: storageNoticias });

module.exports = { uploadCloudinary, uploadNoticias };

   


