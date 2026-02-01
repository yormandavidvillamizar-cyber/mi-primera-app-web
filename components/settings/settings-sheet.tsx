'use client';

import { useTheme } from '@/components/settings/theme-provider';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Cog } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

export function SettingsSheet() {
  const { 
    theme, 
    themes, 
    setTheme, 
    fontSize, 
    setFontSize,
    loginImageUrl,
    setLoginImageUrl,
  } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Cog className="h-5 w-5" />
          <span className="sr-only">Ajustes</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ajustes de Interfaz</SheetTitle>
          <SheetDescription>
            Personaliza la apariencia de la aplicación.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
            <div className="grid gap-6 py-4">
            <div className="space-y-3">
                <h4 className="font-medium">Imagen de Fondo (Inicio de Sesión)</h4>
                 <Input 
                    value={loginImageUrl}
                    onChange={(e) => setLoginImageUrl(e.target.value)}
                    placeholder="URL de la imagen"
                />
                <p className="text-xs text-muted-foreground">Pega un enlace a una imagen para personalizar el fondo.</p>
            </div>
            <div className="space-y-3">
                <h4 className="font-medium">Tamaño de Letra</h4>
                <RadioGroup
                defaultValue={fontSize}
                onValueChange={(value) => setFontSize(value as any)}
                className="grid grid-cols-3 gap-2"
                >
                <div>
                    <RadioGroupItem value="sm" id="font-sm" className="peer sr-only" />
                    <Label
                    htmlFor="font-sm"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                    Pequeño
                    </Label>
                </div>
                <div>
                    <RadioGroupItem value="md" id="font-md" className="peer sr-only" />
                    <Label
                    htmlFor="font-md"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                    Mediano
                    </Label>
                </div>
                <div>
                    <RadioGroupItem value="lg" id="font-lg" className="peer sr-only" />
                    <Label
                    htmlFor="font-lg"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                    Grande
                    </Label>
                </div>
                </RadioGroup>
            </div>
            <div className="space-y-3">
                <h4 className="font-medium">Temas de Color</h4>
                <div className="grid grid-cols-3 gap-2">
                {themes.map((t) => (
                    <Button
                    key={t.name}
                    variant="outline"
                    className={`h-16 justify-start ${
                        theme.name === t.name ? 'border-2 border-primary' : ''
                    }`}
                    onClick={() => setTheme(t.name)}
                    >
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: `hsl(${t.colors.primary})` }} />
                        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: `hsl(${t.colors.background})` }} />
                        </div>
                        <span className="capitalize text-xs">{t.name.replace('-', ' ')}</span>
                    </div>
                    </Button>
                ))}
                </div>
            </div>
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
