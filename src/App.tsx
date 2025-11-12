import { useState } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import FlowGenerationPage from './components/FlowGenerationPage';
import { ChatMessage } from './types';

type AppScreen = 'landing' | 'chat' | 'flow';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [appName, setAppName] = useState('');
  const [appIdea, setAppIdea] = useState('');

  const handleStartBrainstorm = () => {
    setCurrentScreen('chat');
  };

  const handleEndBrainstorming = (
    messages: ChatMessage[],
    name: string,
    idea: string
  ) => {
    setChatLog(messages);
    setAppName(name);
    setAppIdea(idea);
    setCurrentScreen('flow');
  };

  return (
    <>
      {currentScreen === 'landing' && (
        <LandingPage onStartBrainstorm={handleStartBrainstorm} />
      )}
      {currentScreen === 'chat' && (
        <ChatInterface onEndBrainstorming={handleEndBrainstorming} />
      )}
      {currentScreen === 'flow' && (
        <FlowGenerationPage
          chatLog={chatLog}
          appName={appName}
          appIdea={appIdea}
        />
      )}
    </>
  );
}

export default App;
