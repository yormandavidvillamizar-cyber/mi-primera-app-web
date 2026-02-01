'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { collection, query, where, type Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, LogOut, ChevronsRight, Database, Search, ShieldCheck, Wrench, RotateCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { SettingsSheet } from '@/components/settings/settings-sheet';
import { NotificationBell } from '@/components/notifications/notification-bell';

interface Cow {
  id: string;
  name: string;
  breed: string;
  birthDate?: Timestamp;
  animalType?: string;
  ownerId: string;
}

export default function DashboardPage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const cowsQuery = useMemo(() => {
    if (!user) return null;
    return query(collection(firestore, 'cows'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const { data: cows, loading: cowsLoading } = useCollection<Cow>(cowsQuery);

  const filteredCows = useMemo(() => {
    if (!cows) return [];
    return cows.filter(cow =>
      cow.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cows, searchTerm]);

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/login');
    }
  }, [user, userLoading, router]);

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Hubo un problema al cerrar la sesión.',
      });
    }
  };
  
  const isLoading = userLoading || cowsLoading;

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b bg-background px-4 py-3 sm:px-6">
        <h1 className="text-xl font-semibold">Consulta de Ganado</h1>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/pasture-rotation">
              <RotateCw className="mr-2 h-4 w-4" />
              Rotación de Potrero
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/maintenance">
              <Wrench className="mr-2 h-4 w-4" />
              Trabajos
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/database">
              <Database className="mr-2 h-4 w-4" />
              Base de Datos
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Administración
            </Link>
          </Button>
          <NotificationBell />
          <SettingsSheet />
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Cerrar sesión</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-bold">Tu Ganado</h2>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por código o nombre..."
              className="w-full pl-8 sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {cows && cows.length > 0 ? (
          filteredCows.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCows.map((cow) => (
                <Card key={cow.id}>
                  <CardHeader>
                    <CardTitle>{cow.name}</CardTitle>
                    <CardDescription>{cow.breed}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/dashboard/cows/${cow.id}`}>
                        Ver Detalles <ChevronsRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-12 text-center dark:border-gray-700">
                <h3 className="text-xl font-semibold">No se encontraron resultados</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                No se encontró ningún animal que coincida con tu búsqueda.
                </p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-12 text-center dark:border-gray-700">
            <h3 className="text-xl font-semibold">No tienes ganado registrado</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ve a la sección de gestión de base de datos para agregar tu primer animal.
            </p>
            <Button className="mt-4" asChild>
                <Link href="/dashboard/database">
                    <Database className="mr-2" />
                    Ir a Base de Datos
                </Link>
            </Button>
          </div>
        )}
      </main>
      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        <p>Sobre la contraseña: Para proteger tus datos, el acceso se controla con tu cuenta de Google. Solo tú puedes ver y modificar la información de tu ganado. No se necesita una contraseña adicional.</p>
      </footer>
    </div>
  );
}
