import { useState, useEffect, useRef } from 'react';
import { GitBranch, Loader2, Download, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../types';
import { generateUserFlow } from '../services/gemini';
import mermaid from 'mermaid';

interface FlowGenerationPageProps {
  chatLog: ChatMessage[];
  appName: string;
  appIdea: string;
}

export default function FlowGenerationPage({
  chatLog,
  appName,
  appIdea,
}: FlowGenerationPageProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [mermaidCode, setMermaidCode] = useState('');
  const [showChatLog, setShowChatLog] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
      },
    });
  }, []);

  useEffect(() => {
    if (mermaidCode && mermaidRef.current) {
      renderMermaid();
    }
  }, [mermaidCode]);

  const renderMermaid = async () => {
    if (!mermaidRef.current) return;

    try {
      mermaidRef.current.innerHTML = '';
      const { svg } = await mermaid.render('mermaid-diagram', mermaidCode);
      mermaidRef.current.innerHTML = svg;
    } catch (error) {
      console.error('Mermaid rendering error:', error);
      mermaidRef.current.innerHTML = `
        <div class="text-red-400 p-4 bg-red-900/20 rounded-lg border border-red-700">
          <p class="font-semibold mb-2">Error rendering diagram</p>
          <p class="text-sm">There was an issue rendering the Mermaid diagram. Please try generating again.</p>
        </div>
      `;
    }
  };

  const handleGenerateFlow = async () => {
    setIsGenerating(true);
    try {
      const flow = await generateUserFlow(chatLog);
      setMermaidCode(flow);
    } catch (error) {
      console.error('Error generating flow:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadCode = () => {
    const blob = new Blob([mermaidCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.replace(/\s+/g, '-').toLowerCase()}-user-flow.mmd`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{appName}</h1>
              <p className="text-sm text-slate-400">Generate User Flow</p>
            </div>
            <button
              onClick={() => setShowChatLog(!showChatLog)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              {showChatLog ? 'Hide' : 'View'} Chat Log
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {showChatLog && (
          <div className="mb-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Brainstorming Session
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {chatLog.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-900/30 border border-blue-700/50'
                      : 'bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase">
                      {message.role === 'user' ? 'You' : 'AI'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">User Flow Visualization</h2>
                <p className="text-sm text-slate-400">
                  AI-generated flowchart based on your brainstorming session
                </p>
              </div>
            </div>
            {mermaidCode && (
              <button
                onClick={handleDownloadCode}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
          </div>

          {!mermaidCode && !isGenerating && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-xl mb-4">
                <GitBranch className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Click below to generate a comprehensive user flow diagram based on your brainstorming
              </p>
              <button
                onClick={handleGenerateFlow}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold transition-colors duration-200"
              >
                Generate User Flow
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mb-4" />
              <p className="text-slate-300 font-medium">Generating user flow with Gemini 2.5 Flash...</p>
              <p className="text-sm text-slate-500 mt-2">This may take a moment</p>
            </div>
          )}

          {mermaidCode && !isGenerating && (
            <div>
              <div className="mb-6 bg-slate-900 rounded-lg p-4 border border-slate-700 overflow-x-auto">
                <div ref={mermaidRef} className="mermaid-container" />
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-300">Mermaid Code</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(mermaidCode);
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Copy to clipboard
                  </button>
                </div>
                <pre className="bg-slate-900 rounded-lg p-4 border border-slate-700 overflow-x-auto text-sm">
                  <code className="text-slate-300">{mermaidCode}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-900/20 border border-blue-700/50 rounded-xl p-6">
          <h3 className="font-semibold mb-2 text-blue-300">Next Steps</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>
                Review and refine the generated user flow to match your vision
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>
                Use this flowchart as a blueprint for feature planning and development
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>
                Share with your team to align on the user journey and priorities
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>
                Future phases: Database design, authentication, deployment, and full app build
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
