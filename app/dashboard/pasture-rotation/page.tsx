'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { collection, query, where, type DocumentData } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PastureMap from './pasture-map';
import PastureDetails from './pasture-details';
import { useNotifications } from '@/hooks/use-notifications';
import { differenceInDays, addDays, startOfDay } from 'date-fns';

export interface Pasture extends DocumentData {
  id: string;
  ownerId: string;
  pastureNumber: number;
  rotationDays?: number;
  waterFrequency?: number;
  feedFrequency?: number;
  saltFrequency?: number;
}

export interface Herd extends DocumentData {
  id: string;
  ownerId: string;
  name: string;
  animalCount?: number;
  animalType: string;
  currentPastureNumber: number;
  lastRotationDate: { toDate: () => Date };
  lastWaterDate?: { toDate: () => Date };
  lastFeedDate?: { toDate: () => Date };
  lastSaltDate?: { toDate: () => Date };
}

export default function PastureRotationPage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { addNotification, removeNotification } = useNotifications();

  const [selectedPastureNumber, setSelectedPastureNumber] = useState<number | null>(null);

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/login');
    }
  }, [user, userLoading, router]);

  const pasturesQuery = useMemo(() => {
    if (!user) return null;
    return query(collection(firestore, 'pastures'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const herdsQuery = useMemo(() => {
    if (!user) return null;
    return query(collection(firestore, 'herds'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const { data: pastures, loading: pasturesLoading } = useCollection<Pasture>(pasturesQuery);
  const { data: herds, loading: herdsLoading } = useCollection<Herd>(herdsQuery);

  const selectedPasture = useMemo(() => {
    if (!selectedPastureNumber || !pastures) return null;
    return pastures.find(p => p.pastureNumber === selectedPastureNumber) || null;
  }, [selectedPastureNumber, pastures]);

  const herdsInSelectedPasture = useMemo(() => {
    if (!selectedPastureNumber || !herds) return [];
    return herds.filter(h => h.currentPastureNumber === selectedPastureNumber);
  }, [selectedPastureNumber, herds]);

  const handleSelectPasture = useCallback((pastureNumber: number) => {
    setSelectedPastureNumber(pastureNumber);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!herds || !pastures) return;
  
    const today = startOfDay(new Date());
  
    herds.forEach(herd => {
      const pasture = pastures.find(p => p.pastureNumber === herd.currentPastureNumber);
      if (!pasture) return;
  
      // Rotation Notification
      const rotationNotifId = `rotation-${herd.id}`;
      if (pasture.rotationDays) {
        const rotationEndDate = addDays(startOfDay(herd.lastRotationDate.toDate()), pasture.rotationDays);
        const daysUntilRotation = differenceInDays(rotationEndDate, today);
        if (daysUntilRotation <= 0) {
          addNotification({ id: rotationNotifId, message: `Rebaño '${herd.name}' necesita rotar del potrero ${pasture.pastureNumber}.` });
        } else {
          removeNotification(rotationNotifId);
        }
      }
  
      // Water Notification
      const waterNotifId = `water-${herd.id}`;
      if (pasture.waterFrequency && herd.lastWaterDate) {
        const nextWaterDate = addDays(startOfDay(herd.lastWaterDate.toDate()), pasture.waterFrequency);
        const daysUntilWater = differenceInDays(nextWaterDate, today);
        if (daysUntilWater <= 0) {
          addNotification({ id: waterNotifId, message: `Potrero ${pasture.pastureNumber} necesita bombeo de agua.` });
        } else {
          removeNotification(waterNotifId);
        }
      }
    });
  
  }, [herds, pastures, addNotification, removeNotification]);

  if (userLoading || pasturesLoading || herdsLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <header className="flex items-center justify-between border-b bg-background px-4 py-3 sm:px-6">
        <h1 className="text-xl font-semibold">Rotación de Potrero</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel
          </Link>
        </Button>
      </header>
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 overflow-hidden">
        <div className="lg:col-span-2 xl:col-span-3 h-full">
            <PastureMap 
                pastures={pastures}
                herds={herds}
                onSelectPasture={handleSelectPasture}
                selectedPastureNumber={selectedPastureNumber}
            />
        </div>
        <div className="lg:col-span-1 xl:col-span-1 h-full overflow-y-auto">
            <PastureDetails
                pasture={selectedPasture}
                herds={herdsInSelectedPasture}
            />
        </div>
      </main>
    </div>
  );
}
