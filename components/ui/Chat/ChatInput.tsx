import Button from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import React from 'react';
import { VscSend } from 'react-icons/vsc';

interface ChatInputProps {
  onSend: (message: { content: string; role: 'assistant' | 'user' }) => void;
  isAsking: boolean;
  textboxRef: React.RefObject<HTMLTextAreaElement>;
}

export default function ChatInput({ ...props }: ChatInputProps) {
  const [currentMessage, setCurrentMessage] = React.useState<string>('');
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
  };

  const messageSend = () => {
    props.onSend({ content: currentMessage, role: 'user' });
    setCurrentMessage('');
  };
  const onEnter = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      messageSend();
    }
  };
  return (
    <div className="flex px-4 xl:max-w-3xl mx-auto w-full shrink-0 gap-2 mb-4 relative">
      <textarea
        className={cn(
          'flex max-h-[200px] text-lg pl-3 pr-12 min-h-[60px] w-full rounded-sm border border-input bg-transparent pt-4 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 justify-center items-center'
        )}
        ref={props.textboxRef}
        rows={1}
        placeholder="What do you want?"
        value={currentMessage}
        onChange={(e) => onChange(e)}
        onKeyDown={(e) => onEnter(e)}
        disabled={props.isAsking}
      />

      <Button disabled={currentMessage === ''} onClick={() => messageSend()}>
        <VscSend className="h-4 w-4" />
      </Button>
    </div>
  );
}
