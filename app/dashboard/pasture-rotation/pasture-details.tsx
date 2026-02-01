'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Droplets, Wheat, Activity, Users, Hash } from 'lucide-react';
import type { Pasture, Herd } from './page';
import { differenceInDays, addDays, startOfDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';

interface PastureDetailsProps {
  pasture: Pasture | null;
  herds: Herd[];
}

const SaltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground">
        <path d="M12 22a2 2 0 0 0 2-2V4a2 2 0 0 0-4 0v16a2 2 0 0 0 2 2Z"/>
        <path d="M5 4h14"/>
        <path d="M5 8h14"/>
        <path d="M5 12h14"/>
    </svg>
);


function CountdownItem({ icon, label, daysRemaining }: { icon: React.ReactNode; label: string; daysRemaining: number | null }) {
    if (daysRemaining === null) return null;

    const variant = daysRemaining <= 0 ? "destructive" : "secondary";
    const text = daysRemaining <= 0 ? "¡Ahora!" : `en ${daysRemaining} ${daysRemaining === 1 ? 'día' : 'días'}`;
    
    return (
        <div className="flex items-center gap-4">
            {icon}
            <div>
                <p className="font-semibold">{label}</p>
                <Badge variant={variant} className="text-sm">{text}</Badge>
            </div>
        </div>
    );
}

export default function PastureDetails({ pasture, herds }: PastureDetailsProps) {

    const herd = herds?.[0]; // For simplicity, showing details for the first herd in the pasture

    const countdowns = useMemo(() => {
        if (!pasture || !herd) return null;
        const today = startOfDay(new Date());

        const daysUntilRotation = pasture.rotationDays 
            ? differenceInDays(addDays(startOfDay(herd.lastRotationDate.toDate()), pasture.rotationDays), today)
            : null;

        const daysUntilWater = pasture.waterFrequency && herd.lastWaterDate
            ? differenceInDays(addDays(startOfDay(herd.lastWaterDate.toDate()), pasture.waterFrequency), today)
            : null;

        const daysUntilFeed = pasture.feedFrequency && herd.lastFeedDate
            ? differenceInDays(addDays(startOfDay(herd.lastFeedDate.toDate()), pasture.feedFrequency), today)
            : null;
        
        const daysUntilSalt = pasture.saltFrequency && herd.lastSaltDate
            ? differenceInDays(addDays(startOfDay(herd.lastSaltDate.toDate()), pasture.saltFrequency), today)
            : null;
        
        return { daysUntilRotation, daysUntilWater, daysUntilFeed, daysUntilSalt };
    }, [pasture, herd]);


  if (!pasture) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <p className="text-lg font-semibold">Selecciona un potrero</p>
          <p className="text-muted-foreground">Haz clic en un número en el mapa para ver sus detalles.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-3xl">Potrero {pasture.pastureNumber}</CardTitle>
        {herds.length === 0 && <CardDescription>Este potrero está vacío.</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        {herds.map(h => (
             <div key={h.id} className="space-y-2 rounded-lg border p-4">
                <p className="font-bold text-primary">{h.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{h.animalCount} animales ({h.animalType})</span>
                </div>
             </div>
        ))}

        {herd && countdowns && (
            <div className="space-y-4">
                 <CountdownItem 
                    icon={<Activity className="h-6 w-6 text-muted-foreground" />}
                    label="Próxima Rotación"
                    daysRemaining={countdowns.daysUntilRotation}
                />
                 <CountdownItem 
                    icon={<Droplets className="h-6 w-6 text-muted-foreground" />}
                    label="Bombeo de Agua"
                    daysRemaining={countdowns.daysUntilWater}
                />
                <CountdownItem 
                    icon={<Wheat className="h-6 w-6 text-muted-foreground" />}
                    label="Próxima Alimentación"
                    daysRemaining={countdowns.daysUntilFeed}
                />
                <CountdownItem 
                    icon={<SaltIcon />}
                    label="Sal / Melaza"
                    daysRemaining={countdowns.daysUntilSalt}
                />
            </div>
        )}

      </CardContent>
    </Card>
  );
}
