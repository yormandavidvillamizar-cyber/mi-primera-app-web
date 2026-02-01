'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ShieldX, Users } from 'lucide-react';
import Link from 'next/link';

// This is a simple check for demonstration purposes. Replace with the admin's actual Firebase UID.
const ADMIN_UID = 'REPLACE_WITH_YOUR_ADMIN_UID';

export default function EmployeesPage() {
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
        <h1 className="text-xl font-semibold">Gestión de Empleados</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Administración
          </Link>
        </Button>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-4 sm:p-6">
        <div className="flex flex-col items-center gap-4 text-center">
            <Users className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl font-bold">Gestión de Empleados</h2>
            <p className="max-w-md text-muted-foreground">
                Aquí podrás agregar, editar y ver los empleados, así como registrar sus pagos y tareas. Esta sección está en construcción.
            </p>
        </div>
      </main>
    </div>
  );
}
