'use client';

import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { Loader2, PlusCircle, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { AddCowForm, type AddCowFormValues } from '@/components/cows/add-cow-form';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useTheme } from '@/components/settings/theme-provider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function DatabasePage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { farmName, setFarmName, farmMapUrl, setFarmMapUrl } = useTheme();

  const [isAddCowDialogOpen, setAddCowDialogOpen] = useState(false);
  const [isConfirmingAdd, setConfirmingAdd] = useState(false);
  const [cowDataToAdd, setCowDataToAdd] = useState<AddCowFormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/login');
    }
  }, [user, userLoading, router]);

  const handleAddCowFormSubmit = (values: AddCowFormValues) => {
    setCowDataToAdd(values);
    setConfirmingAdd(true);
    setAddCowDialogOpen(false);
  };

  const handleConfirmAddCow = async () => {
    if (!user || !cowDataToAdd) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No hay datos para agregar o no has iniciado sesión.',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'cows'), {
        ...cowDataToAdd,
        ownerId: user.uid,
        ownerName: user.displayName,
        createdAt: serverTimestamp(),
      });
      toast({
        title: '¡Animal agregado!',
        description: `${cowDataToAdd.name} ha sido añadido a tu ganado.`,
      });
    } catch (error: any) {
      console.error('Error adding cow:', error);
      toast({
        variant: 'destructive',
        title: 'Error al agregar animal',
        description: error.message || 'No se pudo guardar el animal. Inténtalo de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
      setCowDataToAdd(null);
      setConfirmingAdd(false);
    }
  };

  const handleEditClick = () => {
    // Placeholder for edit functionality
    toast({ title: 'Próximamente', description: 'La función para editar estará disponible pronto.' });
  };
  
  const handleDeleteClick = () => {
    // Placeholder for delete functionality
    toast({ title: 'Próximamente', description: 'La función para eliminar estará disponible pronto.' });
  };


  if (userLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
        <header className="flex items-center justify-between border-b bg-background px-4 py-3 sm:px-6">
          <h1 className="text-xl font-semibold">Gestión de Base de Datos</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Panel
            </Link>
          </Button>
        </header>
        <main className="flex flex-1 flex-col items-center gap-6 p-4 sm:p-6">
            <Card className="w-full max-w-4xl">
              <CardHeader>
                <CardTitle>Administración de Finca</CardTitle>
                <CardDescription>
                  Ajustes generales de la aplicación y la finca.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="farm-name">Nombre de la Finca</Label>
                  <Input
                    id="farm-name"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="El nombre de tu finca"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farm-map-url">URL del Plano de la Finca</Label>
                  <Input
                    id="farm-map-url"
                    value={farmMapUrl}
                    onChange={(e) => setFarmMapUrl(e.target.value)}
                    placeholder="https://ejemplo.com/plano.jpg"
                  />
                  <p className="text-xs text-muted-foreground">Pega un enlace a una imagen para el plano de la finca.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Administración de Datos</CardTitle>
                    <CardDescription>
                        Gestiona los registros de tu base de datos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <h3 className="text-lg font-medium mb-4">Ganado</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/* Agregar Animal */}
                        <Dialog open={isAddCowDialogOpen} onOpenChange={setAddCowDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-24">
                                    <PlusCircle className="mr-2 h-6 w-6" />
                                    Nuevo Animal
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Agregar Nuevo Animal</DialogTitle>
                                <DialogDescription>
                                Completa los detalles del nuevo animal de tu ganado.
                                </DialogDescription>
                            </DialogHeader>
                            <AddCowForm onFormSubmit={handleAddCowFormSubmit} isSubmitting={isSubmitting} />
                            </DialogContent>
                        </Dialog>

                        {/* Editar Animal */}
                        <Button variant="outline" className="h-24" onClick={handleEditClick}>
                            <Pencil className="mr-2 h-6 w-6" />
                            Editar Animal
                        </Button>

                        {/* Eliminar Animal */}
                        <Button variant="destructive" className="h-24" onClick={handleDeleteClick}>
                            <Trash2 className="mr-2 h-6 w-6" />
                            Eliminar Animal
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
      </div>

      {/* Confirmation Dialog for Adding Cow */}
      <AlertDialog open={isConfirmingAdd} onOpenChange={setConfirmingAdd}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Acción</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Seguro que quieres agregar este animal a la base de datos?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCowDataToAdd(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAddCow} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
