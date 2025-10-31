const { ruleScoreForLead } = require('./ruleEngine');
const { classifyIntent } = require('./aiService');

/**
 * scoreLeads: Scores each lead using rule-based logic and AI intent classification.
 * Returns an array of scored lead objects with intent, score, and reasoning.
 * Rule Layer: max 50 points (role, industry, completeness)
 * AI Layer: max 50 points (intent from OpenAI or fallback)
 * Final score: rule_score + ai_points (capped at 100)
 */

async function scoreLeads(offer, leads) {
  // Run AI classification in parallel to avoid serial waits for each lead.
  // Keep per-lead error handling so one failing AI call doesn't crash the whole batch.
  const promises = leads.map(async (lead) => {
    const ruleScore = ruleScoreForLead(lead, offer);
    try {
      const { intent, aiPoints, reasoning, raw } = await classifyIntent(lead, offer);
      const finalScore = Math.min(100, ruleScore + aiPoints);
      return {
        name: lead.name,
        role: lead.role,
        company: lead.company,
        industry: lead.industry,
        location: lead.location,
        intent,
        score: finalScore,
        reason: reasoning,
        rule_score: ruleScore,
        ai_points: aiPoints,
        raw_ai_output: raw
      };
    } catch (err) {
      // On error, return a best-effort result and record the error in reason
      return {
        name: lead.name,
        role: lead.role,
        company: lead.company,
        industry: lead.industry,
        location: lead.location,
        intent: 'Unknown',
        score: Math.min(100, ruleScore),
        reason: `AI error: ${err && err.message ? err.message : String(err)}`,
        rule_score: ruleScore,
        ai_points: 0,
        raw_ai_output: null
      };
    }
  });

  return Promise.all(promises);
}

module.exports = { scoreLeads };
