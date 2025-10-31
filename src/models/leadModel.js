// Simple in-memory leads storage
let leads = [];

function saveLeads(newLeads) {
  leads = newLeads;
}

function getLeads() {
  return leads;
}

function clearLeads() {
  leads = [];
}

module.exports = { saveLeads, getLeads, clearLeads };
