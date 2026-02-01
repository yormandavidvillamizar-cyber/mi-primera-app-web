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
import { ScrollArea } from '../ui/scroll-area';
import { useEffect } from 'react';
import type { DocumentData } from 'firebase/firestore';

const formSchema = z.object({
  pastureNumber: z.coerce.number().int('Debe ser un número entero').min(1, 'El número debe ser mayor a 0.'),
  rotationDays: z.coerce.number().int().min(1, 'Debe ser al menos 1 día.').optional().or(z.literal('')),
  waterFrequency: z.coerce.number().int().min(1, 'Debe ser al menos 1 día.').optional().or(z.literal('')),
  feedFrequency: z.coerce.number().int().min(1, 'Debe ser al menos 1 día.').optional().or(z.literal('')),
  saltFrequency: z.coerce.number().int().min(1, 'Debe ser al menos 1 día.').optional().or(z.literal('')),
});

export type PastureFormValues = z.infer<typeof formSchema>;

interface PastureFormProps {
  onSubmit: (values: PastureFormValues) => void;
  isSubmitting: boolean;
  initialData?: DocumentData | null;
}

export function PastureForm({ onSubmit, isSubmitting, initialData }: PastureFormProps) {
  const form = useForm<PastureFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pastureNumber: initialData?.pastureNumber || undefined,
      rotationDays: initialData?.rotationDays || '',
      waterFrequency: initialData?.waterFrequency || '',
      feedFrequency: initialData?.feedFrequency || '',
      saltFrequency: initialData?.saltFrequency || '',
    },
  });

  useEffect(() => {
    form.reset({
        pastureNumber: initialData?.pastureNumber || undefined,
        rotationDays: initialData?.rotationDays || '',
        waterFrequency: initialData?.waterFrequency || '',
        feedFrequency: initialData?.feedFrequency || '',
        saltFrequency: initialData?.saltFrequency || '',
    })
  }, [initialData, form]);

  const handleFormSubmit = (values: PastureFormValues) => {
    // Convert empty strings to null for Firestore
    const cleanedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value === '' ? null : value])
    );
    onSubmit(cleanedValues as PastureFormValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <ScrollArea className="h-auto pr-6">
            <div className="space-y-4">
            <FormField
            control={form.control}
            name="pastureNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Número de Potrero</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="1" {...field} readOnly={!!initialData} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="rotationDays"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Días de Rotación (Opcional)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="30" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="waterFrequency"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Frecuencia de Agua (días, Opcional)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="15" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="feedFrequency"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Frecuencia de Alimento (días, Opcional)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="saltFrequency"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Frecuencia de Sal/Melaza (días, Opcional)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="8" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        </ScrollArea>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Guardando...' : 'Guardar Potrero'}
        </Button>
      </form>
    </Form>
  );
}
