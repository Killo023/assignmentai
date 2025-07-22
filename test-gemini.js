const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE');

async function test() {
  try {
    const models = await genAI.listModels();
    console.log('Available models:', models);
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

test(); 