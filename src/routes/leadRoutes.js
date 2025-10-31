const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer with validation and limits
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Only accept CSV files
        if (!file.originalname.toLowerCase().endsWith('.csv')) {
            return cb(new Error('Only CSV files are allowed'));
        }
        if (file.mimetype !== 'text/csv' && file.mimetype !== 'application/csv') {
            return cb(new Error('File must be a CSV'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

const { uploadLeads, listLeads } = require('../controllers/leadController');

// Test upload endpoint for debugging
router.post('/test-upload', (req, res) => {
    console.log('Headers:', req.headers);
    console.log('Files:', req.files);
    console.log('Body:', req.body);
    res.json({ message: 'Test endpoint reached', headers: req.headers });
});

// Main upload route
router.post('/upload', (req, res) => {
    console.log('Starting file upload...');

    // Only accept a single file with field name 'file'
    upload.single('file')(req, res, function (err) {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({
                error: 'File upload error',
                message: err.message,
                help: 'Make sure to: 1) Use form-data 2) Key should be the file field (e.g. "file") 3) Select File type for the field'
            });
        }

        console.log('Upload request received');
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Request files:', req.files);

        // Normalize: if multer provided files array, take the first file as req.file
        if (!req.file && Array.isArray(req.files) && req.files.length > 0) {
            req.file = req.files[0];
        }

        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded',
                help: 'In Postman: 1) Use form-data 2) Add a key with type "File" and choose your CSV file'
            });
        }

        try {
            uploadLeads(req, res);
        } catch (err) {
            console.error('Upload error:', err);
            return res.status(500).json({
                error: 'Upload failed',
                details: err.message
            });
        }
    });
});

router.get('/', listLeads);

module.exports = router;
