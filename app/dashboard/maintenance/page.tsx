
'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
import { collection, addDoc, serverTimestamp, query, where, orderBy, type Timestamp } from 'firebase/firestore';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Loader2, ArrowLeft, PlusCircle, Calendar as CalendarIcon, Construction } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { AddMaintenanceEventForm, type AddMaintenanceEventFormValues } from '@/components/maintenance/add-maintenance-event-form';
import { cn } from '@/lib/utils';
import { format, startOfDay, endOfDay, addDays, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';

interface MaintenanceEvent {
  id: string;
  type: string;
  eventDate: Timestamp;
  employees: number;
  days: number;
  notes: string;
  ownerId: string;
}

const eventTypeTranslations: { [key: string]: string } = {
    limpieza_cercas: 'Limpieza de Cercas',
    fumigada: 'Fumigada',
    cerca_nueva: 'Cerca Nueva',
    cerca_reforzada: 'Cerca Reforzada',
    arrancada_troncos: 'Arrancada de Troncos',
    corral_nuevo: 'Corral Nuevo',
    mantenimiento_corral: 'Mantenimiento de Corral',
    limpiada_zona: 'Limpiada de Zona',
    trabajo_maquina: 'Trabajo con Máquina',
    tanque: 'Tanque',
    tumba: 'Tumba',
    trabajos_por_hacer: 'Trabajos por Hacer',
  };

export default function MaintenancePage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/login');
    }
  }, [user, userLoading, router]);

  const eventsQuery = useMemo(() => {
    if (!user) return null;
    return query(
        collection(firestore, 'maintenanceEvents'), 
        where('ownerId', '==', user.uid),
        orderBy('eventDate', 'desc')
    );
  }, [firestore, user]);

  const { data: events, loading: eventsLoading } = useCollection<MaintenanceEvent>(eventsQuery);

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (!dateRange?.from) return events;

    const fromDate = startOfDay(dateRange.from);
    const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

    return events.filter(event => {
      const eventDate = event.eventDate.toDate();
      return isWithinInterval(eventDate, { start: fromDate, end: toDate });
    });
  }, [events, dateRange]);


  const handleAddEvent = async (values: AddMaintenanceEventFormValues) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Debes iniciar sesión.' });
        return;
    }
    setIsSubmitting(true);
    try {
        await addDoc(collection(firestore, 'maintenanceEvents'), {
            ...values,
            ownerId: user.uid,
            createdAt: serverTimestamp(),
        });
        toast({ title: '¡Trabajo registrado!', description: 'El nuevo trabajo de mantenimiento ha sido guardado.' });
        setAddDialogOpen(false);
    } catch (error: any) {
        console.error('Error adding maintenance event:', error);
        toast({
            variant: 'destructive',
            title: 'Error al registrar trabajo',
            description: error.message || 'No se pudo guardar el registro. Inténtalo de nuevo.',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  const isLoading = userLoading || eventsLoading;

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <header className="flex items-center justify-between border-b bg-background px-4 py-3 sm:px-6">
        <h1 className="text-xl font-semibold">Trabajos y Mantenimiento</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel
          </Link>
        </Button>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                    "w-full sm:w-[300px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                    dateRange.to ? (
                        <>
                        {format(dateRange.from, "LLL dd, y", {locale: es})} -{" "}
                        {format(dateRange.to, "LLL dd, y", {locale: es})}
                        </>
                    ) : (
                        format(dateRange.from, "LLL dd, y", {locale: es})
                    )
                    ) : (
                    <span>Selecciona un rango</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={es}
                />
                </PopoverContent>
            </Popover>
            <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Registrar Trabajo
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Registrar Nuevo Trabajo</DialogTitle>
                    <DialogDescription>
                        Completa los detalles del trabajo de mantenimiento realizado.
                    </DialogDescription>
                    </DialogHeader>
                    <AddMaintenanceEventForm onSubmit={handleAddEvent} isSubmitting={isSubmitting} onFinished={() => setAddDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>

        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Tipo de Trabajo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-center">Empleados</TableHead>
                    <TableHead className="text-center">Días</TableHead>
                    <TableHead>Notas</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">Cargando trabajos...</TableCell>
                        </TableRow>
                    ) : filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <TableRow key={event.id}>
                            <TableCell>{eventTypeTranslations[event.type] || event.type}</TableCell>
                            <TableCell>{format(event.eventDate.toDate(), 'PPP', { locale: es })}</TableCell>
                            <TableCell className="text-center">{event.employees || '-'}</TableCell>
                            <TableCell className="text-center">{event.days || '-'}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{event.notes || '-'}</TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Construction className="h-8 w-8 text-muted-foreground"/>
                                <p>No hay trabajos registrados en este rango de fechas.</p>
                            </div>
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
      </main>
    </div>
  );
}
