'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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

const animalTypes = [
  { value: 'vaca', label: 'Vaca' },
  { value: 'toro', label: 'Toro' },
  { value: 'novilla', label: 'Novilla' },
  { value: 'novillo', label: 'Novillo' },
  { value: 'maute', label: 'Maute' },
  { value: 'becerro', label: 'Becerro' },
  { value: 'becerra', label: 'Becerra' },
];

const formSchema = z.object({
  name: z.string().min(1, 'El código/nombre es requerido.'),
  animalType: z.string().optional(),
  breed: z.string().optional(),
  birthDate: z.date().optional(),
  deathDate: z.date().optional(),
  father: z.string().optional(),
  mother: z.string().optional(),
  brand: z.string().optional(),
  location: z.string().optional(),
  lastCalvingDate: z.date().optional(),
  brandImageUrl: z.string().url({ message: "Por favor, introduce una URL válida." }).optional().or(z.literal('')),
  calfImageUrl: z.string().url({ message: "Por favor, introduce una URL válida." }).optional().or(z.literal('')),
  adolescentImageUrl: z.string().url({ message: "Por favor, introduce una URL válida." }).optional().or(z.literal('')),
  adultImageUrl: z.string().url({ message: "Por favor, introduce una URL válida." }).optional().or(z.literal('')),
});

export type AddCowFormValues = z.infer<typeof formSchema>;

interface AddCowFormProps {
  onFormSubmit: (values: AddCowFormValues) => void;
  isSubmitting: boolean;
}

export function AddCowForm({ onFormSubmit, isSubmitting }: AddCowFormProps) {
  const form = useForm<AddCowFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      breed: '',
      animalType: '',
      father: '',
      mother: '',
      brand: '',
      location: '',
      brandImageUrl: '',
      calfImageUrl: '',
      adolescentImageUrl: '',
      adultImageUrl: '',
    },
  });

  const handleFormSubmit = (values: AddCowFormValues) => {
    onFormSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Código / Nombre</FormLabel>
                <FormControl>
                    <Input placeholder="Pintada-001" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
                control={form.control}
                name="animalType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tipo de Animal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {animalTypes.map(type => (
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
            name="breed"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Raza</FormLabel>
                <FormControl>
                    <Input placeholder="Holstein" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Fecha de Nacimiento</FormLabel>
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
                        disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="father"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Padre</FormLabel>
                <FormControl>
                    <Input placeholder="Código o nombre del padre" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="mother"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Madre</FormLabel>
                <FormControl>
                    <Input placeholder="Código o nombre de la madre" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Hierro</FormLabel>
                <FormControl>
                    <Input placeholder="Marca del hierro" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Ubicación</FormLabel>
                <FormControl>
                    <Input placeholder="Potrero 1" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="lastCalvingDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Fecha de Último Parto</FormLabel>
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
            <FormField
            control={form.control}
            name="deathDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Fecha de Muerte</FormLabel>
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
                            <span>Selecciona una fecha (si aplica)</span>
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
            <div className="space-y-2 rounded-md border p-4">
                <h3 className="text-base font-medium">Imágenes del Animal</h3>
                <FormDescription>
                    Pega los enlaces a las imágenes. Próximamente, podrás subirlas directamente.
                </FormDescription>
                <FormField
                    control={form.control}
                    name="brandImageUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>URL Foto del Hierro</FormLabel>
                        <FormControl>
                            <Input placeholder="https://ejemplo.com/hierro.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="calfImageUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>URL Foto de Becerro/a</FormLabel>
                        <FormControl>
                            <Input placeholder="https://ejemplo.com/becerro.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="adolescentImageUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>URL Foto de Adolescente</FormLabel>
                        <FormControl>
                            <Input placeholder="https://ejemplo.com/adolescente.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="adultImageUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>URL Foto de Adulto/a</FormLabel>
                        <FormControl>
                            <Input placeholder="https://ejemplo.com/adulto.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
        </ScrollArea>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Guardando...' : 'Guardar Animal'}
        </Button>
      </form>
    </Form>
  );
}
