import fetch from 'node-fetch';

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN || 'YOUR_HF_TOKEN_HERE';
const MODEL_URL = 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-6.7b-instruct';

async function callHuggingFace(inputs: string): Promise<string> {
  try {
    const response = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      return data[0].generated_text;
    }
    if (typeof data.generated_text === 'string') {
      return data.generated_text;
    }
    if (typeof data === 'string') {
      return data;
    }
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    return 'Error: Unable to get a response from DeepSeek model.';
  }
}

export async function processAssignment(content: string, context?: string): Promise<string> {
  const prompt = `\nYou are an advanced AI academic writing assistant. Your task is to enhance and improve the following assignment while maintaining its original intent and academic integrity.\n\nPlease:\n1. Improve grammar, clarity, and sentence structure\n2. Enhance the logical flow and organization\n3. Add relevant examples and evidence where appropriate\n4. Strengthen arguments and conclusions\n5. Ensure proper academic tone and style\n6. Maintain the original ideas and perspective\n\nOriginal Assignment:\n${content}\n\n${context ? `Additional Context: ${context}` : ''}\n\nPlease provide an enhanced version of this assignment that demonstrates improved academic writing while preserving the student's original ideas and voice.\n`;
  const result = await callHuggingFace(prompt);
  if (!result || result.trim().length === 0) {
    return `\n# Enhanced Assignment\n\nThank you for submitting your assignment. Due to technical difficulties with our AI service, we're providing general feedback and suggestions for improvement.\n\n## Original Content Summary\n${content.substring(0, 300)}${content.length > 300 ? '...' : ''}\n\n## Suggestions for Enhancement\n\n1. **Structure and Organization**\n   - Ensure your assignment has a clear introduction, body, and conclusion\n   - Use headings and subheadings to organize your content\n   - Make sure each paragraph focuses on a single main idea\n\n2. **Content Development**\n   - Support your arguments with credible sources and evidence\n   - Provide specific examples to illustrate your points\n   - Address potential counterarguments to strengthen your position\n\n3. **Writing Quality**\n   - Review for grammar, spelling, and punctuation errors\n   - Vary your sentence structure for better readability\n   - Use academic language appropriate for your level\n\n4. **Citations and References**\n   - Ensure all sources are properly cited\n   - Follow the required citation style (APA, MLA, etc.)\n   - Include a complete bibliography or references list\n\nPlease revise your assignment based on these suggestions and consider using our chat feature for more specific guidance.\n`;
  }
  return result;
}

export async function chatWithAI(message: string, conversationHistory?: string[]): Promise<string> {
  const historyContext = conversationHistory && conversationHistory.length > 0 
    ? `Previous conversation:\n${conversationHistory.join('\n')}\n\n` 
    : '';
  const prompt = `\nYou are an expert academic writing tutor helping a student improve their assignment. Provide helpful, specific, and constructive feedback.\n\n${historyContext}Student's question or request: ${message}\n\nPlease provide a helpful response that:\n1. Addresses the student's specific question\n2. Offers concrete suggestions for improvement\n3. Maintains an encouraging and supportive tone\n4. Provides specific examples when relevant\n5. Helps the student learn and grow as a writer\n\nResponse:\n`;
  const result = await callHuggingFace(prompt);
  if (!result || result.trim().length === 0) {
    const fallbackResponses = [
      "I'd be happy to help you with that! Could you provide more specific details about what you'd like to improve?",
      "That's a great question. For academic writing, I generally recommend focusing on clear structure, strong evidence, and proper citations.",
      "I'm having trouble connecting to our AI service right now, but I can offer some general advice: make sure your arguments are well-supported and your writing is clear and concise.",
      "Technical difficulties are preventing me from giving you a detailed response right now. Please try asking your question again in a moment."
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
  return result;
} 