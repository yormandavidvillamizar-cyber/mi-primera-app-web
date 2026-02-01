'use client';
import { useTheme } from '@/components/settings/theme-provider';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Herd, Pasture } from './page';

// Estimated coordinates for each pasture number
const pastureCoordinates = [
  { id: 1, top: '22%', left: '12%' },
  { id: 2, top: '22%', left: '28%' },
  { id: 3, top: '8%', left: '48%' },
  { id: 4, top: '8%', left: '65%' },
  { id: 5, top: '8%', left: '80%' },
  { id: 6, top: '35%', left: '80%' },
  { id: 7, top: '55%', left: '80%' },
  { id: 8, top: '55%', left: '65%' },
  { id: 9, top: '55%', left: '50%' },
  { id: 10, top: '80%', left: '75%' },
  { id: 11, top: '80%', left: '60%' },
  { id: 12, top: '80%', left: '45%' },
  { id: 13, top: '80%', left: '25%' },
  { id: 14, top: '55%', left: '12%' },
  { id: 15, top: '55%', left: '28%' },
];

const herdColors = [
    'text-red-500',
    'text-blue-500',
    'text-yellow-500',
    'text-green-500',
    'text-purple-500',
    'text-pink-500',
]

const CowIcon = ({ color }: { color: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("h-8 w-8 drop-shadow-lg", color)}>
        <path d="M14.5,9.5C14.5,8.22,15.14,7.06,16.14,6.29C17.78,4.95,20.25,5.13,21.71,6.59C23.17,8.05,22.95,10.52,21.32,11.86C20.32,12.63,19.16,13,18,13C17.5,13,17,12.9,16.5,12.7L12.5,16.7C12.9,17.2,13,17.7,13,18.25C13,19.75,11.75,21,10.25,21S7.5,19.75,7.5,18.25C7.5,17.15,8.19,16.23,9.11,15.77L11.5,13.38V12.5C10.67,12.5,9.91,12.22,9.27,11.72C7.93,10.72,7.5,8.96,8.2,7.5C8.9,6.04,10.66,5.61,12.12,6.31C13.58,7.01,14.5,8.16,14.5,9.5M5,11.5C5,10.22,5.64,9.06,6.64,8.29C8.28,6.95,10.75,7.13,12.21,8.59C12.8,9.18,13.22,9.94,13.41,10.77C13,11.16,12.5,11.5,12.5,11.5C12.5,11.5,11.23,10.23,9.5,10.5C7.77,10.77,7.1,12.4,7.1,12.4C7.1,12.4,6.5,12.8,6.1,12.4C5.7,12,5,11.5,5,11.5M18,11.5C18.83,11.5,19.5,10.83,19.5,10S18.83,8.5,18,8.5,16.5,9.17,16.5,10S17.17,11.5,18,11.5M10.25,9.5A1.25,1.25 0 0,0 9,10.75A1.25,1.25 0 0,0 10.25,12A1.25,1.25 0 0,0 11.5,10.75A1.25,1.25 0 0,0 10.25,9.5Z" />
    </svg>
);

const HorseIcon = ({ color }: { color: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("h-8 w-8 drop-shadow-lg", color)}>
        <path d="M6.5,5.44C6.22,5.44 6,5.22 6,4.94C6,4.66 6.22,4.44 6.5,4.44H8.5L9.17,2.44C9.36,1.83 10.27,1.83 10.45,2.44L11.12,4.44H13.5C13.78,4.44 14,4.66 14,4.94C14,5.22 13.78,5.44 13.5,5.44H11.5L10.75,7.8C11.53,8.23 12.2,8.85 12.7,9.6L14.91,9.1C15.26,9 15.63,9.16 15.8,9.47L17.2,12H19.5C19.78,12 20,12.22 20,12.5C20,12.78 19.78,13 19.5,13H17.03L15.63,18.23C15.5,18.66 15.04,19 14.5,19H12.5V21.5C12.5,21.78 12.28,22 12,22C11.72,22 11.5,21.78 11.5,21.5V19H10.5C10.22,19 10,18.78 10,18.5C10,18.22 10.22,18 10.5,18H11.5V16H9.5V18H8.5C8.22,18 8,17.78 8,17.5C8,17.22 8.22,17 8.5,17H9.5V15H7.5V17H6.5C6.22,17 6,16.78 6,16.5C6,16.22 6.22,16 6.5,16H7.5V14H5.5V16H4.5C4.22,16 4,15.78 4,15.5C4,15.22 4.22,15 4.5,15H5.5V11H4.5C4.22,11 4,10.78 4,10.5C4,10.22 4.22,10 4.5,10H5.5V9.06C5.5,8 6.19,7.06 7.15,6.62L6.5,5.44Z" />
    </svg>
);

const HerdIcon = ({ type, color }: { type: string, color: string }) => {
    if (type?.toLowerCase().includes('caballo')) {
        return <HorseIcon color={color} />
    }
    return <CowIcon color={color} />
};


interface PastureMapProps {
    pastures: Pasture[] | null;
    herds: Herd[] | null;
    onSelectPasture: (pastureNumber: number) => void;
    selectedPastureNumber: number | null;
}

export default function PastureMap({ pastures, herds, onSelectPasture, selectedPastureNumber }: PastureMapProps) {
  const { farmMapUrl } = useTheme();
  const farmMapImageDefault = PlaceHolderImages.find((p) => p.id === 'farm-map-numbered');
  const displayImageUrl = farmMapUrl || farmMapImageDefault?.imageUrl;
  const displayImageHint = farmMapImageDefault?.imageHint || 'farm map numbered';

  const activePastureCoords = pastureCoordinates.filter(coord => pastures?.some(p => p.pastureNumber === coord.id));

  return (
    <div className="relative w-full h-full rounded-lg border bg-white overflow-hidden shadow-lg">
      {displayImageUrl ? (
        <Image
          src={displayImageUrl}
          alt="Plano de la finca con números"
          fill
          className="object-contain"
          data-ai-hint={displayImageHint}
          priority
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No se pudo cargar el plano de la finca.</p>
        </div>
      )}

      {activePastureCoords.map(p => (
        <div
            key={p.id}
            style={{ top: p.top, left: p.left }}
            className={cn(
                "absolute flex items-center justify-center h-8 w-8 rounded-full bg-black/40 text-white font-bold text-lg cursor-pointer transition-all duration-300 backdrop-blur-sm",
                selectedPastureNumber === p.id ? 'bg-primary scale-125' : 'hover:bg-black/60'
            )}
            onClick={() => onSelectPasture(p.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectPasture(p.id)}
            aria-label={`Potrero ${p.id}`}
        >
            {p.id}
        </div>
      ))}

      {herds?.map((herd, index) => {
        const pasture = pastureCoordinates.find(p => p.id === herd.currentPastureNumber);
        if (!pasture) return null;

        const colorClass = herdColors[index % herdColors.length];

        return (
            <div
                key={herd.id}
                style={{ top: pasture.top, left: pasture.left }}
                className="absolute transform -translate-y-6 -translate-x-3 transition-all duration-500"
                title={herd.name}
            >
                <HerdIcon type={herd.animalType || ''} color={colorClass} />
            </div>
        )
      })}
    </div>
  );
}
