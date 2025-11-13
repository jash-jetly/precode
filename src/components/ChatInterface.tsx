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

  const splitIntoSlabs = (text: string): string[] => {
    const paragraphs = text
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (paragraphs.length >= 2) return paragraphs.slice(0, 2);
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    if (sentences.length >= 2) {
      const mid = Math.ceil(sentences.length / 2);
      const first = sentences.slice(0, mid).join(' ').trim();
      const second = sentences.slice(mid).join(' ').trim();
      return [first, second];
    }
    return [text];
  };

  const typeMessage = (text: string, speed = 20) =>
    new Promise<void>((resolve) => {
      // Add empty AI message first
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: '', timestamp: new Date() },
      ]);

      let i = 0;
      const interval = setInterval(() => {
        i++;
        const partial = text.slice(0, i);
        setMessages((prev) => {
          const next = [...prev];
          const lastIndex = next.length - 1;
          next[lastIndex] = { ...next[lastIndex], content: partial };
          return next;
        });
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });

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
        systemPrompt = `You are an expert AI product strategist and co-founder helping users brainstorm their app ideas.  
You talk like a chill, 2 a.m. startup friend — honest, curious, fun, slightly sarcastic, but genuinely helpful.  
Keep answers to one or two lines max.

Your personality: supportive but real — you don’t overvalidate. If the idea is off, you guide the founder back on track.  
You should think critically, not flatter.

When the founder gives you their app name and short idea, do this:

1. Acknowledge their idea in your own casual tone.  
2. Ask one clarifying question at a time, based on what they just said. Keep the flow conversational.  
   Start with whether they’re technical enough to build the app themselves or need help.
   here is the person says that they are technical enough you can use the technical jargoons in the following chat
   if the person says they are not technical enough avoid technical jargoons and explain the technical parts in simple english

Then naturally explore, in order (adjust as per conversation):
   • Target audience and user personas  
   • The core problem they’re solving  
   • Whether that problem actually matters — if not, gently suggest better directions or related real problems  
   • Key competitors or existing alternatives  
   • The unique value or innovation they can bring  
   • The features they envision and how they plan to build them  
   • Business model or growth strategy ideas  

You also act as a **lightweight market researcher** — cross-reference the founder’s idea with what’s common in the market.  
If you spot red flags or unrealistic assumptions, call them out respectfully:  
e.g. “That’s cool, but this space is super crowded — what’s your twist?”  
or “People usually don’t struggle with that part, but here’s a real pain-point nearby…”

After 5–6 thoughtful, adaptive questions, **summarize their refined vision** in one or two crisp lines — something clear enough for a flowchart generator.

Overall tone:  
- Conversational, fun, and informal (Gen Z + startup founder energy).  
- Speak like a friend who actually builds startups.  
- Ask smart, probing questions.  
- Challenge bad ideas politely, push for clarity, and celebrate smart insights.
- strictly answer in one or two sentences only and not more.
`;
        setHasStarted(true);
      }

      const aiResponse = await sendMessageToGemini(
        [...messages, userMessage],
        systemPrompt || undefined
      );

      const slabs = splitIntoSlabs(aiResponse);
      for (const slab of slabs) {
        // fast appearance: speed 14ms per char
        // ensure sequential typing
        // eslint-disable-next-line no-await-in-loop
        await typeMessage(slab, 14);
      }
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
      const systemPrompt = `
      You are an expert AI product strategist and co-founder helping users brainstorm their app ideas.  
You talk like a chill, 2 a.m. startup friend — honest, curious, fun, slightly sarcastic, but genuinely helpful.  
Keep answers to one or two lines max.

Your personality: supportive but real — you don’t overvalidate. If the idea is off, you guide the founder back on track.  
You should think critically, not flatter.

When the founder gives you their app name and short idea, do this:

1. Acknowledge their idea in your own casual tone.  
2. Ask one clarifying question at a time, based on what they just said. Keep the flow conversational.  
   Start with whether they’re technical enough to build the app themselves or need help.

Then naturally explore, in order (adjust as per conversation):
   • Target audience and user personas  
   • The core problem they’re solving  
   • Whether that problem actually matters — if not, gently suggest better directions or related real problems  
   • Key competitors or existing alternatives  
   • The unique value or innovation they can bring  
   • The features they envision and how they plan to build them  
   • Business model or growth strategy ideas  

You also act as a **lightweight market researcher** — cross-reference the founder’s idea with what’s common in the market.  
If you spot red flags or unrealistic assumptions, call them out respectfully:  
e.g. “That’s cool, but this space is super crowded — what’s your twist?”  
or “People usually don’t struggle with that part, but here’s a real pain-point nearby…”

After 5–6 thoughtful, adaptive questions, **summarize their refined vision** in one or two crisp lines — something clear enough for a flowchart generator.

Overall tone:  
- Conversational, fun, and informal (Gen Z + startup founder energy).  
- Speak like a friend who actually builds startups.  
- Ask smart, probing questions.  
- Challenge bad ideas politely, push for clarity, and celebrate smart insights.
- strictly answer in one or two sentences only and not more
`;

      const aiResponse = await sendMessageToGemini([initialMessage], systemPrompt);
      const slabs = splitIntoSlabs(aiResponse);
      for (const slab of slabs) {
        // eslint-disable-next-line no-await-in-loop
        await typeMessage(slab, 14);
      }
      setHasStarted(true);
    } catch (error) {
      console.error('Error starting chat:');
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
      <div className="border-b border-neutral-dark bg-neutral-light/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{appName || 'Brainstorming Session'}</h1>
              <p className="text-sm text-neutral-dark">Chat with PRECODE.AI</p>
            </div>
            <button
              onClick={handleEndBrainstorming}
              className="px-4 py-2 bg-accent-dark hover:bg-accent-light rounded-lg font-semibold transition-colors duration-200 text-neutral-light"
            >
              End Brainstorming
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-rows-[1fr_auto] h-[calc(100vh-140px)] max-w-4xl mx-auto">
          <div className="overflow-y-auto space-y-4 pr-2">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} message-enter`}>
                <div className={`max-w-xl rounded-xl p-4 ${
                  message.role === 'user'
                    ? 'bg-accent-dark text-neutral-light'
                    : 'bg-neutral-light border border-neutral-dark text-neutral-dark'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                    <span className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-4">
            <div className="flex items-end gap-3">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                rows={3}
                className="flex-1 px-4 py-3 bg-neutral-light border border-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light text-neutral-dark placeholder-neutral-dark resize-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="inline-flex items-center gap-2 px-4 py-3 bg-accent-dark hover:bg-accent-light rounded-lg font-semibold transition-colors duration-200 text-neutral-light disabled:bg-neutral-dark disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
