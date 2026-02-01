'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import { PlusCircle, Calendar as CalendarIcon, BellRing } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { AddHealthEventForm, type AddHealthEventFormValues } from './add-health-event-form';

interface HealthEvent {
  id: string;
  type: string;
  eventDate: Timestamp;
  reminderDate?: Timestamp;
  notes: string;
}

const eventTypeTranslations: { [key: string]: string } = {
  vaccination: 'Vacunación',
  deworming: 'Desparasitación',
  vitamins: 'Vitaminas',
  fly_bath: 'Baño de Mosca',
  tick_bath: 'Baño de Garrapata',
  mastitis: 'Mastitis',
  other_disease: 'Otra Enfermedad',
  iatf_implant: 'Implante IATF',
  iatf_birth: 'Parto IATF',
};


export function HealthEvents({ cowId }: { cowId: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isAddEventDialogOpen, setAddEventDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventsQuery = useMemo(() => {
    if (!user) return null;
    return query(collection(firestore, 'cows', cowId, 'healthEvents'), orderBy('eventDate', 'desc'));
  }, [firestore, user, cowId]);

  const { data: events, loading: eventsLoading } = useCollection<HealthEvent>(eventsQuery);
  
  const handleAddEvent = async (values: AddHealthEventFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'cows', cowId, 'healthEvents'), {
        ...values,
        cowId: cowId,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });
      toast({
        title: '¡Evento de salud agregado!',
        description: `Se ha registrado un nuevo evento para la vaca.`,
      });
      setAddEventDialogOpen(false);
    } catch (error: any) {
      console.error('Error adding health event:', error);
      toast({
        variant: 'destructive',
        title: 'Error al agregar evento',
        description: error.message || 'No se pudo guardar el evento. Inténtalo de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Control Sanitario</h3>
        <Dialog open={isAddEventDialogOpen} onOpenChange={setAddEventDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Evento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Evento de Salud</DialogTitle>
            </DialogHeader>
            <AddHealthEventForm onSubmit={handleAddEvent} isSubmitting={isSubmitting} onFinished={() => setAddEventDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo de Evento</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead>Recordatorio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventsLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Cargando eventos...</TableCell>
              </TableRow>
            ) : events && events.length > 0 ? (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{eventTypeTranslations[event.type] || event.type}</TableCell>
                  <TableCell>{format(event.eventDate.toDate(), 'PPP', { locale: es })}</TableCell>
                  <TableCell>{event.notes}</TableCell>
                  <TableCell>
                    {event.reminderDate ? (
                      <span className="flex items-center">
                        <BellRing className="mr-2 h-4 w-4 text-yellow-500" />
                        {format(event.reminderDate.toDate(), 'PPP', { locale: es })}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No hay eventos registrados.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
