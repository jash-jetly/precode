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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-xl mb-4">
                <Bot className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold mb-3">Let's Brainstorm</h1>
              <p className="text-slate-400">Tell me about your app idea and I'll help you refine it</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    App Name
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g., TaskMaster, FitTrack, etc."
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    App Idea
                  </label>
                  <textarea
                    value={appIdea}
                    onChange={(e) => setAppIdea(e.target.value)}
                    placeholder="Describe your app idea in a few sentences..."
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 resize-none"
                  />
                </div>

                <button
                  onClick={handleStartChat}
                  disabled={!appName.trim() || !appIdea.trim()}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors duration-200"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{appName}</h1>
            <p className="text-sm text-slate-400">Brainstorming Session</p>
          </div>
          <button
            onClick={handleEndBrainstorming}
            disabled={messages.length < 4}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors duration-200"
          >
            End Brainstorming
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'ai' && (
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-100 border border-slate-700'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-slate-800 rounded-2xl px-6 py-4 border border-slate-700">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 max-w-4xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
