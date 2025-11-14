import React from 'react';
import RichText from '@/payload/components/RichText';
import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames';
import {
  Users,
  Heart,
  Star,
  Award,
  Target,
  Globe,
  Zap,
  CheckCircle,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Users,
  Heart,
  Star,
  Award,
  Target,
  Globe,
  Zap,
  CheckCircle,
  ArrowRight,
};

// Temporary types until we regenerate payload-types
interface CardGridCard {
  title: string;
  description?: any;
  image?: string | any;
  icon?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  links?: Array<{
    link: {
      type?: 'reference' | 'custom';
      newTab?: boolean;
      reference?: any;
      url?: string;
      label?: string;
    };
    appearance?: 'default' | 'outline';
  }>;
}

interface CardGridBlockProps {
  title?: string;
  subtitle?: string;
  cards: CardGridCard[];
  layout?: 'cols-1' | 'cols-2' | 'cols-3' | 'cols-4';
  cardStyle?: 'standard' | 'hover' | 'minimal' | 'bordered';
  textAlign?: 'left' | 'center' | 'right';
}

export const CardGridBlock: React.FC<CardGridBlockProps> = ({
  title,
  subtitle,
  cards = [],
  layout = 'cols-3',
  cardStyle = 'standard',
  textAlign = 'center',
}) => {
  const layoutClasses = {
    'cols-1': 'grid-cols-1',
    'cols-2': 'grid-cols-1 md:grid-cols-2',
    'cols-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    'cols-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const colorClasses = {
    blue: {
      icon: 'text-blue-600 bg-blue-50 border-blue-200',
      accent: 'text-blue-600',
      hover: 'hover:border-blue-300',
    },
    green: {
      icon: 'text-green-600 bg-green-50 border-green-200',
      accent: 'text-green-600',
      hover: 'hover:border-green-300',
    },
    red: {
      icon: 'text-red-600 bg-red-50 border-red-200',
      accent: 'text-red-600',
      hover: 'hover:border-red-300',
    },
    yellow: {
      icon: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      accent: 'text-yellow-600',
      hover: 'hover:border-yellow-300',
    },
    purple: {
      icon: 'text-purple-600 bg-purple-50 border-purple-200',
      accent: 'text-purple-600',
      hover: 'hover:border-purple-300',
    },
    gray: {
      icon: 'text-gray-600 bg-gray-50 border-gray-200',
      accent: 'text-gray-600',
      hover: 'hover:border-gray-300',
    },
  };

  const cardStyleClasses = {
    standard: 'bg-white rounded-lg shadow-md border border-gray-200',
    hover:
      'bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300',
    minimal: 'bg-transparent',
    bordered: 'bg-white rounded-lg border-2 border-gray-200',
  };

  const renderCardLink = (card: CardGridCard) => {
    const link = card.links?.[0]?.link;
    if (!link) return null;

    const href = link.type === 'custom' ? link.url : '#'; // Handle reference links as needed
    const label = link.label || 'Learn More';

    return (
      <Link
        href={href || '#'}
        target={link.newTab ? '_blank' : undefined}
        className={classNames(
          'mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors',
          card.links?.[0]?.appearance === 'outline'
            ? `border-2 ${colorClasses[card.color || 'blue'].hover} ${colorClasses[card.color || 'blue'].accent} hover:bg-opacity-10`
            : `bg-opacity-10 ${colorClasses[card.color || 'blue'].accent} hover:bg-opacity-20`
        )}
      >
        {label}
        <ArrowRight className='h-4 w-4' />
      </Link>
    );
  };

  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <div className='py-12'>
      <div className='mx-auto max-w-7xl px-4'>
        {/* Header */}
        {(title || subtitle) && (
          <div className={classNames('mb-12', textAlignClasses[textAlign])}>
            {title && (
              <h2 className='mb-4 text-3xl font-bold text-gray-900 lg:text-4xl'>{title}</h2>
            )}
            {subtitle && <p className='text-lg text-gray-600 lg:text-xl'>{subtitle}</p>}
          </div>
        )}

        {/* Cards Grid */}
        <div className={classNames('grid gap-6 lg:gap-8', layoutClasses[layout])}>
          {cards.map((card, index) => {
            const IconComponent = card.icon ? iconMap[card.icon] : null;
            const cardColors = colorClasses[card.color || 'blue'];

            return (
              <div
                key={index}
                className={classNames(
                  'p-6',
                  cardStyleClasses[cardStyle],
                  cardStyle === 'hover' && cardColors.hover
                )}
              >
                {/* Image or Icon */}
                <div className='mb-4'>
                  {card.image ? (
                    <div className='relative mb-4 h-48 w-full overflow-hidden rounded-lg'>
                      <Image
                        src={
                          typeof card.image === 'string'
                            ? card.image
                            : card.image.url || '/placeholder.jpg'
                        }
                        alt={card.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                  ) : IconComponent ? (
                    <div
                      className={classNames(
                        'mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2',
                        cardColors.icon,
                        textAlign !== 'center' && 'mx-0'
                      )}
                    >
                      <IconComponent className='h-6 w-6' />
                    </div>
                  ) : null}
                </div>

                {/* Content */}
                <div className={textAlignClasses[textAlign]}>
                  <h3
                    className={classNames(
                      'mb-3 text-xl font-semibold text-gray-900',
                      cardColors.accent
                    )}
                  >
                    {card.title}
                  </h3>

                  {card.description && (
                    <div className='mb-4 text-gray-600'>
                      <RichText data={card.description} />
                    </div>
                  )}

                  {renderCardLink(card)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
