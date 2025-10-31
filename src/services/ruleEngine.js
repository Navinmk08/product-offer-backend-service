/**
 * ruleScoreForLead: Assigns points for role, industry, and data completeness.
 * Role: +20 decision maker, +10 influencer, else 0
 * Industry: +20 exact match, +10 adjacent, else 0
 * Completeness: +10 if all fields present
 * Max rule score: 50
 */

function ruleScoreForLead(lead, offer) {
  let score = 0;

  const title = (lead.role || '').toLowerCase();
  const decisionMakerKeywords = ['ceo', 'founder', 'co-founder', 'head', 'vp', 'vice president', 'director', 'chief', 'owner', 'president'];
  const influencerKeywords = ['manager', 'lead', 'senior', 'strategist', 'principal', 'architect'];

  if (decisionMakerKeywords.some(k => title.includes(k))) score += 20;
  else if (influencerKeywords.some(k => title.includes(k))) score += 10;

  const industry = (lead.industry || '').toLowerCase();
  const idealUseCases = (offer.ideal_use_cases || []).map(s => s.toLowerCase());

  let industryScore = 0;
  for (const ic of idealUseCases) {
    if (!industry) continue;
    if (industry === ic) { industryScore = Math.max(industryScore, 20); break; }
    const icWords = ic.split(/\W+/).filter(Boolean);
    const overlap = icWords.some(w => industry.includes(w));
    if (overlap) industryScore = Math.max(industryScore, 10);
  }
  score += industryScore;

  const required = ['name', 'role', 'company', 'industry', 'location', 'linkedin_bio'];
  const allPresent = required.every(k => (lead[k] || '').trim().length > 0);
  if (allPresent) score += 10;

  return Math.min(score, 50);
}

module.exports = { ruleScoreForLead };
