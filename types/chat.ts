import { Request } from '@usagehq/sdk-next';

export type ChatSession = {
  id: string;
  name: string | null;
  createdAt: string | undefined;
  updatedAt: string | undefined;
};

export type ChatMessage = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
  updatedAt: string;
};

export type ChatSessionWithMessages = ChatSession & {
  messages: ChatMessage[];
};

export type TimeGroupedSessions = Record<string, ChatSession[]>;

export type UserChatData = {
  uid: string;
  chatData: ChatSessionWithMessages[];
};

export type Metadata = { input: string; isGettingTopic: boolean };
export type ChatRequest = Request<Metadata>;
export type ChatContext = { role: 'user' | 'assistant'; content: string }[];
