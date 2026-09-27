'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  FormEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { LuChevronLeft, LuChevronRight, LuSearch, LuSlidersHorizontal } from 'react-icons/lu';
import { cn } from '@/lib/utils';

type FilterOption = { value: string; label: string };

type CatalogFiltersProps = {
  /** Query parameter the free-text search writes to. */
  searchParam: string;
  searchLabel: string;
  searchPlaceholder: string;
  submitLabel?: string;
  categories: FilterOption[];
  categoriesLabel: string;
  /** Label of the "all" chip; omit to not show one (an active chip clicked again clears the filter). */
  allLabel?: string;
  summary?: string;
  previousLabel: string;
  nextLabel: string;
};

const SEARCH_DEBOUNCE_MS = 400;

/**
 * Search box + category chips that drive the page through the URL
 * (`?category=…&<searchParam>=…`), so filtered views are shareable and
 * rendered on the server.
 */
export default function CatalogFilters({
  searchParam,
  searchLabel,
  searchPlaceholder,
  submitLabel,
  categories,
  categoriesLabel,
  allLabel,
  summary,
  previousLabel,
  nextLabel,
}: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentSearch = searchParams.get(searchParam) ?? '';
  const currentCategory = searchParams.get('category') ?? '';
  const [query, setQuery] = useState(currentSearch);

  const hrefWith = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const applySearch = (value: string) =>
    startTransition(() =>
      router.replace(hrefWith({ [searchParam]: value.trim() }), { scroll: false })
    );

  useEffect(() => {
    if (query.trim() === currentSearch) return;
    const id = window.setTimeout(() => applySearch(query), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
    // Only the typed text should re-arm the debounce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    applySearch(query);
  };

  const chipClass = (active: boolean) =>
    cn(
      'block shrink-0 border px-4 py-2 text-xs tracking-wider whitespace-nowrap transition-colors',
      active
        ? 'border-art-gold-bright bg-art-gold-bright/10 text-art-gold-bright'
        : 'border-art-line text-art-text-2 hover:border-art-gold/60 hover:text-art-text'
    );

  return (
    <div className={cn('art-panel p-4 transition-opacity md:p-6', isPending && 'opacity-70')}>
      <form role='search' onSubmit={onSubmit} className='mx-auto flex max-w-3xl gap-2'>
        <label className='border-art-line bg-art-ebony focus-within:border-art-gold-bright flex flex-1 items-center gap-3 border px-4'>
          <LuSearch aria-hidden className='text-art-gold shrink-0' />
          <span className='sr-only'>{searchLabel}</span>
          <input
            type='search'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className='text-art-text placeholder:text-art-muted w-full bg-transparent py-3 text-sm outline-none'
          />
        </label>
        {submitLabel && (
          <button
            type='submit'
            className='border-art-line text-art-gold-bright hover:border-art-gold-bright border px-4 text-xs tracking-[0.15em] uppercase'
          >
            {submitLabel}
          </button>
        )}
      </form>

      <div className='border-art-line mt-5 flex items-center justify-between gap-4 border-t pt-4'>
        <p className='art-eyebrow text-art-text-2 flex items-center gap-2 text-[10px]'>
          <LuSlidersHorizontal aria-hidden />
          {categoriesLabel}
        </p>
        {summary && <p className='text-art-muted text-xs'>{summary}</p>}
      </div>
      <ScrollableChips label={categoriesLabel} previousLabel={previousLabel} nextLabel={nextLabel}>
        {allLabel && (
          <li>
            <Link
              href={hrefWith({ category: '' })}
              scroll={false}
              aria-current={!currentCategory ? 'page' : undefined}
              className={chipClass(!currentCategory)}
            >
              {allLabel}
            </Link>
          </li>
        )}
        {categories.map((category) => {
          const active = currentCategory === category.value;
          return (
            <li key={category.value}>
              <Link
                // Clicking the active category again clears the filter.
                href={hrefWith({ category: active ? '' : category.value })}
                scroll={false}
                aria-current={active ? 'page' : undefined}
                className={chipClass(active)}
              >
                {category.label}
              </Link>
            </li>
          );
        })}
      </ScrollableChips>
    </div>
  );
}

const DRAG_THRESHOLD_PX = 5;

/**
 * Horizontal chip bar: scrolls by touch/trackpad, by dragging with the mouse,
 * and with arrow buttons that appear only when some chips are off-screen.
 */
function ScrollableChips({
  label,
  previousLabel,
  nextLabel,
  children,
}: {
  label: string;
  previousLabel: string;
  nextLabel: string;
  children: ReactNode;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; scrollLeft: number; moved: boolean } | null>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  const updateEdges = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    setEdges({
      start: list.scrollLeft > 4,
      end: list.scrollLeft + list.clientWidth < list.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [updateEdges]);

  const scrollByPage = (direction: 1 | -1) => {
    const list = listRef.current;
    list?.scrollBy({ left: direction * list.clientWidth * 0.7, behavior: 'smooth' });
  };

  const onPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== 'mouse' || !listRef.current) return;
    drag.current = { x: event.clientX, scrollLeft: listRef.current.scrollLeft, moved: false };
  };
  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    const list = listRef.current;
    if (!drag.current || !list) return;
    const delta = event.clientX - drag.current.x;
    if (Math.abs(delta) > DRAG_THRESHOLD_PX) drag.current.moved = true;
    if (drag.current.moved) list.scrollLeft = drag.current.scrollLeft - delta;
  };
  const endDrag = () => {
    // Keep `moved` until the click that ends the drag has been swallowed.
    window.setTimeout(() => (drag.current = null), 0);
  };
  // A drag must not also follow the chip link it started on.
  const onClickCapture = (event: MouseEvent<HTMLUListElement>) => {
    if (drag.current?.moved) event.preventDefault();
  };

  const arrowClass =
    'border-art-line bg-art-ebony text-art-text hover:border-art-gold-bright hover:text-art-gold-bright flex h-9 w-9 shrink-0 items-center justify-center border transition-colors';

  return (
    <nav aria-label={label} className='mt-3 flex items-center gap-2'>
      {edges.start && (
        <button
          type='button'
          aria-label={previousLabel}
          className={arrowClass}
          onClick={() => scrollByPage(-1)}
        >
          <LuChevronLeft />
        </button>
      )}
      <ul
        ref={listRef}
        onScroll={updateEdges}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className='flex flex-1 cursor-grab [scrollbar-width:none] gap-2 overflow-x-auto scroll-smooth select-none active:cursor-grabbing [&::-webkit-scrollbar]:hidden'
      >
        {children}
      </ul>
      {edges.end && (
        <button
          type='button'
          aria-label={nextLabel}
          className={arrowClass}
          onClick={() => scrollByPage(1)}
        >
          <LuChevronRight />
        </button>
      )}
    </nav>
  );
}
