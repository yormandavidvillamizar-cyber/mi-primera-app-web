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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScrollArea } from '../ui/scroll-area';
import { useEffect } from 'react';
import type { DocumentData } from 'firebase/firestore';

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  animalType: z.string().min(1, 'El tipo es requerido.'),
  animalCount: z.coerce.number().int().min(1, 'Debe haber al menos 1 animal.'),
  currentPastureNumber: z.coerce.number().int().min(1, 'El número de potrero es requerido.'),
  lastRotationDate: z.date({ required_error: 'La fecha es requerida.'}),
  lastWaterDate: z.date().optional(),
  lastFeedDate: z.date().optional(),
  lastSaltDate: z.date().optional(),
});

export type HerdFormValues = z.infer<typeof formSchema>;

interface HerdFormProps {
  onSubmit: (values: HerdFormValues) => void;
  isSubmitting: boolean;
  initialData?: DocumentData | null;
}

export function HerdForm({ onSubmit, isSubmitting, initialData }: HerdFormProps) {
  const form = useForm<HerdFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      animalType: '',
      animalCount: 1,
      currentPastureNumber: 1,
      ...initialData,
      lastRotationDate: initialData?.lastRotationDate?.toDate() || new Date(),
      lastWaterDate: initialData?.lastWaterDate?.toDate(),
      lastFeedDate: initialData?.lastFeedDate?.toDate(),
      lastSaltDate: initialData?.lastSaltDate?.toDate(),
    },
  });

  useEffect(() => {
    form.reset({
        name: initialData?.name || '',
        animalType: initialData?.animalType || '',
        animalCount: initialData?.animalCount || 1,
        currentPastureNumber: initialData?.currentPastureNumber || 1,
        lastRotationDate: initialData?.lastRotationDate?.toDate() || new Date(),
        lastWaterDate: initialData?.lastWaterDate?.toDate(),
        lastFeedDate: initialData?.lastFeedDate?.toDate(),
        lastSaltDate: initialData?.lastSaltDate?.toDate(),
    })
  }, [initialData, form]);

  const handleFormSubmit = (values: HerdFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Nombre del Rebaño</FormLabel><FormControl><Input placeholder="Lote de Novillas" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="animalType" render={({ field }) => (
                    <FormItem><FormLabel>Tipo de Animal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un tipo" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Vacas">Vacas</SelectItem>
                                <SelectItem value="Novillas">Novillas</SelectItem>
                                <SelectItem value="Becerros">Becerros</SelectItem>
                                <SelectItem value="Toros">Toros</SelectItem>
                                <SelectItem value="Caballos">Caballos</SelectItem>
                                <SelectItem value="Mixto">Mixto</SelectItem>
                            </SelectContent>
                        </Select>
                    <FormMessage /></FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="animalCount" render={({ field }) => (
                        <FormItem><FormLabel>Nº de Animales</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="currentPastureNumber" render={({ field }) => (
                        <FormItem><FormLabel>Potrero Actual</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                
                <FormField control={form.control} name="lastRotationDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Última Rotación</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>
                                {field.value ? format(field.value, 'PPP', { locale: es }) : <span>Selecciona una fecha</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                    <FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="lastWaterDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Último Bombeo de Agua (Opcional)</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>
                                {field.value ? format(field.value, 'PPP', { locale: es }) : <span>Selecciona una fecha</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                    <FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="lastFeedDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Última Alimentación (Opcional)</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>
                                {field.value ? format(field.value, 'PPP', { locale: es }) : <span>Selecciona una fecha</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                    <FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="lastSaltDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Última Sal/Melaza (Opcional)</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>
                                {field.value ? format(field.value, 'PPP', { locale: es }) : <span>Selecciona una fecha</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                    <FormMessage /></FormItem>
                )}/>
        </div>
        </ScrollArea>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Guardando...' : 'Guardar Rebaño'}
        </Button>
      </form>
    </Form>
  );
}
