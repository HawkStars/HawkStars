'use client';

import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { LuArrowDown, LuArrowUp, LuRotateCcw, LuRotateCw } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  /** Forward (−1…1) and turn (−1…1, positive to the left) while a button is held. */
  onChange: (forward: number, turn: number) => void;
  className?: string;
};

const BUTTONS: { label: string; icon: ReactNode; forward: number; turn: number; area: string }[] = [
  {
    label: 'Andar em frente',
    icon: <LuArrowUp />,
    forward: 1,
    turn: 0,
    area: 'col-start-2 row-start-1',
  },
  {
    label: 'Rodar para a esquerda',
    icon: <LuRotateCcw />,
    forward: 0,
    turn: 1,
    area: 'col-start-1 row-start-2',
  },
  {
    label: 'Rodar para a direita',
    icon: <LuRotateCw />,
    forward: 0,
    turn: -1,
    area: 'col-start-3 row-start-2',
  },
  {
    label: 'Andar para trás',
    icon: <LuArrowDown />,
    forward: -1,
    turn: 0,
    area: 'col-start-2 row-start-2',
  },
];

/**
 * Movement without a keyboard or a mouse look: hold a button to walk or turn. Each button works
 * with a pointer (held down) and from the keyboard (Enter or Space held down), so it also serves
 * switch and single-button users.
 */
const MoveButtons = ({ onChange, className }: Props) => {
  const held = useRef<string | null>(null);
  const press = (b: (typeof BUTTONS)[number]) => {
    held.current = b.label;
    onChange(b.forward, b.turn);
  };
  const release = () => {
    held.current = null;
    onChange(0, 0);
  };
  const onKey = (b: (typeof BUTTONS)[number]) => (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    if (e.type === 'keydown' && held.current !== b.label) press(b);
    if (e.type === 'keyup') release();
  };

  return (
    <div
      role='group'
      aria-label='Botões de movimento'
      className={cn('grid grid-cols-3 grid-rows-2 gap-1.5', className)}
    >
      {BUTTONS.map((b) => (
        <Button
          key={b.label}
          type='button'
          size='icon-lg'
          variant='secondary'
          aria-label={b.label}
          title={b.label}
          className={cn('touch-none shadow-md [&_svg]:size-6', b.area)}
          onPointerDown={(e) => {
            press(b);
            try {
              e.currentTarget.setPointerCapture(e.pointerId); // keep the hold if the finger slides
            } catch {
              // no active pointer to capture (assistive tech, synthetic events): the press stands
            }
          }}
          onPointerUp={release}
          onPointerCancel={release}
          onLostPointerCapture={release}
          onKeyDown={onKey(b)}
          onKeyUp={onKey(b)}
          onBlur={release}
        >
          {b.icon}
        </Button>
      ))}
    </div>
  );
};

export default MoveButtons;
