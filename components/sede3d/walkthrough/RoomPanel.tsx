'use client';

import { LuChevronDown, LuInfo } from 'react-icons/lu';
import { ImageMedia } from '@/payload/components/Media';
import { cn } from '@/lib/utils';
import { floorLabel } from './floors';
import type { TrainingRoomSign } from './trainingRoomSigns';
import type { RoomInfo } from './walkthroughScene';

type Props = {
  room: RoomInfo;
  sign: TrainingRoomSign | null;
  expanded: boolean;
  onToggle: () => void;
  className?: string;
};

/**
 * The room the visitor is in, as a small bar that opens into its details: floor, area and, in
 * the training rooms, the sponsors' sign. It stays open or closed as the visitor walks on.
 */
const RoomPanel = ({ room, sign, expanded, onToggle, className }: Props) => (
  <section
    aria-label='Sala atual'
    className={cn(
      'card border-bege-dark bg-bege-light/95 w-[min(22rem,calc(100%-2rem))] border shadow-md',
      className
    )}
  >
    <button
      type='button'
      aria-expanded={expanded}
      aria-controls='walk-room-details'
      onClick={onToggle}
      className='flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left'
    >
      <LuInfo aria-hidden='true' className='text-green size-4 shrink-0' />
      <span className='min-w-0 flex-1'>
        <span className='block truncate text-sm font-semibold'>{sign?.name ?? room.name}</span>
        {sign && <span className='block truncate text-xs text-black/60'>{room.name}</span>}
      </span>
      <span className='text-xs text-black/50 pointer-coarse:hidden'>I</span>
      <LuChevronDown
        aria-hidden='true'
        className={cn('size-4 shrink-0 transition-transform', expanded && 'rotate-180')}
      />
    </button>
    {expanded && (
      <div id='walk-room-details' className='border-bege-dark border-t px-4 pt-3 pb-4'>
        <dl className='grid grid-cols-2 gap-2 text-sm'>
          <div className='card-sm bg-white px-3 py-2'>
            <dt className='text-xs text-black/60'>Piso</dt>
            <dd className='text-body_semibold'>{floorLabel(room.floor)}</dd>
          </div>
          <div className='card-sm bg-white px-3 py-2'>
            <dt className='text-xs text-black/60'>Área</dt>
            <dd className='text-body_semibold'>≈ {room.area} m²</dd>
          </div>
        </dl>
        {sign && (
          <>
            <p className='mt-3 text-sm'>{sign.text}</p>
            <ul className='mt-2 flex flex-wrap items-center gap-2' aria-label='Parceiros da sala'>
              {sign.logos.map((l) => (
                <li key={l.id} className='card-sm relative h-12 w-28 bg-white'>
                  <ImageMedia
                    resource={l.logo.url ?? undefined}
                    alt={l.logo.alt ?? l.name}
                    className='object-contain p-2'
                    sizes='112px'
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    )}
  </section>
);

export default RoomPanel;
