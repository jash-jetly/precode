import { ChatMessage } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export async function sendMessageToGemini(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  const contents = messages.map(msg => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const requestBody: {
    contents: typeof contents;
    systemInstruction?: { parts: [{ text: string }] };
  } = {
    contents
  };

  if (systemPrompt) {
    requestBody.systemInstruction = {
      parts: [{ text: systemPrompt }]
    };
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

export async function generateUserFlow(chatLog: ChatMessage[]): Promise<string> {
  const systemPrompt = `You are an expert product designer and systems architect. Based on the brainstorming conversation, generate a comprehensive user flow using Mermaid.js syntax.

Create a master flow showing the main user journey, then create detailed feature-specific flows as needed. Use proper Mermaid.js flowchart syntax with:
- Clear start and end points
- Decision nodes for user choices
- Process nodes for actions
- Subgraphs for different features/modules

Return ONLY the Mermaid.js code, nothing else.`;

  const chatSummary = chatLog.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');

  const flowMessage: ChatMessage = {
    role: 'user',
    content: `Based on this brainstorming session, generate a detailed user flow in Mermaid.js format:\n\n${chatSummary}`,
    timestamp: new Date()
  };

  return sendMessageToGemini([flowMessage], systemPrompt);
}
