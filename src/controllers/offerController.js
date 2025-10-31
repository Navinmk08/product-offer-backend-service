const { saveOffer, getOffer } = require('../models/offerModel');

function createOffer(req, res) {
  const { name, value_props, ideal_use_cases } = req.body;

  // Validate required fields and types
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      error: 'Invalid name',
      help: 'name is required and must be a non-empty string'
    });
  }

  if (!ideal_use_cases || !Array.isArray(ideal_use_cases) || ideal_use_cases.length === 0) {
    return res.status(400).json({
      error: 'Invalid ideal_use_cases',
      help: 'ideal_use_cases is required and must be a non-empty array of strings'
    });
  }

  if (value_props && !Array.isArray(value_props)) {
    return res.status(400).json({
      error: 'Invalid value_props',
      help: 'value_props must be an array of strings if provided'
    });
  }

  const offer = {
    name: name.trim(),
    value_props: (value_props || []).map(v => String(v).trim()).filter(Boolean),
    ideal_use_cases: ideal_use_cases.map(u => String(u).trim()).filter(Boolean)
  };

  // Validate after normalization
  if (offer.ideal_use_cases.length === 0) {
    return res.status(400).json({
      error: 'Invalid ideal_use_cases',
      help: 'ideal_use_cases must contain at least one non-empty string'
    });
  }

  saveOffer(offer);
  return res.json({
    message: 'Offer saved successfully',
    offer,
    help: 'Use POST /api/leads/upload to upload leads CSV, then POST /api/score to score them against this offer'
  });
}

function getCurrentOffer(req, res) {
  const offer = getOffer();
  if (!offer) return res.status(404).json({ error: 'No offer set' });
  return res.json(offer);
}

module.exports = { createOffer, getCurrentOffer };
