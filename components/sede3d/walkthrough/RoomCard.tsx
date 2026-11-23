'use client';

import { Button } from '@/components/ui/button';
import { ImageMedia } from '@/payload/components/Media';
import { floorLabel } from './floors';
import type { Interaction } from './walkthroughScene';

type Props = Interaction & {
  onClose: () => void;
  /** Close and go back to walking (pointer lock on desktop). */
  onResume: () => void;
};

/** What a room's info point (or a training-room sign) opens: the room, and its sponsors. */
const RoomCard = ({ room, sign, onClose, onResume }: Props) => (
  <aside
    role='dialog'
    aria-labelledby='walk-room-title'
    className='card border-bege-dark bg-bege-light absolute inset-x-4 bottom-4 z-30 max-h-[70%] overflow-y-auto border p-5 shadow-lg md:inset-x-auto md:top-4 md:right-4 md:bottom-auto md:w-96'
  >
    <p className='text-eyebrow text-green'>{floorLabel(room.floor)}</p>
    <h2 id='walk-room-title' className='text-h2_bold mt-1'>
      {sign?.name ?? room.name}
    </h2>
    {sign && <p className='text-sm text-black/60'>{room.name}</p>}
    <dl className='mt-4 grid grid-cols-2 gap-3 text-sm'>
      <div className='card-sm bg-white p-3'>
        <dt className='text-black/60'>Área</dt>
        <dd className='text-body_semibold'>≈ {room.area} m²</dd>
      </div>
      <div className='card-sm bg-white p-3'>
        <dt className='text-black/60'>Piso</dt>
        <dd className='text-body_semibold'>{floorLabel(room.floor)}</dd>
      </div>
    </dl>
    {sign && (
      <div className='mt-4'>
        <p className='text-body_regular'>{sign.text}</p>
        <ul className='mt-3 flex flex-wrap items-center gap-4' aria-label='Parceiros da sala'>
          {sign.logos.map((l) => (
            <li key={l.id} className='card-sm relative h-14 w-32 bg-white'>
              <ImageMedia
                resource={l.logo.url ?? undefined}
                alt={l.logo.alt ?? l.name}
                className='object-contain p-2'
                sizes='128px'
              />
            </li>
          ))}
        </ul>
      </div>
    )}
    <div className='mt-5 flex gap-2'>
      <Button className='flex-1' onClick={onResume}>
        Continuar a visita
      </Button>
      <Button variant='outline' onClick={onClose}>
        Fechar
      </Button>
    </div>
  </aside>
);

export default RoomCard;
