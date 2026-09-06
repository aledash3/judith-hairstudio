const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            const error = new Error('Solo se permiten archivos de imagen');
            error.statusCode = 400;
            return cb(error);
        }

        cb(null, true);
    }
});

const uploadPortafolioImages = upload.fields([
    { name: 'fotoAntes', maxCount: 1 },
    { name: 'fotoDespues', maxCount: 1 }
]);

module.exports = {
    uploadPortafolioImages
};
