'use client';

import { createSession, queue } from '@/app/chat/actions';
import { ChatContext as ReactChatContext } from '@/app/context/ChatContext';
import Message from '@/components/ui/Chat/Message';
import ChatInput from '@/components/ui/Chat/ChatInput';
import { Metadata, ChatRequest, ChatContext } from '@/types/chat';
import { getResponseContent } from '@/utils/chat';
import { useSession } from '@usagehq/sdk-next';
import { useEffect, useContext, useState, useRef, useCallback } from 'react';

const PageDetail = ({ params }: { params: { sessionId: string } }) => {
  const textboxRef = useRef<HTMLTextAreaElement>(null); //use to focus
  const { setSessionName, getSessionName } = useContext(ReactChatContext);
  const { state } = useSession<Metadata>(
    {
      createSession
    },
    params.sessionId
  );
  const [context, setContext] = useState<ChatContext>([]);

  useEffect(() => {
    let newRequests: ChatRequest[] = [];
    if (state?.session.requests) {
      state.session.requests.forEach((r) => {
        if (r.req_metadata?.isGettingTopic === true) {
          if (r.status === 'finished') {
            setSessionName(params.sessionId, getResponseContent(r));
          }
        } else newRequests = [...newRequests, r];
      });
    }

    if (state?.active_requests) {
      Object.entries(state.active_requests).forEach(([k, v]) => {
        const idx = newRequests.findIndex((nr) => nr.id === k);
        if (idx !== -1) {
          newRequests[idx] = { ...newRequests[idx], ...v };
        }
      });
    }
    const newContext =
      newRequests.flatMap((r) => {
        return [
          { role: 'user', content: r.req_metadata?.input },
          {
            role: 'assistant',
            content: getResponseContent(r)
          }
        ] as const;
      }) ?? [];

    setContext(newContext);
    if (Object.keys(state?.active_requests ?? {}).length === 0) {
      textboxRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (
      Object.keys(state?.session.requests ?? []).length === 1 &&
      getSessionName(params.sessionId) === null &&
      state?.session.requests[0].status === 'finished'
    ) {
      const topicPrompt = `Generate name based on the first 2 messages in this conversation. The topic is maximized to 7 words.`;
      queue(params.sessionId, topicPrompt, context, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onSend = useCallback(
    (message: ChatContext[number]) => {
      const input = message.content;
      queue(params.sessionId, input, context).then(() => {
        textboxRef.current?.focus();
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context]
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollTop = messagesEndRef.current?.offsetTop ?? 0;
    }, 0);
  }, [state?.session?.requests, state?.active_requests, context]);

  return (
    <>
      <div ref={scrollRef} className="w-full h-full overflow-y-auto">
        <div className="w-full xl:max-w-3xl h-auto content-end grid grid-cols-1 px-4 gap-4 mx-auto ">
          {context.map(
            (message, index) =>
              message.content !== '' && (
                <Message
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              )
          )}
        </div>
        <div className="h-8" />
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={onSend}
        isAsking={Object.keys(state?.active_requests ?? {}).length > 0}
        textboxRef={textboxRef}
      />
    </>
  );
};

export default PageDetail;
