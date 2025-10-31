function buildPrompt(lead, offer) {
  return `
Offer:
Name: ${offer.name}
Value props: ${Array.isArray(offer.value_props) ? offer.value_props.join('; ') : offer.value_props}
Ideal use cases: ${Array.isArray(offer.ideal_use_cases) ? offer.ideal_use_cases.join('; ') : offer.ideal_use_cases}

Prospect:
Name: ${lead.name}
Role: ${lead.role}
Company: ${lead.company}
Industry: ${lead.industry}
Location: ${lead.location}
LinkedIn bio / notes: ${lead.linkedin_bio}

Task:
Classify this prospect's buying intent with one label (High, Medium, or Low). Then, in 1–2 short sentences explain why. Output must start with "Intent: <High|Medium|Low>" followed by "Reason: ...".
`
}

module.exports = { buildPrompt };
