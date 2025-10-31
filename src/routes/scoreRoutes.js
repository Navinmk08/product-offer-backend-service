const express = require('express');
const router = express.Router();
const { runScoring, getResults, exportResultsCsv } = require('../controllers/scoreController');

router.post('/', runScoring);
router.get('/', getResults);
router.get('/export', exportResultsCsv);

module.exports = router;
