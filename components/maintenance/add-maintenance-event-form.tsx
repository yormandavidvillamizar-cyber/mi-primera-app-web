
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScrollArea } from '../ui/scroll-area';

const eventTypes = [
    { value: 'limpieza_cercas', label: 'Limpieza de Cercas' },
    { value: 'fumigada', label: 'Fumigada' },
    { value: 'cerca_nueva', label: 'Cerca Nueva' },
    { value: 'cerca_reforzada', label: 'Cerca Reforzada' },
    { value: 'arrancada_troncos', label: 'Arrancada de Troncos' },
    { value: 'corral_nuevo', label: 'Corral Nuevo' },
    { value: 'mantenimiento_corral', label: 'Mantenimiento de Corral' },
    { value: 'limpiada_zona', label: 'Limpiada de Zona' },
    { value: 'trabajo_maquina', label: 'Trabajo con Máquina' },
    { value: 'tanque', label: 'Tanque' },
    { value: 'tumba', label: 'Tumba' },
    { value: 'trabajos_por_hacer', label: 'Trabajos por Hacer' },
  ];

const formSchema = z.object({
  type: z.string({ required_error: 'El tipo de trabajo es requerido.' }),
  eventDate: z.date({ required_error: 'La fecha del trabajo es requerida.' }),
  employees: z.coerce.number().int('Debe ser un número entero.').min(0, 'No puede ser negativo.').optional(),
  days: z.coerce.number().min(0, 'No puede ser negativo.').optional(),
  notes: z.string().optional(),
});

export type AddMaintenanceEventFormValues = z.infer<typeof formSchema>;

interface AddMaintenanceEventFormProps {
  onSubmit: (values: AddMaintenanceEventFormValues) => Promise<void>;
  isSubmitting: boolean;
  onFinished: () => void;
}

export function AddMaintenanceEventForm({ onSubmit, isSubmitting, onFinished }: AddMaintenanceEventFormProps) {
  const form = useForm<AddMaintenanceEventFormValues>({
    resolver: zodResolver(formSchema),
  });
  
  const handleFormSubmit = async (values: AddMaintenanceEventFormValues) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-4">
                <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tipo de Trabajo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo de trabajo" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {eventTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Fecha del Trabajo</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={'outline'}
                            className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                            )}
                            >
                            {field.value ? (
                                format(field.value, 'PPP', { locale: es })
                            ) : (
                                <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="employees"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nº de Empleados</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="days"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Días de Trabajo</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Notas Adicionales</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Añade detalles, como 'Trabajos por hacer: reparar la cerca del potrero 5'..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        </ScrollArea>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Guardando...' : 'Guardar Registro'}
        </Button>
      </form>
    </Form>
  );
}
