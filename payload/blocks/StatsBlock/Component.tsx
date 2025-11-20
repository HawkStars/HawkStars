'use client';

import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import {
  Users,
  Heart,
  Target,
  TrendingUp,
  Award,
  Globe,
  Star,
  CheckCircle,
  DollarSign,
  Calendar,
  MapPin,
  Zap,
  Building,
  ThumbsUp,
  type LucideIcon,
} from 'lucide-react';
import type { StatsBlock as StatsBlockProps } from '@/payload-types';

// Icon mapping for statistics
const iconMap: Record<string, LucideIcon> = {
  Users,
  Heart,
  Target,
  TrendingUp,
  Award,
  Globe,
  Star,
  CheckCircle,
  DollarSign,
  Calendar,
  MapPin,
  Zap,
  Building,
  ThumbsUp,
};

type Stat = {
  value: number;
  label: string;
  prefix?: string | null | undefined;
  suffix?: string | null | undefined;
  description?: string | null | undefined;
  icon?: string | null | undefined;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'gray' | null | undefined;
  highlight?: boolean | null | undefined;
  id?: string | null | undefined;
};

// Animated counter hook
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

// Individual stat component
const StatItem: React.FC<{
  stat: Stat;
  inView: boolean;
  style: string | null;
  isDark: boolean;
}> = ({ stat, inView, style, isDark }) => {
  const animatedValue = useAnimatedCounter(stat.value, 2000, inView);
  const displayValue = animatedValue;

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    green: 'text-green-600 bg-green-50 border-green-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200',
    orange: 'text-orange-600 bg-orange-50 border-orange-200',
    gray: 'text-gray-600 bg-gray-50 border-gray-200',
  } as const;

  const darkColorClasses = {
    blue: 'text-blue-400 bg-blue-900/20 border-blue-500/30',
    green: 'text-green-400 bg-green-900/20 border-green-500/30',
    red: 'text-red-400 bg-red-900/20 border-red-500/30',
    yellow: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30',
    purple: 'text-purple-400 bg-purple-900/20 border-purple-500/30',
    orange: 'text-orange-400 bg-orange-900/20 border-orange-500/30',
    gray: 'text-gray-400 bg-gray-900/20 border-gray-500/30',
  } as const;

  type ColorClass = keyof typeof colorClasses;

  const currentColorClasses = isDark ? darkColorClasses : colorClasses;
  const IconComponent = stat.icon ? iconMap[stat.icon] : null;

  const styleClasses = {
    cards: `bg-white rounded-lg shadow-md border p-6 text-center hover:shadow-lg transition-shadow ${isDark ? 'bg-gray-800 border-gray-600' : 'border-gray-200'}`,
    minimal: 'text-center p-4',
    bordered: `border-2 rounded-lg p-6 text-center ${isDark ? 'border-gray-600' : 'border-gray-200'}`,
    circles: 'text-center p-6 relative',
  };

  return (
    <div
      className={classNames(
        styleClasses[style as keyof typeof styleClasses],
        stat.highlight && 'ring-opacity-50 scale-105 ring-2 ring-blue-500'
      )}
    >
      {/* Background circle for circles style */}
      {style === 'circles' && (
        <div
          className={classNames(
            'absolute inset-0 rounded-full opacity-10',
            currentColorClasses[(stat.color as ColorClass) || 'blue'].split(' ')[1] // Get background color
          )}
        />
      )}

      {/* Icon */}
      {IconComponent && (
        <div
          className={classNames(
            'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2',
            currentColorClasses[(stat.color as ColorClass) || 'blue']
          )}
        >
          <IconComponent className='h-6 w-6' />
        </div>
      )}

      {/* Value */}
      <div
        className={classNames(
          'mb-2 text-3xl font-bold lg:text-4xl',
          isDark ? 'text-white' : 'text-gray-900',
          stat.highlight && 'text-4xl lg:text-5xl'
        )}
      >
        {stat.prefix}
        {displayValue.toLocaleString()}
        {stat.suffix}
      </div>

      {/* Label */}
      <div
        className={classNames(
          'mb-2 font-semibold',
          isDark ? 'text-gray-200' : 'text-gray-800',
          stat.highlight && 'text-lg'
        )}
      >
        {stat.label}
      </div>

      {/* Description */}
      {stat.description && (
        <div className={classNames('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
          {stat.description}
        </div>
      )}
    </div>
  );
};

export const StatsBlock: React.FC<StatsBlockProps> = ({
  title,
  subtitle,
  stats = [],
  layout = 'cols-3',
  style = 'cards',
  animateNumbers = true,
  backgroundColor = 'none',
  textAlign = 'center',
}) => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer for scroll animations
  useEffect(() => {
    if (!animateNumbers) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [animateNumbers]);

  const backgroundClasses = {
    none: '',
    'light-gray': 'bg-gray-50',
    dark: 'bg-gray-900',
    gradient: 'bg-gradient-to-br from-blue-500 to-purple-600',
  };

  const layoutClasses = {
    'cols-2': 'grid-cols-1 md:grid-cols-2',
    'cols-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    'cols-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    row: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const isDark = backgroundColor === 'dark' || backgroundColor === 'gradient';

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className={classNames(
        'py-12 lg:py-20',
        backgroundColor && backgroundClasses[backgroundColor]
      )}
    >
      <div className='mx-auto max-w-7xl px-4'>
        {/* Header */}
        {(title || subtitle) && (
          <div className={classNames('mb-12', textAlign && textAlignClasses[textAlign])}>
            {title && (
              <h2
                className={classNames(
                  'mb-4 text-3xl font-bold lg:text-4xl',
                  isDark ? 'text-white' : 'text-gray-900'
                )}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={classNames(
                  'text-lg lg:text-xl',
                  isDark ? 'text-gray-300' : 'text-gray-600'
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className={classNames('grid gap-6 lg:gap-8', layout && layoutClasses[layout])}>
          {stats.map((stat, index) => (
            <StatItem key={index} stat={stat} inView={inView} style={style} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
};
