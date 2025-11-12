export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface BrainstormSession {
  id?: string;
  appName: string;
  appIdea: string;
  chatLog: ChatMessage[];
  userFlow?: string;
  createdAt?: Date;
}
