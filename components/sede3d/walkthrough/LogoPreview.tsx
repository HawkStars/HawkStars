'use client';

import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { TrainingRoomSign } from './trainingRoomSigns';

export type LogoRoomId = TrainingRoomSign['roomId'];

/** What is being tried on the wall: which room, the image (an object URL) and its width. */
export type LogoTrial = { room: LogoRoomId; url: string | null; name: string; width: number };

export const NO_LOGO_TRIAL: LogoTrial = { room: 'formacao-a', url: null, name: '', width: 1.6 };

const ROOMS: { id: LogoRoomId; label: string }[] = [
  { id: 'formacao-a', label: 'Sala A' },
  { id: 'formacao-b', label: 'Sala B' },
];

type Props = {
  value: LogoTrial;
  onChange: (next: LogoTrial) => void;
  /** Stand in front of the room's sign wall. */
  onView: (room: LogoRoomId) => void;
  className?: string;
};

/**
 * Try a logo on the front wall of a training room: pick an image from the computer, a room and
 * a width, and the walkthrough paints it where the room's sign hangs. The state lives in the
 * parent, so the logo stays on the wall while the visitor walks (this menu closes then). The
 * file never leaves the browser: it is shown from an object URL.
 */
const LogoPreview = ({ value, onChange, onView, className }: Props) => {
  const fileId = useId();
  const widthId = useId();
  // remounts the file input on "Repor placa", so it forgets the chosen file
  const [inputKey, setInputKey] = useState(0);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className='text-sm font-semibold'>Logotipo na sala de formação</p>
      <div role='group' aria-label='Sala' className='flex gap-1'>
        {ROOMS.map((r) => (
          <Button
            key={r.id}
            size='sm'
            variant={value.room === r.id ? 'default' : 'outline'}
            aria-pressed={value.room === r.id}
            className='flex-1'
            onClick={() => onChange({ ...value, room: r.id })}
          >
            {r.label}
          </Button>
        ))}
      </div>
      <Label htmlFor={fileId} className='text-xs font-normal text-black/70'>
        Imagem (PNG ou SVG com fundo transparente fica melhor)
      </Label>
      <input
        key={inputKey}
        id={fileId}
        type='file'
        accept='image/*'
        className='file:bg-green w-full text-xs file:mr-2 file:rounded-md file:border-0 file:px-2 file:py-1 file:text-white'
        onChange={(e) => {
          const file = e.target.files?.[0];
          onChange({
            ...value,
            url: file ? URL.createObjectURL(file) : null,
            name: file?.name ?? '',
          });
        }}
      />
      {value.url && (
        <>
          <label
            htmlFor={widthId}
            className='grid grid-cols-[auto_1fr_auto] items-center gap-2 text-xs'
          >
            <span>Largura</span>
            <input
              id={widthId}
              type='range'
              min={0.4}
              max={3}
              step={0.1}
              value={value.width}
              onChange={(e) => onChange({ ...value, width: Number(e.target.value) })}
              className='accent-green w-full'
            />
            <output className='min-w-10 text-right font-semibold tabular-nums'>
              {value.width.toFixed(1)} m
            </output>
          </label>
          <div className='flex gap-1'>
            <Button size='sm' className='flex-1' onClick={() => onView(value.room)}>
              Ver na parede
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                setInputKey((k) => k + 1);
                onChange({ ...value, url: null, name: '' });
              }}
            >
              Repor placa
            </Button>
          </div>
        </>
      )}
      <p className='text-xs text-black/50'>A imagem fica só no teu browser; não é enviada.</p>
    </div>
  );
};

export default LogoPreview;
