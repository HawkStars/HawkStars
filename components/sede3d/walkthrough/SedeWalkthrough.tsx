'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Button } from '@/components/ui/button';
import type { TrainingRoomSign } from './trainingRoomSigns';
import type { SpotId, WalkthroughScene } from './walkthroughScene';

const MODEL_URL = '/models/sede-revit.glb';
const JOYSTICK_RADIUS = 48;

/** Arrival points; their positions come from the `spot:<id>` nodes in the model. */
const SPOTS: { id: SpotId; label: string }[] = [
  { id: 'entrada', label: 'Entrada' },
  { id: 'piso0', label: 'Piso 0 · Restaurante' },
  { id: 'piso1', label: 'Piso 1 · Átrio' },
  { id: 'formacao', label: 'Sala de formação A' },
  { id: 'piso2', label: 'Piso 2 · Sala de formação B' },
];

type Props = {
  /** Names and logos shown in the two training rooms. */
  signs: TrainingRoomSign[];
};

/**
 * First-person walk through the architect's model of the headquarters: walk with the keyboard
 * or the on-screen joystick, look with the mouse or by dragging, and jump between floors.
 */
const SedeWalkthrough = ({ signs }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<WalkthroughScene | null>(null);
  const stickOrigin = useRef<{ id: number; x: number; y: number } | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [room, setRoom] = useState<string | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let disposed = false;
    let scene: WalkthroughScene | null = null;
    import('./walkthroughScene').then(({ createWalkthroughScene }) => {
      const container = containerRef.current;
      if (disposed || !container) return;
      scene = createWalkthroughScene({
        container,
        url: MODEL_URL,
        signs,
        onProgress: setProgress,
        onLoad: () => setStatus('ready'),
        onError: () => setStatus('error'),
        onRoom: setRoom,
        onLockChange: setLocked,
      });
      sceneRef.current = scene;
    });
    return () => {
      disposed = true;
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [signs]);

  // number keys jump between the teleport points
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const i = Number(e.key) - 1;
      if (Number.isInteger(i) && SPOTS[i]) sceneRef.current?.goTo(SPOTS[i].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const start = () => {
    setStarted(true);
    if (window.matchMedia('(pointer: fine)').matches) sceneRef.current?.lock();
  };

  const goTo = (id: SpotId) => sceneRef.current?.goTo(id);

  const stickMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const origin = stickOrigin.current;
    if (!origin || origin.id !== e.pointerId) return;
    let dx = e.clientX - origin.x;
    let dy = e.clientY - origin.y;
    const len = Math.hypot(dx, dy);
    if (len > JOYSTICK_RADIUS) {
      dx = (dx / len) * JOYSTICK_RADIUS;
      dy = (dy / len) * JOYSTICK_RADIUS;
    }
    setKnob({ x: dx, y: dy });
    sceneRef.current?.setJoystick(dx / JOYSTICK_RADIUS, -dy / JOYSTICK_RADIUS);
  };
  const stickEnd = () => {
    stickOrigin.current = null;
    setKnob({ x: 0, y: 0 });
    sceneRef.current?.setJoystick(0, 0);
  };

  return (
    <div className='bg-bege-light relative h-[calc(100svh-5rem)] min-h-136 w-full overflow-hidden select-none'>
      <div
        ref={containerRef}
        className='absolute inset-0'
        aria-label='Visita em primeira pessoa à sede'
      />

      {status !== 'ready' && (
        <p
          aria-live='polite'
          className='text-body_regular absolute inset-0 grid place-items-center text-black/60'
        >
          {status === 'error'
            ? 'Não foi possível carregar o modelo.'
            : `A carregar o modelo 3D… ${Math.round(progress * 100)}%`}
        </p>
      )}

      {/* crosshair */}
      {status === 'ready' && started && (
        <span
          aria-hidden='true'
          className='pointer-events-none absolute top-1/2 left-1/2 size-1.5 -translate-1/2 rounded-full bg-white/80 ring-1 ring-black/30'
        />
      )}

      {/* where you are */}
      {status === 'ready' && started && room && (
        <p
          aria-live='polite'
          className='card-sm pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 text-sm font-semibold shadow-sm'
        >
          {room}
        </p>
      )}

      {/* start screen */}
      {status === 'ready' && !started && (
        <div className='absolute inset-0 z-20 grid place-items-center bg-black/30 p-4'>
          <div className='card border-bege-dark bg-bege-light w-full max-w-md border p-6 shadow-md'>
            <p className='text-eyebrow text-green'>Visita virtual · teste</p>
            <h1 className='text-h2_bold mt-1'>Percorre a sede HawkStars</h1>
            <ul className='mt-4 flex flex-col gap-1.5 text-sm text-black/70'>
              <li className='pointer-coarse:hidden'>
                <b>W A S D</b> ou setas para andar, <b>Shift</b> para correr
              </li>
              <li className='pointer-coarse:hidden'>
                <b>Rato</b> para olhar à volta, <b>Esc</b> para largar o rato
              </li>
              <li className='hidden pointer-coarse:list-item'>
                <b>Joystick</b> em baixo à esquerda para andar
              </li>
              <li className='hidden pointer-coarse:list-item'>
                <b>Arrasta</b> no ecrã para olhar à volta
              </li>
              <li>
                <b>Botões dos pisos</b> (ou teclas 1–5) para saltar de piso. As escadas também se
                sobem a pé.
              </li>
            </ul>
            <Button size='lg' className='mt-6 w-full' onClick={start}>
              Começar a visita
            </Button>
          </div>
        </div>
      )}

      {/* floors */}
      {status === 'ready' && started && !locked && (
        <nav
          aria-label='Ir para'
          className='card border-bege-dark bg-bege-light/95 absolute top-16 left-4 z-10 flex flex-col gap-1 border p-2 shadow-md md:top-4'
        >
          {SPOTS.map((s, i) => (
            <Button
              key={s.id}
              size='sm'
              variant='ghost'
              className='justify-start'
              onClick={() => goTo(s.id)}
            >
              <span className='w-4 text-black/40 tabular-nums pointer-coarse:hidden'>{i + 1}</span>
              {s.label}
            </Button>
          ))}
          <Button
            size='sm'
            className='mt-1 pointer-coarse:hidden'
            onClick={() => sceneRef.current?.lock()}
          >
            Continuar
          </Button>
        </nav>
      )}

      {status === 'ready' && started && locked && (
        <p className='pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-xs text-white'>
          Esc para largar o rato e escolher um piso · teclas 1–5 para saltar
        </p>
      )}

      {/* touch joystick */}
      {status === 'ready' && started && (
        <div
          role='presentation'
          className='absolute bottom-8 left-8 z-10 hidden size-32 touch-none place-items-center rounded-full border-2 border-white/70 bg-black/20 pointer-coarse:grid'
          onPointerDown={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            stickOrigin.current = {
              id: e.pointerId,
              x: r.left + r.width / 2,
              y: r.top + r.height / 2,
            };
            e.currentTarget.setPointerCapture(e.pointerId);
            stickMove(e);
          }}
          onPointerMove={stickMove}
          onPointerUp={stickEnd}
          onPointerCancel={stickEnd}
        >
          <span
            className='size-12 rounded-full bg-white/85 shadow-md'
            style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
          />
        </div>
      )}
    </div>
  );
};

export default SedeWalkthrough;
