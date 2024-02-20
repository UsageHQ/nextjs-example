'use client';

import { createSession, getSessions, setSessionName } from '@/app/chat/actions';
import { ChatSession } from '@/types/chat';
import React, { createContext, useState, useEffect } from 'react';

interface ChatContextType {
  chatSessions: ChatSession[];
  isLoaded: boolean;
  createSession: () => Promise<ChatSession | null>;
  setSessionName: (sessionId: string, name: string) => void;
  getSessionName: (sessionId: string) => string | null;
}

// Create the initial chat context
const initialChatContext: ChatContextType = {
  chatSessions: [],
  isLoaded: false,
  createSession: async () => null,
  setSessionName: () => null,
  getSessionName: () => null
};

// Create the chat context
export const ChatContext = createContext(initialChatContext);

// Create the chat context provider component
export const ChatContextProvider = ({
  userId,
  children
}: {
  userId: string;
  children: React.ReactNode;
}) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getSessions().then((res) => {
      if (!res) return;
      setIsLoaded(true);
      const s: ChatSession[] = res.map((session) => {
        return {
          id: session.id,
          name: session.attributes?.name || null,
          updatedAt: session.attributes?.inserted_at,
          createdAt: session.attributes?.inserted_at
        };
      });
      setChatSessions(s);
    });
  }, []);

  const _setSessionName = async (sessionId: string, name: string) => {
    const session = chatSessions.find((s) => s.id === sessionId);
    if (!session) return;
    if (session.name !== null) return;
    const n = name.replace(/['"]+/g, '');
    await setSessionName(sessionId, n);
    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return { ...s, name: n };
        } else {
          return s;
        }
      })
    );
  };

  const getSessionName = (sessionId: string) => {
    const s = chatSessions.find((s) => s.id === sessionId);
    if (s) {
      return s.name;
    } else {
      return null;
    }
  };

  const _createSession = async () => {
    const newSession = await createSession();
    if (newSession) {
      const newS: ChatSession = {
        id: newSession.id,
        name: newSession.attributes?.name || null,
        updatedAt: newSession.attributes?.inserted_at,
        createdAt: newSession.attributes?.inserted_at
      };

      setChatSessions((prev) => [...prev, newS]);
      return newS;
    } else {
      return null;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        createSession: _createSession,
        setSessionName: _setSessionName,
        getSessionName,
        chatSessions,
        isLoaded
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
