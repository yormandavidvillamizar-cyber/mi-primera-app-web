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
import { PlusCircle, LineChart } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { AddMilkRecordForm, type AddMilkRecordFormValues } from './add-milk-record-form';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

interface MilkProductionRecord {
  id: string;
  date: Timestamp;
  amount: number;
}

const chartConfig = {
  liters: {
    label: "Litros",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function MilkProduction({ cowId }: { cowId: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isAddRecordDialogOpen, setAddRecordDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recordsQuery = useMemo(() => {
    if (!user) return null;
    return query(collection(firestore, 'cows', cowId, 'milkProductionRecords'), orderBy('date', 'desc'));
  }, [firestore, user, cowId]);

  const { data: records, loading: recordsLoading } = useCollection<MilkProductionRecord>(recordsQuery);

  const chartData = useMemo(() => {
    if (!records) return [];
    return records
      .map(r => ({ date: format(r.date.toDate(), 'dd/MM'), liters: r.amount }))
      .reverse(); // reverse to show oldest first
  }, [records]);
  
  const handleAddRecord = async (values: AddMilkRecordFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'cows', cowId, 'milkProductionRecords'), {
        ...values,
        cowId: cowId,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });
      toast({
        title: '¡Registro de producción agregado!',
        description: `Se ha registrado una nueva producción.`,
      });
      setAddRecordDialogOpen(false);
    } catch (error: any) {
      console.error('Error adding milk record:', error);
      toast({
        variant: 'destructive',
        title: 'Error al agregar registro',
        description: error.message || 'No se pudo guardar el registro. Inténtalo de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Balance de Producción</h3>
        <Dialog open={isAddRecordDialogOpen} onOpenChange={setAddRecordDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Registro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Registro de Producción</DialogTitle>
            </DialogHeader>
            <AddMilkRecordForm onSubmit={handleAddRecord} isSubmitting={isSubmitting} onFinished={() => setAddRecordDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {records && records.length > 0 ? (
        <div className="grid gap-6">
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 5)}
                    />
                    <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="liters" fill="var(--color-liters)" radius={4} />
                </BarChart>
            </ChartContainer>

            <div className="rounded-lg border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Cantidad (Litros)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {records.map((record) => (
                    <TableRow key={record.id}>
                    <TableCell>{format(record.date.toDate(), 'PPP', { locale: es })}</TableCell>
                    <TableCell className="text-right">{record.amount} L</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-12 text-center dark:border-gray-700">
            <LineChart className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No hay registros de producción</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Agrega el primer registro para ver las estadísticas.
            </p>
          </div>
      )}
    </div>
  );
}
