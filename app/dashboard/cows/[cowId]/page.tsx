'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { doc, type Timestamp } from 'firebase/firestore';
import { Loader2, ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HealthEvents } from '@/components/cows/health-events';
import { MilkProduction } from '@/components/cows/milk-production';
import { format, differenceInMonths, differenceInDays, differenceInYears } from 'date-fns';
import { es } from 'date-fns/locale';

interface Cow {
  id: string;
  name: string;
  breed: string;
  birthDate?: Timestamp;
  deathDate?: Timestamp;
  animalType?: 'vaca' | 'toro' | 'novilla' | 'novillo' | 'maute' | 'becerro' | 'becerra';
  father?: string;
  mother?: string;
  brand?: string;
  location?: string;
  lastCalvingDate?: Timestamp;
  ownerName?: string;
  brandImageUrl?: string;
  calfImageUrl?: string;
  adolescentImageUrl?: string;
  adultImageUrl?: string;
}

const animalTypeTranslations = {
  vaca: 'Vaca',
  toro: 'Toro',
  novilla: 'Novilla',
  novillo: 'Novillo',
  maute: 'Maute',
  becerro: 'Becerro',
  becerra: 'Becerra',
};

export default function CowDetailPage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const firestore = useFirestore();
  const cowId = params.cowId as string;

  const cowRef = useMemo(() => {
    if (!cowId) return null;
    return doc(firestore, 'cows', cowId);
  }, [firestore, cowId]);
  
  const { data: cow, loading: cowLoading } = useDoc<Cow>(cowRef);

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/login');
    }
  }, [user, userLoading, router]);

  const calculateAge = (birthDate: Timestamp | undefined, deathDate: Timestamp | undefined): string | null => {
    if (!birthDate) return null;
    
    const start = birthDate.toDate();
    const end = deathDate ? deathDate.toDate() : new Date();

    const totalMonths = differenceInMonths(end, start);
    if (totalMonths < 0) return null;
    
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const ageParts = [];
    if (years > 0) {
        ageParts.push(`${years} ${years > 1 ? 'años' : 'año'}`);
    }
    if (months > 0) {
        ageParts.push(`${months} ${months > 1 ? 'meses' : 'mes'}`);
    }
    
    if (ageParts.length === 0) {
        const days = differenceInDays(end, start);
        if (days === 0 && !deathDate) return "Recién nacido";
        return `${days} ${days === 1 ? 'día' : 'días'}`;
    }

    return ageParts.join(' y ');
  };

  const age = cow ? calculateAge(cow.birthDate, cow.deathDate) : null;

  const handleDownloadPdf = () => {
    // Placeholder for PDF download functionality
    alert('Función para descargar PDF próximamente.');
  };

  const isLoading = userLoading || cowLoading;

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!cow) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <p>No se encontró la vaca.</p>
        <Button asChild>
          <Link href="/dashboard">Volver al panel</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <header className="flex items-center border-b bg-background px-4 py-3 sm:px-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="ml-4 flex-1">
            <h1 className="text-xl font-semibold">{cow.name}</h1>
            {cow.breed && <p className="text-sm text-muted-foreground">{cow.breed}</p>}
        </div>
        <Button variant="outline" onClick={handleDownloadPdf}>
          <Download className="mr-2 h-4 w-4" />
          Descargar PDF
        </Button>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="gallery">Imágenes</TabsTrigger>
            <TabsTrigger value="health">Control Sanitario</TabsTrigger>
            <TabsTrigger value="production">Balance de Producción</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Información del Animal</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <span className="font-semibold">Código / Nombre: </span>
                        {cow.name}
                    </div>
                    {cow.ownerName && <div><span className="font-semibold">Propietario: </span>{cow.ownerName}</div>}
                    {cow.animalType && <div><span className="font-semibold">Tipo: </span>{animalTypeTranslations[cow.animalType]}</div>}
                    {cow.breed && <div><span className="font-semibold">Raza: </span>{cow.breed}</div>}
                    {cow.birthDate && <div><span className="font-semibold">Fecha de Nacimiento: </span>{format(cow.birthDate.toDate(), 'PPP', { locale: es })}</div>}
                    {age && <div><span className="font-semibold">{cow.deathDate ? 'Edad al morir: ': 'Edad: '}</span>{age}</div>}
                    {cow.deathDate && <div><span className="font-semibold">Fecha de Muerte: </span>{format(cow.deathDate.toDate(), 'PPP', { locale: es })}</div>}
                    {cow.father && <div><span className="font-semibold">Padre: </span>{cow.father}</div>}
                    {cow.mother && <div><span className="font-semibold">Madre: </span>{cow.mother}</div>}
                    {cow.brand && <div><span className="font-semibold">Hierro: </span>{cow.brand}</div>}
                    {cow.location && <div><span className="font-semibold">Ubicación: </span>{cow.location}</div>}
                    {cow.lastCalvingDate && <div><span className="font-semibold">Último Parto: </span>{format(cow.lastCalvingDate.toDate(), 'PPP', { locale: es })}</div>}
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="gallery" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Galería de Imágenes</CardTitle>
                </CardHeader>
                <CardContent>
                    {
                    !cow.brandImageUrl && !cow.calfImageUrl && !cow.adolescentImageUrl && !cow.adultImageUrl ? (
                        <p className="text-sm text-muted-foreground">No hay imágenes para este animal.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {cow.brandImageUrl && (
                            <div className="space-y-2">
                            <p className="text-sm font-medium">Hierro</p>
                            <Image src={cow.brandImageUrl} alt="Foto del hierro" width={200} height={200} className="aspect-square w-full rounded-lg object-cover" />
                            </div>
                        )}
                        {cow.calfImageUrl && (
                            <div className="space-y-2">
                            <p className="text-sm font-medium">Becerro/a</p>
                            <Image src={cow.calfImageUrl} alt="Foto de becerro/a" width={200} height={200} className="aspect-square w-full rounded-lg object-cover" />
                            </div>
                        )}
                        {cow.adolescentImageUrl && (
                            <div className="space-y-2">
                            <p className="text-sm font-medium">Adolescente</p>
                            <Image src={cow.adolescentImageUrl} alt="Foto de adolescente" width={200} height={200} className="aspect-square w-full rounded-lg object-cover" />
                            </div>
                        )}
                        {cow.adultImageUrl && (
                            <div className="space-y-2">
                            <p className="text-sm font-medium">Adulto/a</p>
                            <Image src={cow.adultImageUrl} alt="Foto de adulto/a" width={200} height={200} className="aspect-square w-full rounded-lg object-cover" />
                            </div>
                        )}
                        </div>
                    )
                    }
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="health" className="mt-4">
            <HealthEvents cowId={cow.id} />
          </TabsContent>
          <TabsContent value="production" className="mt-4">
            <MilkProduction cowId={cow.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
