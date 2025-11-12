import { Sparkles, Rocket, GitBranch } from 'lucide-react';

interface LandingPageProps {
  onStartBrainstorm: () => void;
}

export default function LandingPage({ onStartBrainstorm }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-2xl mb-6">
              <Sparkles className="w-10 h-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Turn Ideas Into Reality
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
              Transform your app concept into a structured user flow with AI-powered brainstorming.
              Get clarity, validation, and a visual roadmap in minutes.
            </p>
          </div>

          <button
            onClick={onStartBrainstorm}
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50 hover:scale-105"
          >
            <span className="flex items-center gap-3">
              <Rocket className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              Create App
            </span>
          </button>

          <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Brainstorming</h3>
              <p className="text-slate-400">
                Chat with Gemini 2.5 Flash to refine your idea through intelligent questions
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <GitBranch className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visual User Flows</h3>
              <p className="text-slate-400">
                Automatically generate comprehensive flowcharts showing your app's user journey
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to Build</h3>
              <p className="text-slate-400">
                Walk away with a clear roadmap and structured plan for your app development
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
