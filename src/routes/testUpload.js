const express = require('express');
const router = express.Router();
const multer = require('multer');

// Basic multer setup
const upload = multer({ storage: multer.memoryStorage() });

// Simple test endpoint
router.post('/test', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: 'No file received',
            help: 'Ensure you are sending a file with field name "file"',
            receivedFields: Object.keys(req.body || {}),
            contentType: req.headers['content-type']
        });
    }

    // Return success with file details
    res.json({
        success: true,
        fileDetails: {
            filename: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype
        }
    });
});

module.exports = router;