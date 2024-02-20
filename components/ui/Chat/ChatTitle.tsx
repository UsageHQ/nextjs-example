'use client';

import { ChatContext } from '@/app/context/ChatContext';
import { useContext } from 'react';

export default function ChatTitle({ sessionId }: { sessionId: string }) {
  const { getSessionName } = useContext(ChatContext);
  const name = getSessionName(sessionId) || 'Ask me anything';
  return <div className="font-medium">{name}</div>;
}
