// Simple in-memory offer storage
let currentOffer = null;

function saveOffer(offer) {
  currentOffer = offer;
}

function getOffer() {
  return currentOffer;
}

module.exports = { saveOffer, getOffer };
