const express = require('express');
const router = express.Router();
const { createOffer, getCurrentOffer } = require('../controllers/offerController');

router.post('/', createOffer);
router.get('/', getCurrentOffer);

module.exports = router;
