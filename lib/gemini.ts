import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function processAssignment(content: string, context?: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are an advanced AI academic writing assistant. Your task is to enhance and improve the following assignment while maintaining its original intent and academic integrity.

Please:
1. Improve grammar, clarity, and sentence structure
2. Enhance the logical flow and organization
3. Add relevant examples and evidence where appropriate
4. Strengthen arguments and conclusions
5. Ensure proper academic tone and style
6. Maintain the original ideas and perspective

Original Assignment:
${content}

${context ? `Additional Context: ${context}` : ''}

Please provide an enhanced version of this assignment that demonstrates improved academic writing while preserving the student's original ideas and voice.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from Gemini API');
    }

    return text;
  } catch (error) {
    console.error('Error processing assignment with Gemini:', error);
    
    // Provide a fallback response in case of API failure
    return `
# Enhanced Assignment

Thank you for submitting your assignment. Due to technical difficulties with our AI service, we're providing general feedback and suggestions for improvement.

## Original Content Summary
${content.substring(0, 300)}${content.length > 300 ? '...' : ''}

## Suggestions for Enhancement

1. **Structure and Organization**
   - Ensure your assignment has a clear introduction, body, and conclusion
   - Use headings and subheadings to organize your content
   - Make sure each paragraph focuses on a single main idea

2. **Content Development**
   - Support your arguments with credible sources and evidence
   - Provide specific examples to illustrate your points
   - Address potential counterarguments to strengthen your position

3. **Writing Quality**
   - Review for grammar, spelling, and punctuation errors
   - Vary your sentence structure for better readability
   - Use academic language appropriate for your level

4. **Citations and References**
   - Ensure all sources are properly cited
   - Follow the required citation style (APA, MLA, etc.)
   - Include a complete bibliography or references list

Please revise your assignment based on these suggestions and consider using our chat feature for more specific guidance.
`;
  }
}

export async function chatWithAI(message: string, conversationHistory?: string[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const historyContext = conversationHistory && conversationHistory.length > 0 
      ? `Previous conversation:\n${conversationHistory.join('\n')}\n\n` 
      : '';

    const prompt = `
You are an expert academic writing tutor helping a student improve their assignment. Provide helpful, specific, and constructive feedback.

${historyContext}Student's question or request: ${message}

Please provide a helpful response that:
1. Addresses the student's specific question
2. Offers concrete suggestions for improvement
3. Maintains an encouraging and supportive tone
4. Provides specific examples when relevant
5. Helps the student learn and grow as a writer

Response:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from Gemini API');
    }

    return text;
  } catch (error) {
    console.error('Error in AI chat:', error);
    
    // Provide a fallback response
    const fallbackResponses = [
      "I'd be happy to help you with that! Could you provide more specific details about what you'd like to improve?",
      "That's a great question. For academic writing, I generally recommend focusing on clear structure, strong evidence, and proper citations.",
      "I'm having trouble connecting to our AI service right now, but I can offer some general advice: make sure your arguments are well-supported and your writing is clear and concise.",
      "Technical difficulties are preventing me from giving you a detailed response right now. Please try asking your question again in a moment."
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
} 