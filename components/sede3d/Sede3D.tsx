'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FLOORS, ROOMS, type FloorView } from './data';
import type { SedeScene } from './scene';

const DEFAULT_HINT: Record<FloorView, string> = {
  ext: 'Rua inclinada: o edifício novo assenta cerca de 1,8 m acima do antigo. Escolhe um piso para cortar as paredes e ver o interior.',
  '0': 'Toca num espaço para aproximar a câmara.',
  '1': 'Toca num espaço para aproximar a câmara.',
  '2': 'Toca num espaço para aproximar a câmara.',
};

const formatHour = (h: number) =>
  `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;

type ToggleProps = { label: string; pressed: boolean; onChange: (on: boolean) => void };

const Toggle = ({ label, pressed, onChange }: ToggleProps) => (
  <button
    type='button'
    aria-pressed={pressed}
    onClick={() => onChange(!pressed)}
    className={cn(
      'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
      pressed ? 'border-green bg-green/10 text-green' : 'border-bege-dark bg-white text-black/60'
    )}
  >
    {label}
  </button>
);

/**
 * Interactive 3D model of the HawkStars headquarters. three.js is imported lazily inside
 * the effect, so it never runs on the server and stays out of every other page's bundle.
 */
const Sede3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<SedeScene | null>(null);

  const [ready, setReady] = useState(false);
  const [view, setView] = useState<FloorView>('ext');
  const [active, setActive] = useState<string | null>(null);
  const [furniture, setFurniture] = useState(true);
  const [labels, setLabels] = useState(true);
  const [context, setContext] = useState(true);
  const [hour, setHour] = useState(15);

  const selectRoom = useCallback((id: string) => {
    const room = ROOMS.find((r) => r.id === id);
    if (!room) return;
    setView(room.floor);
    setActive(id);
    sceneRef.current?.focusRoom(id);
  }, []);

  useEffect(() => {
    let disposed = false;
    let scene: SedeScene | null = null;
    import('./scene').then(({ createSedeScene }) => {
      const container = containerRef.current;
      const labelLayer = labelsRef.current;
      const panel = panelRef.current;
      if (disposed || !container || !labelLayer || !panel) return;
      scene = createSedeScene({ container, labels: labelLayer, panel, onSelectRoom: selectRoom });
      sceneRef.current = scene;
      setReady(true);
    });
    return () => {
      disposed = true;
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [selectRoom]);

  // The bottom sheet changes height with the room list; re-frame once it has rendered.
  useEffect(() => {
    sceneRef.current?.resize();
  }, [view, active]);

  const changeView = (v: FloorView) => {
    setView(v);
    setActive(null);
    sceneRef.current?.setView(v);
  };

  const rooms = ROOMS.filter((r) => r.floor === view);
  const activeRoom = ROOMS.find((r) => r.id === active);
  const total = rooms.reduce((sum, r) => sum + r.area, 0);

  return (
    <div className='bg-bege-light relative h-[calc(100svh-5rem)] min-h-[34rem] w-full overflow-hidden'>
      <div
        ref={containerRef}
        className='absolute inset-0'
        aria-label='Modelo 3D interativo da sede'
      />
      <div ref={labelsRef} className='pointer-events-none absolute inset-0 z-[5]' />
      {!ready && (
        <p className='text-body_regular absolute inset-0 grid place-items-center text-black/60'>
          A carregar o modelo 3D…
        </p>
      )}

      <aside
        ref={panelRef}
        aria-label='Controlos do modelo'
        className='border-bege-dark bg-bege-light/95 absolute inset-x-2.5 bottom-2.5 z-10 flex max-h-[48%] flex-col gap-3 overflow-auto rounded-xl border p-3.5 shadow-md backdrop-blur md:inset-x-auto md:top-4 md:bottom-auto md:left-4 md:max-h-[calc(100%-2rem)] md:w-85 md:gap-4 md:p-4.5'
      >
        <div>
          <p className='text-eyebrow text-green'>Associação HawkStars · Pinhel</p>
          <h1 className='text-h2_bold mt-1'>Sede HawkStars</h1>
          <p className='mt-1.5 hidden text-sm text-black/60 md:block'>
            Dois edifícios ligados por um átrio coberto, na Travessa do Portão Norte. Escolhe um
            piso para ver o interior.
          </p>
        </div>

        <div
          role='group'
          aria-label='Piso'
          className='border-bege-dark grid grid-cols-4 gap-1 rounded-lg border bg-white p-1'
        >
          {FLOORS.map((f) => (
            <Button
              key={f.id}
              size='sm'
              variant={view === f.id ? 'default' : 'ghost'}
              aria-pressed={view === f.id}
              onClick={() => changeView(f.id)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className='flex min-w-0 flex-col gap-2'>
          <div className='text-eyebrow flex items-baseline justify-between text-black/60'>
            <span>{view === 'ext' ? 'Volumes' : `Espaços do piso ${view}`}</span>
            <span className='normal-case tabular-nums'>
              {view === 'ext' ? 'Área de implantação' : `≈ ${total} m²`}
            </span>
          </div>
          <ul className='flex gap-1.5 overflow-x-auto pb-0.5 md:flex-col md:overflow-visible'>
            {rooms.map((r) => (
              <li key={r.id} className='shrink-0'>
                <button
                  type='button'
                  aria-current={active === r.id}
                  onClick={() => selectRoom(r.id)}
                  className={cn(
                    'card-sm flex w-full items-center gap-2.5 border px-3 py-2 text-left text-sm font-medium transition-colors',
                    active === r.id
                      ? 'border-green bg-green/10'
                      : 'border-bege-dark hover:border-green bg-white'
                  )}
                >
                  <span
                    aria-hidden='true'
                    className='size-2.5 shrink-0 rounded-xs'
                    style={{ background: r.color }}
                  />
                  <span className='flex-1'>{r.name}</span>
                  <span className='hidden text-xs text-black/60 tabular-nums md:inline'>
                    ≈ {r.area} m²
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p aria-live='polite' className='text-sm text-black/60'>
            {activeRoom
              ? `${activeRoom.name}${activeRoom.floor === 'ext' ? '' : ` · ≈ ${activeRoom.area} m²`}. ${activeRoom.desc}`
              : DEFAULT_HINT[view]}
          </p>
        </div>

        <div className='border-bege-dark flex flex-col gap-2.5 border-t pt-3'>
          <div className='flex flex-wrap gap-1.5'>
            <Toggle
              label='Mobiliário'
              pressed={furniture}
              onChange={(on) => {
                setFurniture(on);
                sceneRef.current?.setFurniture(on);
              }}
            />
            <Toggle
              label='Nomes'
              pressed={labels}
              onChange={(on) => {
                setLabels(on);
                sceneRef.current?.setLabels(on);
              }}
            />
            <Toggle
              label='Vizinhança'
              pressed={context}
              onChange={(on) => {
                setContext(on);
                sceneRef.current?.setContext(on);
              }}
            />
          </div>
          <label className='grid grid-cols-[auto_1fr_auto] items-center gap-2.5 text-xs text-black/60'>
            <span>Sol</span>
            <input
              id='sede3d-sun'
              type='range'
              min={7}
              max={20}
              step={0.25}
              value={hour}
              onChange={(e) => {
                const h = Number(e.target.value);
                setHour(h);
                sceneRef.current?.setSun(h);
              }}
              className='accent-green w-full'
            />
            <output className='min-w-10 text-right font-semibold text-black tabular-nums'>
              {formatHour(hour)}
            </output>
          </label>
          <p className='hidden text-xs leading-relaxed text-black/60 md:block'>
            Reconstrução aproximada a partir das plantas e renders do projeto. Medidas estimadas:
            cerca de 36 × 11 m, pé-direito de 3,4 m, edifício novo cerca de 1,8 m acima do antigo
            (rua inclinada). Orientação do sol aproximada.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default Sede3D;
