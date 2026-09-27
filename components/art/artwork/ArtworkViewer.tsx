'use client';

import { PointerEvent, useCallback, useEffect, useRef, useState } from 'react';
import { LuMaximize2, LuMinimize2, LuZoomIn, LuZoomOut, LuRotateCcw } from 'react-icons/lu';
import { Media } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { cn } from '@/lib/utils';

export type ViewerView = { id: string; label: string; image: Media };

type ArtworkViewerProps = {
  title: string;
  dimensions?: string | null;
  views: ViewerView[];
  labels: {
    zoomIn: string;
    zoomOut: string;
    reset: string;
    open: string;
    close: string;
    views: string;
    protected: string;
  };
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

/**
 * The "blackbox" artwork viewer: a spotlit stage with zoom + pan, extra views
 * of the piece in different settings, and an immersive full-screen mode.
 *
 * Copy protection is a deterrent only — no website can truly block screenshots.
 * We block the context menu, dragging and selection, hide the image while the
 * window is not focused or when Print Screen is pressed, and never render it
 * when printing.
 */
export default function ArtworkViewer({ title, dimensions, views, labels }: ArtworkViewerProps) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [immersive, setImmersive] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const reset = useCallback(() => {
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
  }, []);

  const changeZoom = (delta: number) =>
    setZoom((current) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current + delta));
      if (next === MIN_ZOOM) setOffset({ x: 0, y: 0 });
      return next;
    });

  // Hide while the tab/window isn't focused (common while screen-capture tools run).
  useEffect(() => {
    const hide = () => setHidden(true);
    const show = () => setHidden(false);
    const onVisibility = () => setHidden(document.visibilityState !== 'visible');
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'PrintScreen') return;
      setHidden(true);
      navigator.clipboard?.writeText('').catch(() => undefined);
      window.setTimeout(() => setHidden(false), 1500);
    };
    window.addEventListener('blur', hide);
    window.addEventListener('focus', show);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('keyup', onKey);
    return () => {
      window.removeEventListener('blur', hide);
      window.removeEventListener('focus', show);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('keyup', onKey);
    };
  }, []);

  useEffect(() => {
    if (!immersive) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setImmersive(false);
      if (event.key === '+' || event.key === '=') changeZoom(ZOOM_STEP);
      if (event.key === '-') changeZoom(-ZOOM_STEP);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [immersive]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (zoom === MIN_ZOOM) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
    setDragging(true);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setOffset({
      x: drag.current.ox + (event.clientX - drag.current.x) / zoom,
      y: drag.current.oy + (event.clientY - drag.current.y) / zoom,
    });
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  if (views.length === 0) return null;
  const view = views[active];

  const stage = (
    <div
      className={cn(
        'art-spotlight relative flex items-center justify-center overflow-hidden select-none print:hidden',
        immersive
          ? 'h-full w-full'
          : 'border-art-line bg-art-ebony aspect-4/3 border md:aspect-16/10'
      )}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <div
        className={cn(
          'relative h-[78%] w-[78%] touch-none',
          zoom > MIN_ZOOM ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
        )}
        style={{
          transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
          transition: dragging ? 'none' : 'transform 300ms ease',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => (zoom > MIN_ZOOM ? reset() : changeZoom(1))}
      >
        <ImageMedia
          key={view.id}
          resource={view.image}
          alt={`${title} — ${view.label}`}
          fill
          draggable={false}
          sizes={immersive ? '100vw' : '(max-width: 1024px) 100vw, 1024px'}
          quality={90}
          className={cn(
            'pointer-events-none object-contain drop-shadow-2xl transition-[filter] duration-300',
            hidden && 'blur-2xl'
          )}
        />
        {/* Transparent shield so "Save image as…" targets nothing useful. */}
        <span aria-hidden className='absolute inset-0' />
      </div>

      <p className='text-art-cream/30 pointer-events-none absolute right-4 bottom-3 text-[10px] tracking-widest uppercase'>
        {labels.protected}
      </p>
      {dimensions && (
        <p className='text-art-muted pointer-events-none absolute top-3 right-4 flex items-center gap-2 text-[10px] tracking-widest uppercase'>
          <span className='bg-art-gold h-1.5 w-1.5 rounded-full' />
          {dimensions}
        </p>
      )}

      <div className='border-art-line bg-art-ebony/80 absolute bottom-3 left-3 flex items-center gap-1 border p-1 backdrop-blur'>
        <ViewerButton
          label={labels.zoomIn}
          onClick={() => changeZoom(ZOOM_STEP)}
          disabled={zoom >= MAX_ZOOM}
        >
          <LuZoomIn />
        </ViewerButton>
        <ViewerButton
          label={labels.zoomOut}
          onClick={() => changeZoom(-ZOOM_STEP)}
          disabled={zoom <= MIN_ZOOM}
        >
          <LuZoomOut />
        </ViewerButton>
        <span className='text-art-text-2 w-12 text-center text-xs tabular-nums'>
          {Math.round(zoom * 100)}%
        </span>
        <ViewerButton label={labels.reset} onClick={reset} disabled={zoom === MIN_ZOOM}>
          <LuRotateCcw />
        </ViewerButton>
        <span aria-hidden className='bg-art-line mx-1 h-5 w-px' />
        {immersive ? (
          <ViewerButton ref={closeRef} label={labels.close} onClick={() => setImmersive(false)}>
            <LuMinimize2 />
          </ViewerButton>
        ) : (
          <ViewerButton label={labels.open} onClick={() => setImmersive(true)}>
            <LuMaximize2 />
          </ViewerButton>
        )}
      </div>
    </div>
  );

  const thumbnails = views.length > 1 && (
    <div role='group' aria-label={labels.views} className='mt-4 flex gap-3 overflow-x-auto pb-1'>
      {views.map((item, index) => (
        <button
          key={item.id}
          type='button'
          aria-pressed={index === active}
          onClick={() => {
            setActive(index);
            reset();
          }}
          onContextMenu={(event) => event.preventDefault()}
          className={cn(
            'group relative h-16 w-24 shrink-0 overflow-hidden border transition-colors',
            index === active ? 'border-art-gold-bright' : 'border-art-line hover:border-art-gold/60'
          )}
        >
          <ImageMedia
            resource={item.image}
            alt=''
            fill
            draggable={false}
            sizes='96px'
            className='pointer-events-none object-cover'
          />
          <span className='bg-art-ebony/80 text-art-cream absolute inset-x-0 bottom-0 truncate px-1 text-[9px] tracking-wider uppercase'>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );

  if (immersive) {
    return (
      <div
        role='dialog'
        aria-modal='true'
        aria-label={title}
        className='bg-art-ebony fixed inset-0 z-50 flex flex-col p-4'
      >
        <div className='min-h-0 flex-1'>{stage}</div>
        {thumbnails}
      </div>
    );
  }

  return (
    <div>
      {stage}
      {thumbnails}
    </div>
  );
}

type ViewerButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
};

function ViewerButton({ label, onClick, disabled, children, ref }: ViewerButtonProps) {
  return (
    <button
      ref={ref}
      type='button'
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className='text-art-text-2 hover:text-art-gold-bright flex h-9 w-9 items-center justify-center transition-colors disabled:opacity-30'
    >
      {children}
    </button>
  );
}
