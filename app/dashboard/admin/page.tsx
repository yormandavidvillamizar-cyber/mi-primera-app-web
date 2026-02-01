'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ShieldX, Users, FlaskConical, Wind, Wallet, Grid3x3 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// TODO: Replace with a more secure method like Firebase Custom Claims for production apps.
// This is a simple check for demonstration purposes. Replace with the admin's actual Firebase UID.
const ADMIN_UID = 'REPLACE_WITH_YOUR_ADMIN_UID';

export default function AdminPage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  const isAdmin = user?.uid === ADMIN_UID;

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/login');
    }
  }, [user, userLoading, router]);

  if (userLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <ShieldX className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Acceso Denegado</h1>
        <p className="text-muted-foreground">No tienes permiso para acceder a esta página.</p>
        <Button asChild>
          <Link href="/dashboard">Volver al panel</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <header className="flex items-center justify-between border-b bg-background px-4 py-3 sm:px-6">
        <h1 className="text-xl font-semibold">Administración de Finca</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel
          </Link>
        </Button>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/admin/pastures">
            <Card className="flex h-full flex-col justify-between hover:bg-muted/50">
              <CardHeader>
                <Grid3x3 className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>Gestión de Potreros</CardTitle>
                <CardDescription>
                  Define la configuración de cada potrero de tu finca.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                    Ir a Potreros
                </Button>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/admin/herds">
            <Card className="flex h-full flex-col justify-between hover:bg-muted/50">
              <CardHeader>
                <Users className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>Gestión de Rebaños</CardTitle>
                <CardDescription>
                  Administra los rebaños, su ubicación y rotación.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                    Ir a Rebaños
                </Button>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/admin/employees">
            <Card className="flex h-full flex-col justify-between hover:bg-muted/50">
              <CardHeader>
                <Users className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>Gestión de Empleados</CardTitle>
                <CardDescription>
                  Administra los datos y pagos de los empleados de la finca.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                    Ir a Empleados
                </Button>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/admin/medication-expenses">
            <Card className="flex h-full flex-col justify-between hover:bg-muted/50">
              <CardHeader>
                <FlaskConical className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>Gastos de Medicamentos</CardTitle>
                <CardDescription>
                  Registra y consulta las compras de medicamentos y tratamientos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                    Ir a Gastos
                </Button>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/admin/fumigation-cycles">
            <Card className="flex h-full flex-col justify-between hover:bg-muted/50">
              <CardHeader>
                <Wind className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>Ciclos de Fumigación</CardTitle>
                <CardDescription>
                  Lleva el control de los ciclos de fumigación y sus costos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <Button variant="outline" className="w-full">
                    Ir a Ciclos
                </Button>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/admin/other-expenses">
            <Card className="flex h-full flex-col justify-between hover:bg-muted/50">
              <CardHeader>
                <Wallet className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>Otros Gastos</CardTitle>
                <CardDescription>
                  Control de gastos varios: madera, cercas, comida, etc.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <Button variant="outline" className="w-full">
                    Ir a Otros Gastos
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
