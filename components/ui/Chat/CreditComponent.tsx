import Button from '@/components/ui/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/Popover';
import { StarIcon } from '@radix-ui/react-icons';
import React from 'react';
import { getCredit } from '@/app/chat/actions';
import { useQuery } from '@tanstack/react-query';

export default function CreditComponent() {
  const creditQuery = useQuery({
    queryKey: ['credit'],
    queryFn: async () => {
      return await getCredit();
    }
  });

  const credit = creditQuery.data ?? '';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="slim">
          <div className="flex items-center space-x-2">
            <StarIcon />
            <span className="text-sm font-medium">{credit} credits left</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-2">
          <div className="space-y-2">
            <p>Remaining Credit</p>
            <h1 className="font-bold leading-none">450</h1>
            <p className="text-sm text-muted-foreground">
              Valid until Dec 31, 2023
            </p>
          </div>
          <div className="flex items-end justify-between h-16 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="w-full bg-primary/20 hover:bg-primary"
                style={{
                  height: `${Math.floor(Math.random() * 64) + 1}px`
                }}
              ></div>
            ))}
          </div>
          <Button variant="slim" className="w-full mt-2">
            Usage details
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
