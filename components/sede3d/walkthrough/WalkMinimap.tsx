'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { floorLabel } from './floors';
import type { Pose, WalkMap } from './walkthroughScene';

type Props = {
  map: WalkMap;
  pose: Pose | null;
  room: string | null;
  onGo: (roomId: string) => void;
  className?: string;
};

/**
 * Plan of the floor the visitor is on, with a "you are here" arrow. Clicking a room walks there;
 * the floor tabs show another floor (the map follows the visitor again when they change floor).
 */
const WalkMinimap = ({ map, pose, room, onGo, className }: Props) => {
  const [picked, setPicked] = useState<{ floor: string; from: string | null } | null>(null);
  // a picked tab holds until the visitor changes floor
  const following = !picked || picked.from !== (pose?.floor ?? null);
  const shown = (following ? pose?.floor : picked.floor) ?? map.floors[0]?.floor;
  const plan = map.floors.find((f) => f.floor === shown) ?? map.floors[0];
  if (!plan) return null;
  // outside the building (no floor yet) the arrow shows on whichever plan is open
  const onThisFloor = pose && (pose.floor === plan.floor || pose.floor === null);

  return (
    <div className={cn('card border-bege-dark border bg-white/95 p-2 shadow-md', className)}>
      <div className='mb-1 flex gap-1' role='tablist' aria-label='Pisos'>
        {map.floors.map((f) => (
          <button
            key={f.floor}
            role='tab'
            aria-selected={f.floor === plan.floor}
            className={cn(
              'rounded-md px-2 py-0.5 text-xs font-semibold',
              f.floor === plan.floor ? 'bg-green text-white' : 'hover:bg-bege-dark text-black/60'
            )}
            onClick={() => setPicked({ floor: f.floor, from: pose?.floor ?? null })}
          >
            {floorLabel(f.floor)}
          </button>
        ))}
      </div>
      <svg
        viewBox={map.viewBox.join(' ')}
        className='block h-auto w-full'
        role='img'
        aria-label={`Planta do ${floorLabel(plan.floor)}`}
      >
        {plan.rooms.map((r, i) => (
          <path
            // a room's floor can be several meshes (one per material), even with equal outlines
            key={`${r.name}-${i}`}
            d={r.d}
            className={cn(
              'stroke-[0.05]',
              r.name === room && onThisFloor
                ? 'fill-green/30 stroke-green/30'
                : 'fill-bege-dark stroke-bege-dark',
              r.id && 'hover:fill-green/20 hover:stroke-green/20 cursor-pointer'
            )}
            onClick={r.id ? () => onGo(r.id as string) : undefined}
          >
            <title>{r.id ? `Ir para: ${r.name}` : r.name}</title>
          </path>
        ))}
        <path
          d={plan.walls}
          className='pointer-events-none fill-none stroke-black/70 stroke-[0.12]'
        />
        {onThisFloor && (
          <g
            transform={`translate(${pose.x} ${pose.y}) rotate(${(pose.heading * 180) / Math.PI})`}
            className='pointer-events-none'
          >
            <circle r='0.9' className='fill-green/20' />
            <path
              d='M0,-0.75 L0.5,0.5 L0,0.25 L-0.5,0.5 Z'
              className='fill-green stroke-white stroke-[0.1]'
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default WalkMinimap;
