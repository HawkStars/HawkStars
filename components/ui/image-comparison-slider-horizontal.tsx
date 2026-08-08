'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { ImageMedia } from '@/payload/components/Media';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

// Define the props for the component
interface ImageComparisonSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  leftImage: string;
  rightImage: string;
  altLeft?: string;
  altRight?: string;
  initialPosition?: number;
}

export const ImageComparisonSlider = React.forwardRef<HTMLDivElement, ImageComparisonSliderProps>(
  (
    {
      className,
      leftImage,
      rightImage,
      altLeft = 'Left image',
      altRight = 'Right image',
      initialPosition = 50,
      ...props
    },
    _ref
  ) => {
    const lng = useLanguageCookie();
    const { t } = useTranslation(lng, 'common');
    // State to manage slider position (0 to 100)
    const [sliderPosition, setSliderPosition] = React.useState(initialPosition);
    // State to track if the user is currently dragging the handle
    const [isDragging, setIsDragging] = React.useState(false);
    // Ref for the container element to calculate relative cursor position
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Function to handle slider movement based on horizontal position
    const handleMove = (clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let newPosition = (x / rect.width) * 100;

      // Clamp the position between 0 and 100
      newPosition = Math.max(0, Math.min(100, newPosition));

      setSliderPosition(newPosition);
    };

    // Handlers for starting and stopping the drag interaction
    const handleInteractionStart = (_e: React.MouseEvent | React.TouchEvent) => {
      setIsDragging(true);
    };

    // A11Y-M6: keyboard operation for the role="slider" handle. Previously the
    // handle exposed aria-valuenow/min/max but had no tabIndex and no key
    // handler, so it was announced as a slider yet could not be focused or moved.
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const STEP = 2;
      const BIG_STEP = 10;

      const nextPosition = (() => {
        switch (event.key) {
          case 'ArrowLeft':
          case 'ArrowDown':
            return sliderPosition - STEP;
          case 'ArrowRight':
          case 'ArrowUp':
            return sliderPosition + STEP;
          case 'PageDown':
            return sliderPosition - BIG_STEP;
          case 'PageUp':
            return sliderPosition + BIG_STEP;
          case 'Home':
            return 0;
          case 'End':
            return 100;
          default:
            return null;
        }
      })();

      if (nextPosition === null) return;
      event.preventDefault();
      setSliderPosition(Math.max(0, Math.min(100, nextPosition)));
    };

    // Effect to add and remove global event listeners for dragging
    React.useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX);
      };

      const handleTouchMove = (e: TouchEvent) => {
        handleMove(e.touches[0].clientX);
      };

      const handleInteractionEnd = () => {
        setIsDragging(false);
      };

      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('mouseup', handleInteractionEnd);
        document.addEventListener('touchend', handleInteractionEnd);
        document.body.style.cursor = 'ew-resize'; // Change cursor globally
      } else {
        document.body.style.cursor = '';
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('mouseup', handleInteractionEnd);
        document.removeEventListener('touchend', handleInteractionEnd);
        document.body.style.cursor = '';
      };
    }, [isDragging]);

    return (
      <div
        ref={containerRef}
        className={cn(
          'group relative h-full min-h-dvh w-full overflow-hidden select-none',
          className
        )}
        onMouseDown={handleInteractionStart}
        onTouchStart={handleInteractionStart}
        {...props}
      >
        {/* Right Image (bottom layer) */}
        <ImageMedia
          src={rightImage}
          alt={altRight}
          fill
          unoptimized
          className='pointer-events-none absolute inset-0 h-full w-full object-cover'
          draggable={false}
        />

        {/* Left Image (top layer, clipped) */}
        <div
          className='pointer-events-none absolute inset-0 h-full w-full overflow-hidden'
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        >
          <ImageMedia
            src={leftImage}
            alt={altLeft}
            fill
            unoptimized
            className='h-full w-full object-cover'
            draggable={false}
          />
        </div>

        {/* Slider Handle and Divider */}
        <div
          className='absolute top-0 h-full w-1 cursor-ew-resize'
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          {/* Divider Line */}
          <div className='bg-background/50 absolute inset-y-0 w-1 backdrop-blur-sm'></div>

          {/* Handle */}
          <div
            className={cn(
              'bg-background/50 text-foreground absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-xl backdrop-blur-md',
              'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
              'transition-all duration-300 ease-in-out',
              'group-hover:scale-105',
              isDragging && 'shadow-primary/50 scale-105 shadow-2xl'
            )}
            role='slider'
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-valuenow={Math.round(sliderPosition)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${Math.round(sliderPosition)}%`}
            aria-orientation='horizontal'
            aria-label={t('a11y.imageCompare')}
          >
            <div className='text-primary flex items-center'>
              <LuChevronLeft className='h-5 w-5 drop-shadow-md' />
              <LuChevronRight className='h-5 w-5 drop-shadow-md' />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ImageComparisonSlider.displayName = 'ImageComparisonSlider';
