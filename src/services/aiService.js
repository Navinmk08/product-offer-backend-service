const { createClient } = require('../config/openaiConfig');
const { buildPrompt } = require('../utils/promptUtils');

const client = createClient();

async function classifyIntent(lead, offer) {
  const prompt = buildPrompt(lead, offer);
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  // OpenAI v4 client: use client.chat.completions.create
  const resp = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'You are a helpful assistant that classifies prospect buying intent as High, Medium or Low and explains briefly.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0,
    max_tokens: 200
  });

  // response structure similar: choices[0].message.content
  const text = resp.choices[0].message.content.trim();

  let intent = null;
  let reasoning = '';

  const labelMatch = text.match(/\b(High|Medium|Low)\b/i);
  if (labelMatch) intent = labelMatch[1].charAt(0).toUpperCase() + labelMatch[1].slice(1).toLowerCase();
  const sentences = text.split(/(?<=[.?!])\s+/).filter(Boolean);
  if (sentences.length > 0) reasoning = sentences.slice(0,2).join(' ');

  if (!intent) {
    if (/high intent|very interested|ready to buy/i.test(text)) intent = 'High';
    else if (/medium|some interest|could consider/i.test(text)) intent = 'Medium';
    else intent = 'Low';
    reasoning = reasoning || text.slice(0,250);
  }

  const mapping = { High: 50, Medium: 30, Low: 10 };
  const aiPoints = mapping[intent] || 10;

  return { intent, aiPoints, reasoning, raw: text };
}

module.exports = { classifyIntent };
