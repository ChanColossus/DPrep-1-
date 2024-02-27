
const multer = require("multer");
const path = require("path");

const videoMulter = multer({
    limits: { fieldSize: 50 * 1024 * 1024 }, // Limit the maximum file size
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname).toLowerCase();
        if (ext !== ".mp4" && ext !== ".avi" && ext !== ".mov") { // Update allowed video file extensions
            cb(new Error("Unsupported file type! Only .mp4, .avi, and .mov files are allowed."), false);
            return;
        }
        cb(null, true);
    },
});

module.exports = videoMulter;