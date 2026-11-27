'use client';

import { LuChevronDown } from 'react-icons/lu';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRoomyScreen } from './useRoomyScreen';
import type { BlenderView, SedeBlenderScene } from './blenderScene';

const MODEL_URL = '/models/sede-blender.glb';

const VIEWS: { id: BlenderView; label: string }[] = [
  { id: 'ext', label: 'Exterior' },
  { id: '0', label: 'Piso 0' },
  { id: '1', label: 'Piso 1' },
  { id: '2', label: 'Piso 2' },
];

type ToggleProps = { label: string; pressed: boolean; onChange: (on: boolean) => void };

const Toggle = ({ label, pressed, onChange }: ToggleProps) => (
  <button
    type='button'
    aria-pressed={pressed}
    onClick={() => onChange(!pressed)}
    className={cn(
      'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
      pressed ? 'border-green bg-green/10 text-green' : 'border-bege-dark bg-white text-black/60'
    )}
  >
    {label}
  </button>
);

/**
 * The headquarters model built in Blender (building, furniture and the surrounding streets from
 * the topographic survey), loaded as a GLB. A test page next to the hand-written `Sede3D`.
 */
const SedeBlender = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SedeBlenderScene | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [progress, setProgress] = useState(0);
  const [view, setView] = useState<BlenderView>('ext');
  const [furniture, setFurniture] = useState(true);
  const [context, setContext] = useState(true);
  // the panel folds down to its title; it starts open only on a big screen
  const roomy = useRoomyScreen();
  // null until the visitor opens or folds it themselves
  const [menuChoice, setMenuChoice] = useState<boolean | null>(null);
  const menuOpen = menuChoice ?? roomy;

  useEffect(() => {
    let disposed = false;
    let scene: SedeBlenderScene | null = null;
    import('./blenderScene').then(({ createSedeBlenderScene }) => {
      const container = containerRef.current;
      if (disposed || !container) return;
      scene = createSedeBlenderScene({
        container,
        url: MODEL_URL,
        onProgress: setProgress,
        onLoad: () => setStatus('ready'),
        onError: () => setStatus('error'),
      });
      sceneRef.current = scene;
    });
    return () => {
      disposed = true;
      scene?.dispose();
      sceneRef.current = null;
    };
  }, []);

  return (
    <div className='bg-bege-light relative h-[calc(100svh-5rem)] min-h-72 w-full overflow-hidden'>
      <div
        ref={containerRef}
        className='absolute inset-0'
        aria-label='Modelo 3D da sede feito em Blender'
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

      <div className='pointer-events-none absolute inset-0 z-10 mx-auto flex w-full max-w-6xl flex-col justify-end px-4 py-4 sm:px-6 md:justify-start md:py-8 lg:px-8'>
        <aside
          aria-label='Controlos do modelo'
          className={cn(
            'card border-bege-dark bg-bege-light/95 pointer-events-auto flex w-full flex-col gap-4 border p-4 shadow-md backdrop-blur md:w-80 md:p-6',
            !menuOpen && 'py-2 md:py-3'
          )}
        >
          <div>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-eyebrow text-green'>Modelo Blender · teste</p>
                <h1 className='text-h2_bold mt-1 max-md:text-xl'>Sede HawkStars</h1>
              </div>
              <button
                type='button'
                aria-expanded={menuOpen}
                aria-controls='blender-menu'
                aria-label={menuOpen ? 'Esconder controlos' : 'Mostrar controlos'}
                onClick={() => setMenuChoice(!menuOpen)}
                className='border-bege-dark grid size-9 place-items-center rounded-full border bg-white'
              >
                <LuChevronDown
                  aria-hidden='true'
                  className={cn(
                    'size-4 shrink-0 transition-transform max-md:-scale-y-100',
                    menuOpen && 'rotate-180'
                  )}
                />
              </button>
            </div>
            <p className={cn('mt-2 text-sm text-black/60', !menuOpen && 'hidden')}>
              Edifício, mobiliário e envolvente, assentes no levantamento topográfico da Travessa do
              Portão Norte.
            </p>
          </div>

          <div id='blender-menu' className={cn('flex flex-col gap-4', !menuOpen && 'hidden')}>
            <div
              role='group'
              aria-label='Piso'
              className='border-bege-dark grid grid-cols-4 gap-1 rounded-lg border bg-white p-1'
            >
              {VIEWS.map((v) => (
                <Button
                  key={v.id}
                  size='sm'
                  variant={view === v.id ? 'default' : 'ghost'}
                  aria-pressed={view === v.id}
                  disabled={status !== 'ready'}
                  onClick={() => {
                    setView(v.id);
                    sceneRef.current?.setView(v.id);
                  }}
                >
                  {v.label}
                </Button>
              ))}
            </div>

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
                label='Envolvente'
                pressed={context}
                onChange={(on) => {
                  setContext(on);
                  sceneRef.current?.setContext(on);
                }}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SedeBlender;
