'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { collection, query, where, addDoc, setDoc, deleteDoc, doc, serverTimestamp, type DocumentData } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ShieldX, PlusCircle, Users, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { HerdForm, type HerdFormValues } from '@/components/admin/herd-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ADMIN_UID = 'REPLACE_WITH_YOUR_ADMIN_UID';

interface Herd extends DocumentData {
    id: string;
    name: string;
    animalCount: number;
    animalType: string;
    currentPastureNumber: number;
    lastRotationDate: { toDate: () => Date };
}

export default function HerdsPage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setDeleting] = useState<string | null>(null);
  const [editingHerd, setEditingHerd] = useState<Herd | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isAdmin = user?.uid === ADMIN_UID;

  const herdsQuery = useMemo(() => {
    if (!user) return null;
    return query(collection(firestore, 'herds'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const { data: herds, loading: herdsLoading } = useCollection<Herd>(herdsQuery);

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/login');
    }
  }, [user, userLoading, router]);

  const handleFormSubmit = async (values: HerdFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
        if (editingHerd) {
            const herdRef = doc(firestore, 'herds', editingHerd.id);
            await setDoc(herdRef, { ...values, ownerId: user.uid }, { merge: true });
            toast({ title: '¡Rebaño actualizado!', description: `Se actualizó el rebaño ${values.name}.` });
        } else {
            await addDoc(collection(firestore, 'herds'), { ...values, ownerId: user.uid, createdAt: serverTimestamp() });
            toast({ title: '¡Rebaño creado!', description: `Se creó el nuevo rebaño ${values.name}.` });
        }
        setDialogOpen(false);
        setEditingHerd(null);
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
        await deleteDoc(doc(firestore, 'herds', isDeleting));
        toast({ title: 'Rebaño eliminado' });
        setDeleting(null);
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  }

  const openEditDialog = (herd: Herd) => {
    setEditingHerd(herd);
    setDialogOpen(true);
  }

  const openAddDialog = () => {
    setEditingHerd(null);
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
        <h1 className="text-xl font-semibold">Gestión de Rebaños</h1>
        <div className="flex items-center gap-2">
            <Button onClick={openAddDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Rebaño
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
        {herdsLoading ? (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card><CardHeader><Loader2 className="h-6 w-6 animate-spin" /></CardHeader></Card>
                <Card><CardHeader><Loader2 className="h-6 w-6 animate-spin" /></CardHeader></Card>
                <Card><CardHeader><Loader2 className="h-6 w-6 animate-spin" /></CardHeader></Card>
             </div>
        ) : herds && herds.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {herds.map(herd => (
              <Card key={herd.id}>
                <CardHeader>
                  <CardTitle>{herd.name}</CardTitle>
                  <CardDescription>{herd.animalCount} {herd.animalType}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>Potrero Actual:</strong> {herd.currentPastureNumber}</p>
                    <p><strong>Última Rotación:</strong> {format(herd.lastRotationDate.toDate(), 'PPP', { locale: es })}</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(herd)}><Pencil className="mr-2 h-4 w-4" /> Editar</Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleting(herd.id)}><Trash2 className="mr-2 h-4 w-4" /> Eliminar</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No hay rebaños</h3>
                <p className="mt-2 text-sm text-muted-foreground">Crea tu primer rebaño para empezar a gestionar.</p>
                <Button className="mt-4" onClick={openAddDialog}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nuevo Rebaño
                </Button>
            </div>
        )}
      </main>
    </div>
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingHerd ? 'Editar' : 'Nuevo'} Rebaño</DialogTitle>
                <DialogDescription>
                    {editingHerd ? 'Modifica los detalles de este rebaño.' : 'Añade un nuevo rebaño a tu finca.'}
                </DialogDescription>
            </DialogHeader>
            <HerdForm 
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                initialData={editingHerd}
            />
        </DialogContent>
    </Dialog>
    <AlertDialog open={!!isDeleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>¿Seguro que quieres eliminar este rebaño?</AlertDialogTitle></AlertDialogHeader>
            <AlertDialogDescription>Esta acción no se puede deshacer. Se borrará permanentemente.</AlertDialogDescription>
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
