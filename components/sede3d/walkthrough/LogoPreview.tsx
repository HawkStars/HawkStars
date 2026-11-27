'use client';

import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { NamingTarget } from './walkthroughScene';

/**
 * What is being tried: where (a training room or the building), the sponsor's name, the image
 * (an object URL) and, for a room's front wall, the logo's width. `fileName` is for the label.
 */
export type LogoTrial = {
  target: NamingTarget;
  name: string;
  url: string | null;
  fileName: string;
  width: number;
};

export const NO_LOGO_TRIAL: LogoTrial = {
  target: 'formacao-a',
  name: '',
  url: null,
  fileName: '',
  width: 1.6,
};

const TARGETS: { id: NamingTarget; label: string }[] = [
  { id: 'formacao-a', label: 'Sala A' },
  { id: 'formacao-b', label: 'Sala B' },
  { id: 'edificio', label: 'Edifício' },
];

type Props = {
  value: LogoTrial;
  onChange: (next: LogoTrial) => void;
  /** Stand where the trial can be seen: in the room or at its door, or across the street. */
  onView: (target: NamingTarget, where?: 'sala' | 'porta') => void;
  className?: string;
};

/**
 * Naming trial, to show a sponsor their name on the training rooms or the building: pick where,
 * type a name and choose a logo from the computer. A room gets the name and logo on its door
 * plaque and the logo on its front wall (at the chosen width); the building gets them on the
 * façade sign. The state lives in the parent, so the trial stays while the visitor walks (this
 * menu closes then). The file never leaves the browser: it is shown from an object URL.
 */
const LogoPreview = ({ value, onChange, onView, className }: Props) => {
  const fileId = useId();
  const nameId = useId();
  const widthId = useId();
  // remounts the file input on "Repor", so it forgets the chosen file
  const [inputKey, setInputKey] = useState(0);
  const active = Boolean(value.url || value.name);
  const room = value.target !== 'edificio';

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className='text-sm font-semibold'>Naming: experimentar nome e logotipo</p>
      <div role='group' aria-label='Onde' className='flex gap-1'>
        {TARGETS.map((r) => (
          <Button
            key={r.id}
            size='sm'
            variant={value.target === r.id ? 'default' : 'outline'}
            aria-pressed={value.target === r.id}
            className='flex-1 px-1'
            onClick={() => onChange({ ...value, target: r.id })}
          >
            {r.label}
          </Button>
        ))}
      </div>
      <Label htmlFor={nameId} className='text-xs font-normal text-black/70'>
        Nome {room ? 'da sala' : 'do edifício'}
      </Label>
      <input
        id={nameId}
        type='text'
        value={value.name}
        maxLength={60}
        placeholder={room ? 'Ex.: Sala Fundação Exemplo' : 'Ex.: Centro de Formação Exemplo'}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
        className='border-bege-dark focus-visible:border-green h-9 rounded-md border bg-white px-2 text-sm outline-none'
      />
      <Label htmlFor={fileId} className='text-xs font-normal text-black/70'>
        Logotipo (PNG ou SVG com fundo transparente fica melhor)
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
            fileName: file?.name ?? '',
          });
        }}
      />
      {room && value.url && (
        <label
          htmlFor={widthId}
          className='grid grid-cols-[auto_1fr_auto] items-center gap-2 text-xs'
        >
          <span>Na parede</span>
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
      )}
      <div className='flex gap-1'>
        <Button size='sm' className='flex-1 px-2' onClick={() => onView(value.target, 'sala')}>
          {room ? 'Ver na sala' : 'Ver o edifício'}
        </Button>
        {room && (
          <Button
            size='sm'
            variant='secondary'
            className='flex-1 px-2'
            onClick={() => onView(value.target, 'porta')}
          >
            Ver a porta
          </Button>
        )}
        {active && (
          <Button
            size='sm'
            variant='outline'
            onClick={() => {
              setInputKey((k) => k + 1);
              onChange({ ...value, url: null, fileName: '', name: '' });
            }}
          >
            Repor
          </Button>
        )}
      </div>
      <p className='text-xs text-black/50'>
        {room
          ? 'Aparece na placa à porta da sala e na parede da frente.'
          : 'Aparece na placa da fachada, virada para a travessa.'}{' '}
        A imagem fica só no teu browser; não é enviada.
      </p>
    </div>
  );
};

export default LogoPreview;
