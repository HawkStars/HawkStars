'use client';

import { useEffect } from 'react';

const SELECTOR = '[data-reveal], [data-reveal-stagger]';
const READY_CLASS = 'motion-ready';
/** Give up waiting for hydration after this long and mark the element anyway. */
const HYDRATION_WAIT_MS = 10_000;
const RETRY_MS = 120;

/** Resolves once the document has loaded and the main thread is idle — i.e. after hydration. */
const afterHydration = (callback: () => void) => {
  let cancelled = false;
  const run = () => {
    if (cancelled) return;
    if ('requestIdleCallback' in window) window.requestIdleCallback(callback, { timeout: 1500 });
    else setTimeout(callback, 200);
  };
  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener('load', run);
  };
};

/**
 * Whether React has hydrated this server-rendered node. React attaches its fiber to a
 * DOM node (under a `__reactFiber$<random>` key) when it hydrates it; a node streamed in
 * by a still-pending `<Suspense>` boundary has no such key yet. Relies on a React
 * internal, so a node is treated as hydrated once HYDRATION_WAIT_MS has passed anyway.
 */
const isHydrated = (el: Element) => Object.keys(el).some((key) => key.startsWith('__reactFiber$'));

/**
 * Drives every `data-reveal` / `data-reveal-stagger` element on the page:
 * marks it `data-revealed` the first time it scrolls into view.
 *
 * Mount it once per root layout. It starts only after the page has loaded and gone
 * idle, and it never writes to an element React has not hydrated yet: content inside a
 * `<Suspense>` boundary (most data-driven pages) streams in and hydrates *after* the
 * layout, and an attribute added before that makes React report a hydration mismatch
 * on every revealed block. Such elements wait in a queue until React reaches them.
 *
 * Anything already on screen when it starts is marked `data-revealed='instant'` (shown
 * without animating, so nothing flickers) and `motion-ready` goes on `<html>`, which is
 * what lets the CSS hide elements still below the fold. A MutationObserver picks up
 * content rendered later (client navigation, lazy blocks), which animates in normally.
 */
export const MotionObserver = () => {
  useEffect(() => {
    const root = document.documentElement;
    let intersection: IntersectionObserver | undefined;
    let mutations: MutationObserver | undefined;
    let retryTimer: number | undefined;
    const startedAt = performance.now();
    /** Elements waiting for hydration, with the `data-revealed` value they should get. */
    const pending = new Map<Element, string>();

    const flushPending = () => {
      retryTimer = undefined;
      const timedOut = performance.now() - startedAt > HYDRATION_WAIT_MS;
      pending.forEach((value, el) => {
        if (!el.isConnected) pending.delete(el);
        else if (timedOut || isHydrated(el)) {
          el.setAttribute('data-revealed', value);
          pending.delete(el);
        }
      });
      if (pending.size > 0) retryTimer = window.setTimeout(flushPending, RETRY_MS);
    };

    /** Set `data-revealed` now if React owns the node, otherwise once it does. */
    const reveal = (el: Element, value: '' | 'instant') => {
      if (isHydrated(el)) {
        el.setAttribute('data-revealed', value);
        return;
      }
      pending.set(el, value);
      if (retryTimer === undefined) retryTimer = window.setTimeout(flushPending, RETRY_MS);
    };

    const cancel = afterHydration(() => {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            reveal(entry.target, '');
            io.unobserve(entry.target);
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      intersection = io;

      const track = (el: Element) => {
        if (!el.hasAttribute('data-revealed') && !pending.has(el)) io.observe(el);
      };
      const scan = (node: ParentNode) => {
        if (node instanceof Element && node.matches(SELECTOR)) track(node);
        node.querySelectorAll(SELECTOR).forEach(track);
      };

      // Already visible when motion switches on: show as-is rather than hide-then-animate.
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) reveal(el, 'instant');
      });
      scan(document);
      root.classList.add(READY_CLASS);

      mutations = new MutationObserver((records) => {
        for (const record of records) {
          record.addedNodes.forEach((node) => {
            if (node instanceof Element) scan(node);
          });
        }
      });
      mutations.observe(document.body, { childList: true, subtree: true });
    });

    return () => {
      cancel();
      window.clearTimeout(retryTimer);
      pending.clear();
      mutations?.disconnect();
      intersection?.disconnect();
      root.classList.remove(READY_CLASS);
    };
  }, []);

  return null;
};
