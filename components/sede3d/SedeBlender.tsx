'use client';

import { FiChevronDown, FiMaximize } from 'react-icons/fi';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRoomyScreen } from './useRoomyScreen';
import type { SedeBlenderScene } from './blenderScene';

import { FLOORS, ROOMS, type FloorView } from './data';

const MODEL_URL = '/models/sede-blender.glb';
const DECODER_PATH = '/models/draco/';

const DEFAULT_HINT: Record<FloorView, string> = {
  ext: 'A travessa sobe ao longo do edifício: a entrada do átrio fica ao nível do piso 1 do edifício antigo e o edifício novo assenta cerca de 2,2 m acima. Escolhe um piso para cortar as paredes e ver o interior.',
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
      'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
      pressed ? 'border-green bg-green/10 text-green' : 'border-bege-dark bg-white text-black/60'
    )}
  >
    {label}
  </button>
);

/**
 * Interactive 3D model of the HawkStars headquarters, built in Blender (building, furniture and the
 * surrounding streets from the topographic survey) and loaded as a Draco-compressed GLB.
 *
 * Layout: a side panel on desktop; on phones a compact bottom sheet (floors, rooms, the selected
 * room) that expands for the layers and the sun. The scene is told how much of the screen the panel
 * covers and frames the building in the rest. three.js is imported lazily inside the effect, so it
 * never runs on the server and stays out of every other page's bundle.
 */
const SedeBlender = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<SedeBlenderScene | null>(null);

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [progress, setProgress] = useState(0);
  const [view, setView] = useState<FloorView>('ext');
  const [active, setActive] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [furniture, setFurniture] = useState(true);
  const [labels, setLabels] = useState(true);
  const [context, setContext] = useState(true);
  // the panel folds down to its title; it starts open only on a big screen
  const roomy = useRoomyScreen();
  // null until the visitor opens or folds it themselves
  const [menuChoice] = useState<boolean | null>(null);
  const [hour, setHour] = useState(15);

  const viewRef = useRef<FloorView>('ext');

  const selectRoom = useCallback((id: string) => {
    const room = ROOMS.find((r) => r.id === id);
    if (!room) return;
    if (viewRef.current !== room.floor) {
      viewRef.current = room.floor;
      setView(room.floor);
      sceneRef.current?.setView(room.floor);
    }
    setActive(id);
    sceneRef.current?.focusRoom(id);
  }, []);

  /** Tell the scene which part of the screen the panel covers, so the building stays visible. */
  const measurePanel = useCallback(() => {
    const panel = panelRef.current;
    const container = containerRef.current;
    if (!panel || !container || !sceneRef.current) return;
    const c = container.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    const side = window.matchMedia('(min-width: 768px)').matches;
    sceneRef.current.setInsets(
      side
        ? { left: Math.max(0, p.right - c.left), bottom: 0 }
        : { left: 0, bottom: Math.max(0, c.bottom - p.top) }
    );
  }, []);

  useEffect(() => {
    let disposed = false;
    let scene: SedeBlenderScene | null = null;
    import('./blenderScene').then(({ createSedeBlenderScene }) => {
      const container = containerRef.current;
      const labelLayer = labelsRef.current;
      if (disposed || !container || !labelLayer) return;
      scene = createSedeBlenderScene({
        container,
        labels: labelLayer,
        url: MODEL_URL,
        decoderPath: DECODER_PATH,
        onProgress: setProgress,
        onLoad: () => setStatus('ready'),
        onError: () => setStatus('error'),
        onSelectRoom: selectRoom,
      });
      sceneRef.current = scene;
      measurePanel();
    });
    return () => {
      disposed = true;
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [selectRoom, measurePanel]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const observer = new ResizeObserver(measurePanel);
    observer.observe(panel);
    window.addEventListener('resize', measurePanel);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measurePanel);
    };
  }, [measurePanel]);

  const changeView = (v: FloorView) => {
    viewRef.current = v;
    setView(v);
    setActive(null);
    sceneRef.current?.setView(v);
  };

  const rooms = ROOMS.filter((r) => r.floor === view);
  const activeRoom = ROOMS.find((r) => r.id === active);
  const total = rooms.reduce((sum, r) => sum + r.area, 0);
  const ready = status === 'ready';

  return (
    <div className='bg-bege-light relative h-[calc(100svh-5rem)] min-h-120 w-full overflow-hidden'>
      <div
        ref={containerRef}
        className='absolute inset-0'
        aria-label='Modelo 3D interativo da sede'
      />
      <div ref={labelsRef} className='pointer-events-none absolute inset-0 z-5 overflow-hidden' />

      {!ready && (
        <p
          aria-live='polite'
          className='text-body_regular absolute inset-x-0 top-1/3 text-center text-black/60'
        >
          {status === 'error'
            ? 'Não foi possível carregar o modelo.'
            : `A carregar o modelo 3D… ${Math.round(progress * 100)}%`}
        </p>
      )}

      <Button
        size='sm'
        variant='secondary'
        className='absolute top-3 right-3 z-10 shadow-sm md:top-6 md:right-6'
        disabled={!ready}
        onClick={() => {
          setActive(null);
          sceneRef.current?.resetView();
        }}
      >
        <FiMaximize aria-hidden='true' />
        Recentrar
      </Button>

      {/* Bottom sheet on phones, side panel from md up (same column as the home page hero). */}
      <div className='pointer-events-none absolute inset-x-0 bottom-0 z-10 md:inset-y-0 md:right-auto md:left-[max(0px,calc((100vw-72rem)/2))] md:px-6 md:py-6 lg:px-8 lg:py-8'>
        <aside
          ref={panelRef}
          aria-label='Controlos do modelo'
          className={cn(
            'border-bege-dark bg-bege-light/95 pointer-events-auto flex w-full flex-col gap-3 overflow-y-auto border-t px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-md backdrop-blur',
            'md:card md:max-h-full md:w-90 md:gap-5 md:border md:p-6',
            expanded ? 'max-h-[62%]' : 'max-h-[46%]'
          )}
        >
          {/* mobile: grab bar + title row that toggles the details */}
          <button
            type='button'
            aria-expanded={expanded}
            aria-controls='sede3d-details'
            onClick={() => setExpanded((e) => !e)}
            className='flex items-center justify-between gap-3 text-left md:hidden'
          >
            <span>
              <span
                aria-hidden='true'
                className='bg-bege-dark mx-auto mb-2 block h-1 w-10 rounded-full'
              />
              <span className='text-h2_bold block'>Sede HawkStars</span>
            </span>
            <span className='text-green flex shrink-0 items-center gap-1 text-xs font-semibold'>
              {expanded ? 'Menos' : 'Camadas e sol'}
              <FiChevronDown
                aria-hidden='true'
                className={cn('transition-transform', expanded && 'rotate-180')}
              />
            </span>
          </button>

          <div className='hidden md:block'>
            <p className='text-eyebrow text-green'>Associação HawkStars · Pinhel</p>
            <h1 className='text-h2_bold mt-1'>Sede HawkStars</h1>
            <p className='mt-2 text-sm text-black/60'>
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
                disabled={!ready}
                onClick={() => changeView(f.id)}
                className='px-1'
              >
                {f.label}
              </Button>
            ))}
          </div>

          <div className='flex min-w-0 flex-col gap-2'>
            <div className='text-eyebrow flex items-baseline justify-between text-black/60'>
              <span>{view === 'ext' ? 'Volumes' : `Espaços do piso ${view}`}</span>
              {view !== 'ext' && <span className='normal-case tabular-nums'>≈ {total} m²</span>}
            </div>
            <ul className='-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 md:mx-0 md:flex-col md:overflow-visible md:px-0'>
              {rooms.map((r) => (
                <li key={r.id} className='shrink-0'>
                  <button
                    type='button'
                    aria-pressed={active === r.id}
                    disabled={!ready}
                    onClick={() => selectRoom(r.id)}
                    className={cn(
                      'card-sm flex w-full items-center gap-3 border px-3 py-2 text-left text-sm font-medium transition-colors',
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
                    {r.floor !== 'ext' && (
                      <span className='hidden text-xs text-black/60 tabular-nums md:inline'>
                        ≈ {r.area} m²
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <p
              aria-live='polite'
              className={cn(
                'text-sm text-black/70',
                !expanded && 'line-clamp-2 md:line-clamp-none'
              )}
            >
              {activeRoom ? (
                <>
                  <strong className='font-semibold text-black'>
                    {activeRoom.name}
                    {activeRoom.floor !== 'ext' && ` · ≈ ${activeRoom.area} m²`}.
                  </strong>{' '}
                  {activeRoom.desc}
                </>
              ) : (
                DEFAULT_HINT[view]
              )}
            </p>
          </div>

          <div
            id='sede3d-details'
            className={cn(
              'border-bege-dark flex-col gap-3 border-t pt-3 md:flex md:pt-4',
              expanded ? 'flex' : 'hidden'
            )}
          >
            <div className='flex flex-wrap gap-2'>
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
            <label className='grid grid-cols-[auto_1fr_auto] items-center gap-3 text-xs text-black/60'>
              <span>Sol</span>
              <input
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
            <p className='text-xs leading-relaxed text-black/60'>
              Modelo feito em Blender a partir das plantas do projeto e calibrado com o levantamento
              topográfico: o conjunto tem cerca de 33 m e o edifício antigo ≈ 10,3 × 10,2 m. As
              áreas são estimadas. Os edifícios vizinhos estão simplificados e mais baixos do que na
              realidade, para não taparem a sede. Arrasta para rodar, pinça ou usa a roda para
              aproximar.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SedeBlender;
