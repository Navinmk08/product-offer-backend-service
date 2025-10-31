const OpenAI = require('openai');

function createClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Warn loudly in dev so users know AI will use a fallback
    console.warn('WARNING: OPENAI_API_KEY is not set. The app will use a local fallback AI response (Low intent). To enable real AI scoring, set OPENAI_API_KEY in your environment.');

    // Return a stub client so the app can run without an API key in dev.
    // The stub matches the subset of the API used in the code: client.chat.completions.create()
    return {
      chat: {
        completions: {
          create: async (opts) => {
            // Provide a clearer stub response that follows the expected output format
            const fallback = 'Intent: Low\nReason: OPENAI_API_KEY not set; using deterministic fallback response for local development.';
            return { choices: [{ message: { content: fallback } }] };
          }
        }
      }
    };
  }

  // OpenAI v4 uses a direct OpenAI client constructor
  return new OpenAI({ apiKey });
}

module.exports = { createClient };
