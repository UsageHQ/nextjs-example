'use client';

import LoadingDots from '../LoadingDots';
import { ChatContext } from '@/app/context/ChatContext';
import { categorizeAndSortSessions } from '@/utils/chat';
import cn from 'classnames';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { VscHome, VscAdd } from 'react-icons/vsc';

export const ChatSideBar = () => {
  const router = useRouter();
  const { isLoaded, chatSessions, createSession } = useContext(ChatContext);
  const newSessionHandler = async () => {
    const newSession = await createSession();
    if (newSession) {
      router.push(`/chat/${newSession.id}`);
    }
  };

  const s = categorizeAndSortSessions(chatSessions);
  return (
    <aside className="w-[240px] shrink-0 px-2 flex flex-col bg-neutral-900">
      <nav className="py-4">
        <Link href="/settings" className={menuItemStyle}>
          <VscHome className={menuIconStyle} />
          <span className="translate-y-[0.5px] text-sm">Home</span>
        </Link>
        <div onClick={newSessionHandler} className={menuItemStyle}>
          <VscAdd className={menuIconStyle} />
          <span className="translate-y-[0.5px] text-sm">New chat</span>
        </div>
      </nav>
      <div className="space-y-4 overflow-auto flex-1">
        {!isLoaded && (
          <div className="flex justify-center items-center w-full my-4">
            <LoadingDots />
          </div>
        )}
        {Object.entries(s).map(([group, sessions], idx) => (
          <div className="space-y-2" key={idx}>
            <div className="line-clamp-2 pl-3 text-sm font-medium text-gray-500">
              {group}
            </div>
            {sessions.map((session) => (
              <SideBarItem
                key={session.id}
                sessionId={session.id}
                sessionName={session.name || 'New chat'}
              />
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};

const menuItemStyle = cn(
  'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-gray-100 hover:text-blue-600'
);
const menuIconStyle = cn('h-4 w-4 shrink-0');

function SideBarItem({
  sessionId,
  sessionName
}: {
  sessionId: string;
  sessionName: string;
}) {
  const pathname = usePathname();
  return (
    <Link
      key={sessionId}
      href={`/chat/${sessionId}`}
      className={cn(menuItemStyle, {
        'bg-accent text-primary': pathname === `/chat/${sessionId}`
      })}
    >
      <span className="translate-y-[0.5px] text-sm font-medium">
        {sessionName}
      </span>
    </Link>
  );
}
