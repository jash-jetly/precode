import { Sparkles, Rocket, GitBranch } from 'lucide-react';

interface LandingPageProps {
  onStartBrainstorm: () => void;
}

export default function LandingPage({ onStartBrainstorm }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-neutral-light text-neutral-dark">
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-accent-dark">
              Turn Ideas Into Reality
            </h1>
            <p className="text-xl text-neutral-dark max-w-2xl mx-auto mb-12">
              Transform your app concept into a structured user flow with AI-powered brainstorming.
              Get clarity, validation, and a visual roadmap in minutes.
            </p>
          </div>

          <button
            onClick={onStartBrainstorm}
            className="group relative px-8 py-4 bg-accent-dark hover:bg-accent-light rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-accent-light hover:scale-105 text-neutral-light"
          >
            <span className="flex items-center gap-3">
              <Rocket className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              Create App
            </span>
          </button>

          <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full">
            <div className="bg-neutral-light rounded-xl p-6 border border-neutral-dark">
              <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-accent-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Brainstorming</h3>
              <p className="text-neutral-dark">
                Chat with PRECODE.AI to refine your idea through intelligent questions
              </p>
            </div>

            <div className="bg-neutral-light rounded-xl p-6 border border-neutral-dark">
              <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center mb-4">
                <GitBranch className="w-6 h-6 text-accent-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visual User Flows</h3>
              <p className="text-neutral-dark">
                Automatically generate comprehensive flowcharts showing your app's user journey
              </p>
            </div>

            <div className="bg-neutral-light rounded-xl p-6 border border-neutral-dark">
              <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-accent-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to Build</h3>
              <p className="text-neutral-dark">
                Walk away with a clear roadmap and structured plan for your app development
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
