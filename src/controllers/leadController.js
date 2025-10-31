const { parseCsvBuffer } = require('../services/csvService');
const { saveLeads, getLeads } = require('../models/leadModel');

async function uploadLeads(req, res) {
  if (!req.file) return res.status(400).json({ 
    error: 'CSV file required in "file" field',
    help: 'Send a CSV file with fields: name,role,company,industry,location,linkedin_bio'
  });

  try {
    const leads = await parseCsvBuffer(req.file.buffer);
    
    // Validate required fields in the parsed data
    const requiredFields = ['name', 'role', 'company', 'industry', 'location', 'linkedin_bio'];
    const missingFields = leads.length > 0 ? 
      requiredFields.filter(field => !leads[0].hasOwnProperty(field)) : [];
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields in CSV',
        missingFields,
        expectedFields: requiredFields,
        help: 'CSV must include all required fields. Check field names and capitalization.'
      });
    }

    saveLeads(leads);
    return res.json({
      message: 'Leads uploaded successfully',
      count: leads.length,
      preview: leads.slice(0, 2).map(lead => ({
        name: lead.name,
        role: lead.role,
        company: lead.company
      })),
      fields: Object.keys(leads[0]),
      help: 'Use POST /api/score to run scoring on these leads'
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to parse CSV',
      details: err.message,
      help: 'Ensure the file is a valid CSV with the required fields'
    });
  }
}

function listLeads(req, res) {
  const leads = getLeads();
  return res.json(leads);
}

module.exports = { uploadLeads, listLeads };
