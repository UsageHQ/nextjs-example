import React from 'react';

const ChatDetailLayout = async ({
  params,
  children
}: {
  params: { sessionId: string };
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full h-full max-h-full flex flex-col">
      {children}
    </div>
  );
};

export default ChatDetailLayout;
