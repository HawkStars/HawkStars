'use client';

import { LuChevronDown } from 'react-icons/lu';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { floorLabel } from './floors';
import MoveButtons from './MoveButtons';
import { cn } from '@/lib/utils';
import RoomPanel from './RoomPanel';
import WalkMinimap from './WalkMinimap';
import { useRoomyScreen } from '../useRoomyScreen';
import type { TrainingRoomSign } from './trainingRoomSigns';
import type { Pose, RoomInfo, SpotId, WalkMap, WalkthroughScene } from './walkthroughScene';

const MODEL_URL = '/models/sede-revit.glb';
const JOYSTICK_RADIUS = 48;
const SPEEDS: { label: string; factor: number }[] = [
  { label: 'Devagar', factor: 0.6 },
  { label: 'Normal', factor: 1 },
  { label: 'Depressa', factor: 1.6 },
];

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
 * or the on-screen joystick, look with the mouse or by dragging, jump between floors, read about
 * the room you are in (a panel that opens and closes) and use the minimap to go anywhere.
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
  const [aim, setAim] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  // the menu folds into a single button; it starts open only on a big screen
  const roomy = useRoomyScreen();
  // null until the visitor opens or folds it themselves
  const [menuChoice, setMenuChoice] = useState<boolean | null>(null);
  const menuOpen = menuChoice ?? roomy;
  // on a small screen, fold the menu away once a destination is picked
  const foldIfSmall = () => {
    if (!roomy) setMenuChoice(false);
  };
  // doors start hidden, so every doorway reads as a way through
  const [showDoors, setShowDoors] = useState(false);
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  // accessibility: on-screen movement buttons and walking speed
  const [moveButtons, setMoveButtons] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [map, setMap] = useState<WalkMap | null>(null);
  const [pose, setPose] = useState<Pose | null>(null);
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
        onLoad: (m, r) => {
          setMap(m);
          setRooms(r);
          setStatus('ready');
        },
        onError: () => setStatus('error'),
        onRoom: setRoom,
        onLockChange: setLocked,
        onAim: setAim,
        onInteract: () => setExpanded(true),
        onPose: setPose,
      });
      scene.setDoorsVisible(false);
      sceneRef.current = scene;
    });
    return () => {
      disposed = true;
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [signs]);

  // number keys jump between the teleport points; I opens or closes the room panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.code === 'KeyI') setExpanded((x) => !x);
      if (e.code === 'KeyP') setShowDoors((x) => !x);
      const i = Number(e.key) - 1;
      if (Number.isInteger(i) && SPOTS[i]) sceneRef.current?.goTo(SPOTS[i].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    sceneRef.current?.setDoorsVisible(showDoors);
  }, [showDoors]);

  useEffect(() => {
    sceneRef.current?.setSpeed(speed);
  }, [speed]);

  const canLock = () => window.matchMedia('(pointer: fine)').matches;

  const start = () => {
    setStarted(true);
    if (canLock()) sceneRef.current?.lock();
  };

  const resume = () => {
    if (canLock()) sceneRef.current?.lock();
  };

  const goTo = (id: SpotId) => sceneRef.current?.goTo(id);
  const goToRoom = (id: string) => sceneRef.current?.goToRoom(id);

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

  const walking = status === 'ready' && started;
  const current = rooms.find((r) => r.name === room) ?? null;
  const currentSign = signs.find((s) => s.roomId === current?.signId) ?? null;

  return (
    <div className='bg-bege-light relative h-[calc(100svh-5rem)] min-h-72 w-full overflow-hidden select-none'>
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

      {/* crosshair: a ring when it is on something that opens */}
      {walking && (
        <span
          aria-hidden='true'
          className={
            aim
              ? 'pointer-events-none absolute top-1/2 left-1/2 size-5 -translate-1/2 rounded-full border-2 border-white shadow-sm ring-1 ring-black/30'
              : 'pointer-events-none absolute top-1/2 left-1/2 size-1.5 -translate-1/2 rounded-full bg-white/80 ring-1 ring-black/30'
          }
        />
      )}

      {/* where you are: a bar that opens into the room's details */}
      {walking && current && (
        <RoomPanel
          room={current}
          sign={currentSign}
          expanded={expanded}
          onToggle={() => setExpanded((x) => !x)}
          className={cn(
            'absolute top-4 left-1/2 z-10 -translate-x-1/2',
            locked && 'pointer-events-none'
          )}
        />
      )}

      {/* start screen */}
      {status === 'ready' && !started && (
        <div className='absolute inset-0 z-20 grid place-items-center bg-black/30 p-4'>
          <div className='card border-bege-dark bg-bege-light w-full max-w-md border p-6 shadow-md'>
            <p className='text-eyebrow text-green'>Visita virtual · teste</p>
            <h1 className='text-h2_bold mt-1'>Percorre a sede HawkStars</h1>
            <ul className='mt-4 flex flex-col gap-1.5 text-sm text-black/70'>
              <li className='pointer-coarse:hidden'>
                <b>W A S D</b> ou <b>↑ ↓</b> para andar, <b>← →</b> para rodar, <b>Shift</b> para
                correr
              </li>
              <li>
                <b>Clica</b> (ou toca) no chão para ires até lá; no menu há botões de movimento, a
                velocidade e a lista de todas as salas
              </li>
              <li className='pointer-coarse:hidden'>
                <b>Rato</b> para olhar à volta, <b>Esc</b> para largar o rato
              </li>
              <li className='pointer-coarse:hidden'>
                <b>I</b> abre ou fecha a informação da sala; aponta para uma placa e carrega em{' '}
                <b>E</b> para ver os parceiros
              </li>
              <li className='hidden pointer-coarse:list-item'>
                <b>Joystick</b> em baixo à esquerda para andar
              </li>
              <li className='hidden pointer-coarse:list-item'>
                <b>Arrasta</b> no ecrã para olhar à volta; toca no nome da sala para saber mais
              </li>
              <li>
                As <b>portas</b> estão escondidas para veres por onde se passa; mostra-as no menu
                <span className='pointer-coarse:hidden'>
                  {' '}
                  ou com a tecla <b>P</b>
                </span>
              </li>
              <li>
                <b>Mapa</b> e botões dos pisos (ou teclas 1–5) para ir a qualquer sala. As escadas
                também se sobem a pé.
              </li>
            </ul>
            <Button size='lg' className='mt-6 w-full' onClick={start}>
              Começar a visita
            </Button>
          </div>
        </div>
      )}

      {/* floors */}
      {walking && !locked && (
        <nav
          aria-label='Ir para'
          className='card border-bege-dark bg-bege-light/95 absolute top-16 left-4 z-10 flex max-h-[calc(100%-5rem)] flex-col gap-1 overflow-y-auto border p-2 shadow-md md:top-4 md:max-h-[calc(100%-2rem)]'
        >
          <button
            type='button'
            aria-expanded={menuOpen}
            aria-controls='walk-menu'
            onClick={() => setMenuChoice(!menuOpen)}
            className='flex items-center justify-between gap-3 rounded-md px-3 py-1.5 text-sm font-medium'
          >
            Menu
            <LuChevronDown
              aria-hidden='true'
              className={cn('size-4 shrink-0 transition-transform', menuOpen && 'rotate-180')}
            />
          </button>
          <div id='walk-menu' className={cn('flex flex-col gap-1', !menuOpen && 'hidden')}>
            {SPOTS.map((s, i) => (
              <Button
                key={s.id}
                size='sm'
                variant='ghost'
                className='justify-start'
                onClick={() => {
                  goTo(s.id);
                  foldIfSmall();
                }}
              >
                <span className='w-4 text-black/40 tabular-nums pointer-coarse:hidden'>
                  {i + 1}
                </span>
                {s.label}
              </Button>
            ))}
            <div className='border-bege-dark mt-1 flex items-center justify-between gap-3 border-t px-3 pt-2'>
              <Label htmlFor='walk-doors' className='text-sm'>
                Mostrar portas
                <span className='ml-1 text-xs text-black/40 pointer-coarse:hidden'>P</span>
              </Label>
              <Switch
                id='walk-doors'
                aria-label='Mostrar portas'
                checked={showDoors}
                onCheckedChange={setShowDoors}
              />
            </div>
            <div className='flex items-center justify-between gap-3 px-3 pt-1'>
              <Label htmlFor='walk-buttons' className='text-sm'>
                Botões de movimento
              </Label>
              <Switch
                id='walk-buttons'
                aria-label='Botões de movimento no ecrã'
                checked={moveButtons}
                onCheckedChange={setMoveButtons}
              />
            </div>
            <div className='px-3 pt-1'>
              <p id='walk-speed' className='text-sm'>
                Velocidade
              </p>
              <div role='group' aria-labelledby='walk-speed' className='mt-1 flex gap-1'>
                {SPEEDS.map((sp) => (
                  <Button
                    key={sp.label}
                    size='sm'
                    variant={speed === sp.factor ? 'default' : 'outline'}
                    aria-pressed={speed === sp.factor}
                    className='flex-1 px-2'
                    onClick={() => setSpeed(sp.factor)}
                  >
                    {sp.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className='px-3 pt-2'>
              <Select
                onValueChange={(id) => {
                  goToRoom(id);
                  foldIfSmall();
                }}
              >
                <SelectTrigger aria-label='Ir para uma sala' className='h-9 bg-white text-sm'>
                  <SelectValue placeholder='Ir para uma sala…' />
                </SelectTrigger>
                <SelectContent>
                  {[...rooms]
                    .sort((a, b) => a.floor.localeCompare(b.floor) || a.name.localeCompare(b.name))
                    .map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {floorLabel(r.floor)} · {r.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button size='sm' className='mt-1 pointer-coarse:hidden' onClick={resume}>
              Continuar
            </Button>
          </div>
        </nav>
      )}

      {/* minimap: always visible on larger screens, follows the visitor */}
      {walking && map && (
        <WalkMinimap
          map={map}
          pose={pose}
          room={room}
          onGo={goToRoom}
          className={
            locked
              ? 'pointer-events-none absolute right-4 bottom-4 z-10 hidden w-80 opacity-90 md:block [@media(max-height:36rem)]:hidden'
              : 'absolute right-4 bottom-4 z-10 hidden w-80 md:block [@media(max-height:36rem)]:hidden'
          }
        />
      )}

      {walking && locked && (
        <p className='pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-xs text-white'>
          {aim ? (
            <>
              <b>E</b> ou clique · {aim}
            </>
          ) : (
            'Esc para largar o rato e escolher um piso · 1–5 para saltar · I informação da sala'
          )}
        </p>
      )}

      {/* on-screen movement buttons (accessibility option) */}
      {walking && moveButtons && (
        <MoveButtons
          onChange={(f, t) => sceneRef.current?.setControls(f, t)}
          className={cn(
            'absolute bottom-6 left-1/2 z-10 -translate-x-1/2 md:right-[22rem] md:left-auto md:translate-x-0',
            locked && 'pointer-events-none opacity-60'
          )}
        />
      )}

      {/* touch joystick */}
      {walking && (
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
