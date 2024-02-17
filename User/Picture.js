import multer from 'multer';

let upload;

try {
    // Image storage
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'store/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        },
    });

    upload = multer({ 
        storage: storage,
    });

} catch (error) {
    console.error('Error during multer initialization:', error);
}

export default upload;
