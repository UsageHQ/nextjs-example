import { ChatContextProvider } from '@/app/context/ChatContext';
import { ChatSideBar } from '@/components/ui/Chat/ChatSideBar';
import { createClient } from '@/utils/supabase/server';
import { ReactNode } from 'react';

export default async function ChatLayout({
  children
}: {
  children: ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)] bg-primary-foreground">
      <ChatContextProvider userId={user.id}>
        <ChatSideBar />
        {children}
      </ChatContextProvider>
    </div>
  );
}
