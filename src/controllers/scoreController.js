const { getOffer } = require('../models/offerModel');
const { getLeads } = require('../models/leadModel');
const { scoreLeads } = require('../services/scoreService');
const { jsonToCsv } = require('../utils/fileUtils');

let lastResults = [];

async function runScoring(req, res) {
  const offer = getOffer();
  const leads = getLeads();
  if (!offer) return res.status(400).json({ error: 'Offer not set. POST /api/offer first.' });
  if (!leads || leads.length === 0) return res.status(400).json({ error: 'No leads uploaded. POST /api/leads/upload first.' });

  try {
    lastResults = await scoreLeads(offer, leads);
    return res.json({ message: 'Scoring complete', results_count: lastResults.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Scoring failed', details: err.message });
  }
}

function getResults(req, res) {
  return res.json(lastResults || []);
}

async function exportResultsCsv(req, res) {
  if (!lastResults || lastResults.length === 0) return res.status(400).json({ error: 'No results to export' });
  try {
    const csvData = await jsonToCsv(lastResults);
    res.header('Content-Type', 'text/csv');
    res.attachment('scoring_results.csv');
    return res.send(csvData);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create CSV', details: err.message });
  }
}

module.exports = { runScoring, getResults, exportResultsCsv };
