# Rule Logic & AI Prompting

## Rule Layer (max 50)
- Role relevance:
  - decision maker (+20): CEO, Founder, Head, VP, Director, Chief, Owner
  - influencer (+10): Manager, Lead, Senior, Strategist, Principal, Architect
- Industry match:
  - exact match with any ideal_use_cases -> +20
  - adjacent (keyword overlap) -> +10
- Data completeness:
  - all fields present (name, role, company, industry, location, linkedin_bio) -> +10

## AI Layer (max 50)
- Prompt includes Offer and Prospect context.
- Ask model to output:
  Intent: <High|Medium|Low>
  Reason: <1-2 sentences>
- Map: High=50, Medium=30, Low=10

## Final Score
final_score = rule_score + ai_points (capped to 100)
