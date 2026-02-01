'use client';

import type { SVGProps } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook } from 'lucide-react';

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

interface SocialSharePopoverProps {
  topic: string;
}

export function SocialSharePopover({ topic }: SocialSharePopoverProps) {
  const shareText = `¡Nuevo tema de conversación generado por Charlas IA! 🔥\n\n"${topic}"\n\nGenera los tuyos. #CharlasIA`;
  const encodedShareText = encodeURIComponent(shareText);
  const appUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedAppUrl = encodeURIComponent(appUrl);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Compartir tema">
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodedShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Compartir en Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedAppUrl}&quote=${encodedShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Compartir en Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <a
              href={`https://api.whatsapp.com/send?text=${encodedShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Compartir en WhatsApp"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
