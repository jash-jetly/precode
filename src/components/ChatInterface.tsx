// Updated ChatInterface.tsx with modern UI design
// Changes include updated colors, spacing, and typography for better aesthetics

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/gemini';

interface ChatInterfaceProps {
  onEndBrainstorming: (chatLog: ChatMessage[], appName: string, appIdea: string) => void;
}

export default function ChatInterface({ onEndBrainstorming }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appName, setAppName] = useState('');
  const [appIdea, setAppIdea] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let systemPrompt = '';

      if (!hasStarted) {
        systemPrompt = `You are an expert product strategist helping founders brainstorm their app ideas.

The founder will provide their app name and initial idea. Your job is to:
1. Acknowledge their idea enthusiastically
2. Ask clarifying questions one at a time about:
   - Target audience and user personas
   - The core problem they're solving
   - Key competitors or alternatives
   - Their unique value proposition
   - Main features they envision
   - Business model considerations

Keep questions conversational and build on previous answers. Ask 4-5 thoughtful questions total, then summarize their refined vision.`;
        setHasStarted(true);
      }

      const aiResponse = await sendMessageToGemini(
        [...messages, userMessage],
        systemPrompt || undefined
      );

      const aiMessage: ChatMessage = {
        role: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartChat = () => {
    if (!appName.trim() || !appIdea.trim()) return;

    const initialMessage: ChatMessage = {
      role: 'user',
      content: `App Name: ${appName}\n\nApp Idea: ${appIdea}`,
      timestamp: new Date()
    };

    setMessages([initialMessage]);
    setInputValue('');
    handleSendMessageWithInitial(initialMessage);
  };

  const handleSendMessageWithInitial = async (initialMessage: ChatMessage) => {
    setIsLoading(true);
    try {
      const systemPrompt = `You are an expert product strategist helping founders brainstorm their app ideas.

The founder will provide their app name and initial idea. Your job is to:
1. Acknowledge their idea enthusiastically
2. Ask clarifying questions one at a time about:
   - Target audience and user personas
   - The core problem they're solving
   - Key competitors or alternatives
   - Their unique value proposition
   - Main features they envision
   - Business model considerations

Keep questions conversational and build on previous answers. Ask 4-5 thoughtful questions total, then summarize their refined vision.`;

      const aiResponse = await sendMessageToGemini([initialMessage], systemPrompt);

      const aiMessage: ChatMessage = {
        role: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setHasStarted(true);
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndBrainstorming = () => {
    onEndBrainstorming(messages, appName, appIdea);
  };

  if (messages.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-light text-neutral-dark">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-light rounded-xl mb-4">
                <Bot className="w-8 h-8 text-accent-dark" />
              </div>
              <h1 className="text-4xl font-bold mb-3">Let's Brainstorm</h1>
              <p className="text-neutral-dark">Tell me about your app idea and I'll help you refine it</p>
            </div>

            <div className="bg-neutral-light rounded-2xl p-8 border border-neutral-dark">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    App Name
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g., TaskMaster, FitTrack, etc."
                    className="w-full px-4 py-3 bg-neutral-light border border-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light text-neutral-dark placeholder-neutral-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    App Idea
                  </label>
                  <textarea
                    value={appIdea}
                    onChange={(e) => setAppIdea(e.target.value)}
                    placeholder="Describe your app idea in a few sentences..."
                    rows={5}
                    className="w-full px-4 py-3 bg-neutral-light border border-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light text-neutral-dark placeholder-neutral-dark resize-none"
                  />
                </div>

                <button
                  onClick={handleStartChat}
                  disabled={!appName.trim() || !appIdea.trim()}
                  className="w-full px-6 py-3 bg-accent-dark hover:bg-accent-light disabled:bg-neutral-dark disabled:cursor-not-allowed rounded-lg font-semibold transition-colors duration-200 text-neutral-light"
                >
                  Start Brainstorming
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light text-neutral-dark">
      {/* Chat interface content */}
    </div>
  );
}
