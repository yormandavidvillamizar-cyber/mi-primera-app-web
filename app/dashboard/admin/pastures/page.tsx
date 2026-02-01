'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { collection, query, where, addDoc, setDoc, deleteDoc, doc, serverTimestamp, type DocumentData } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ShieldX, PlusCircle, Grid3x3, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { PastureForm, type PastureFormValues } from '@/components/admin/pasture-form';

const ADMIN_UID = 'REPLACE_WITH_YOUR_ADMIN_UID';

interface Pasture extends DocumentData {
  id: string;
  pastureNumber: number;
  rotationDays?: number;
  waterFrequency?: number;
  feedFrequency?: number;
  saltFrequency?: number;
}

export default function PasturesPage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setDeleting] = useState<string | null>(null);
  const [editingPasture, setEditingPasture] = useState<Pasture | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isAdmin = user?.uid === ADMIN_UID;

  const pasturesQuery = useMemo(() => {
    if (!user) return null;
    return query(collection(firestore, 'pastures'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const { data: pastures, loading: pasturesLoading } = useCollection<Pasture>(pasturesQuery);

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/login');
    }
  }, [user, userLoading, router]);

  const handleFormSubmit = async (values: PastureFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
        if (editingPasture) {
            const pastureRef = doc(firestore, 'pastures', editingPasture.id);
            await setDoc(pastureRef, { ...values, ownerId: user.uid }, { merge: true });
            toast({ title: '¡Potrero actualizado!', description: `Se actualizó el potrero ${values.pastureNumber}.` });
        } else {
            await addDoc(collection(firestore, 'pastures'), { ...values, ownerId: user.uid, createdAt: serverTimestamp() });
            toast({ title: '¡Potrero creado!', description: `Se creó el potrero ${values.pastureNumber}.` });
        }
        setDialogOpen(false);
        setEditingPasture(null);
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleDelete = async () => {
    if (!isDeleting) return;
    setIsSubmitting(true);
    try {
        await deleteDoc(doc(firestore, 'pastures', isDeleting));
        toast({ title: 'Potrero eliminado' });
        setDeleting(null);
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  }

  const openEditDialog = (pasture: Pasture) => {
    setEditingPasture(pasture);
    setDialogOpen(true);
  }

  const openAddDialog = () => {
    setEditingPasture(null);
    setDialogOpen(true);
  }

  if (userLoading || !user) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }
  if (!isAdmin) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <ShieldX className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Acceso Denegado</h1>
        <p className="text-muted-foreground">No tienes permiso para acceder a esta página.</p>
        <Button asChild><Link href="/dashboard/admin">Volver a Administración</Link></Button>
      </div>
    );
  }

  return (
    <>
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <header className="flex items-center justify-between border-b bg-background px-4 py-3 sm:px-6">
        <h1 className="text-xl font-semibold">Gestión de Potreros</h1>
        <div className="flex items-center gap-2">
            <Button onClick={openAddDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Potrero
            </Button>
            <Button variant="outline" asChild>
            <Link href="/dashboard/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
            </Link>
            </Button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        {pasturesLoading ? (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Card><CardHeader><Loader2 className="h-6 w-6 animate-spin" /></CardHeader></Card>
                <Card><CardHeader><Loader2 className="h-6 w-6 animate-spin" /></CardHeader></Card>
                <Card><CardHeader><Loader2 className="h-6 w-6 animate-spin" /></CardHeader></Card>
                <Card><CardHeader><Loader2 className="h-6 w-6 animate-spin" /></CardHeader></Card>
             </div>
        ) : pastures && pastures.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pastures.sort((a,b) => a.pastureNumber - b.pastureNumber).map(pasture => (
              <Card key={pasture.id}>
                <CardHeader>
                  <CardTitle>Potrero {pasture.pastureNumber}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                    <p><strong>Rotación:</strong> {pasture.rotationDays || 'N/A'} días</p>
                    <p><strong>Agua:</strong> cada {pasture.waterFrequency || 'N/A'} días</p>
                    <p><strong>Alimento:</strong> cada {pasture.feedFrequency || 'N/A'} días</p>
                    <p><strong>Sal:</strong> cada {pasture.saltFrequency || 'N/A'} días</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(pasture)}><Pencil className="mr-2 h-4 w-4" /> Editar</Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleting(pasture.id)}><Trash2 className="mr-2 h-4 w-4" /> Eliminar</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
                <Grid3x3 className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No hay potreros</h3>
                <p className="mt-2 text-sm text-muted-foreground">Crea tu primer potrero para empezar a configurar.</p>
                <Button className="mt-4" onClick={openAddDialog}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nuevo Potrero
                </Button>
            </div>
        )}
      </main>
    </div>
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingPasture ? 'Editar' : 'Nuevo'} Potrero</DialogTitle>
                <DialogDescription>
                    {editingPasture ? 'Modifica la configuración de este potrero.' : 'Añade un nuevo potrero a tu finca.'}
                </DialogDescription>
            </DialogHeader>
            <PastureForm 
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                initialData={editingPasture}
            />
        </DialogContent>
    </Dialog>
    <AlertDialog open={!!isDeleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>¿Seguro que quieres eliminar este potrero?</AlertDialogTitle></AlertDialogHeader>
            <AlertDialogDescription>Esta acción no se puede deshacer. Se borrará permanentemente de tu base de datos.</AlertDialogDescription>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Eliminar
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
