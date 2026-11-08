'use client';

import { useEffect } from 'react';

const SELECTOR = '[data-reveal], [data-reveal-stagger]';
const READY_CLASS = 'motion-ready';

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
 * Drives every `data-reveal` / `data-reveal-stagger` element on the page:
 * marks it `data-revealed` the first time it scrolls into view.
 *
 * Mount it once per root layout. It starts only after the page has loaded and
 * hydrated — touching server-rendered DOM earlier makes React report hydration
 * mismatches. At that point anything already on screen is marked
 * `data-revealed='instant'` (shown without animating, so nothing flickers) and
 * `motion-ready` goes on `<html>`, which is what lets the CSS hide elements
 * still below the fold. A MutationObserver picks up content rendered later
 * (client navigation, lazy blocks), which animates in normally.
 */
export const MotionObserver = () => {
  useEffect(() => {
    const root = document.documentElement;
    let intersection: IntersectionObserver | undefined;
    let mutations: MutationObserver | undefined;

    const cancel = afterHydration(() => {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.setAttribute('data-revealed', '');
            io.unobserve(entry.target);
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      intersection = io;

      const track = (el: Element) => {
        if (!el.hasAttribute('data-revealed')) io.observe(el);
      };
      const scan = (node: ParentNode) => {
        if (node instanceof Element && node.matches(SELECTOR)) track(node);
        node.querySelectorAll(SELECTOR).forEach(track);
      };

      // Already visible when motion switches on: show as-is rather than hide-then-animate.
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.setAttribute('data-revealed', 'instant');
        }
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
      mutations?.disconnect();
      intersection?.disconnect();
      root.classList.remove(READY_CLASS);
    };
  }, []);

  return null;
};
