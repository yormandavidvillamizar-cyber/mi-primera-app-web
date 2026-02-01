import { BotMessageSquare } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-center py-6 md:py-8">
      <BotMessageSquare className="h-8 w-8 text-primary" />
      <h1 className="ml-3 font-headline text-3xl font-bold tracking-tight md:text-4xl">
        Charlas IA
      </h1>
    </header>
  );
}
