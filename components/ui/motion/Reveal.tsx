import type { CSSProperties, ElementType, ReactNode } from 'react';

export type RevealFrom = 'up' | 'left' | 'right' | 'scale' | 'draw' | 'draw-x' | 'draw-y';

type RevealProps = {
  children?: ReactNode;
  /** Delay in ms before the element animates in — use to stagger siblings. */
  delay?: number;
  /**
   * `up` slides in from below, `left`/`right` from the side, `scale` grows in,
   * `draw` grows a rule from zero along its axis (vertical, horizontal from `lg`);
   * `draw-x` / `draw-y` keep one axis at every breakpoint.
   */
  from?: RevealFrom;
  /**
   * Reveal the direct children one after another instead of the element itself.
   * Put it on a grid or list so its cards cascade in.
   */
  stagger?: boolean;
  as?: ElementType;
  className?: string;
  id?: string;
};

/**
 * Animates its content in when it scrolls into view. A server component: it only
 * sets `data-reveal` attributes, which `MotionObserver` (mounted once per layout)
 * watches. Without that observer (Storybook, no JS) nothing is hidden. On an existing element
 * you can set the attributes directly instead: `data-reveal='up'` or `data-reveal-stagger='scale'`.
 * See `app/globals.css` → "Scroll reveal".
 */
export const Reveal = ({
  children,
  delay,
  from = 'up',
  stagger,
  as: Tag = 'div',
  className,
  id,
}: RevealProps) => (
  <Tag
    id={id}
    {...(stagger ? { 'data-reveal-stagger': from } : { 'data-reveal': from })}
    style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    className={className}
  >
    {children}
  </Tag>
);
