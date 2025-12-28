'use client';

import React, { useState, useEffect, useRef } from 'react';

import type { ImpactBlock as ImpactBlockProps } from '@/payload-types'; // Animated counter hook
import { cn } from '@/lib/utils';
import { getIcon } from '@/lib/icon';

const useAnimatedCounter = (
  targetValue: number,
  duration: number = 2000,
  startAnimation: boolean = false
) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);

      setCurrentValue(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [targetValue, duration, startAnimation]);

  return currentValue;
};

// Individual metric component
const MetricCard: React.FC<{
  metric: {
    label: string;
    value: number;
    suffix?: string | null | undefined;
    prefix?: string | null | undefined;
    icon?: string | null | undefined;
    color?: 'blue' | 'gray' | 'green' | 'purple' | 'red' | 'yellow' | null | undefined;
    animateOnScroll?: boolean | null | undefined;
    id?: string | null | undefined;
  };
  inView: boolean;
}> = ({ metric, inView }) => {
  const animatedValue = useAnimatedCounter(
    metric.value,
    2000,
    (inView && metric.animateOnScroll) || false
  );
  const displayValue = metric.animateOnScroll ? animatedValue : metric.value;

  const colorClasses = {
    blue: 'text-green bg-bege-light border-bege-dark',
    green: 'text-green bg-bege-light border-green',
    red: 'text-black bg-bege-dark border-black',
    yellow: 'text-black bg-bege-dark border-bege-dark',
    purple: 'text-green bg-bege-light border-green',
    gray: 'text-gray-600 bg-gray-50 border-gray-200',
  } as const;

  type ColorClass = keyof typeof colorClasses;

  const IconComponent = getIcon(metric.icon);

  return (
    <div className='card-md card-hover-lg p-6 text-center transition-shadow duration-300'>
      {IconComponent && (
        <div
          className={cn(
            'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2',
            colorClasses[(metric.color as ColorClass) || 'blue']
          )}
        >
          {IconComponent}
        </div>
      )}

      <div className='mb-2 text-3xl font-bold text-gray-900 lg:text-4xl'>
        {metric.prefix}
        {displayValue.toLocaleString()}
        {metric.suffix}
      </div>

      <div className='font-medium text-gray-600'>{metric.label}</div>
    </div>
  );
};

export const ImpactBlock: React.FC<ImpactBlockProps> = ({
  title,
  subtitle,
  metrics = [],
  layout = 'grid-3',
  background = 'none',
  textAlign = 'center',
}) => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const backgroundClasses = {
    none: '',
    'light-gray': 'bg-bege-light',
    dark: 'bg-black text-white',
    gradient: 'bg-gradient-to-br from-green to-bege-dark text-white',
  };

  const layoutClasses = {
    'grid-2': 'grid-cols-1 md:grid-cols-2',
    'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    'grid-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    row: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className={cn('py-12 lg:py-20', background && backgroundClasses[background])}
    >
      <div className='mx-auto max-w-7xl px-4'>
        {/* Header */}
        <div className={cn('mb-12', textAlign && textAlignClasses[textAlign])}>
          <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
          {subtitle && (
            <p
              className={cn(
                'text-lg lg:text-xl',
                background === 'dark' || background === 'gradient'
                  ? 'text-gray-300'
                  : 'text-gray-600'
              )}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Metrics Grid */}
        <div className={cn('grid gap-6 lg:gap-8', layout && layoutClasses[layout])}>
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};
