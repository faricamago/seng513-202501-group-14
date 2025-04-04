const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage to create a folder per user (relative to the app root)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get the user id from the request body
    const userId = req.body.user;
    // Create a directory path such as "./uploads/<userId>"
    const uploadPath = path.join(__dirname, '../uploads', userId);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create a unique filename using the current timestamp and original name
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
