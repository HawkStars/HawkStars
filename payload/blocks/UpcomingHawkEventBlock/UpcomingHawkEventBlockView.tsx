'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export type UpcomingEventItem = {
  heading: string;
  subheading?: string | null;
  description?: string | null;
  badge: string | null;
  image: { url: string; alt?: string } | null | undefined;
  href: string;
};

export type UpcomingHawkEventBlockViewProps = {
  title?: string | null;
  subtitle?: string | null;
  linkLabel?: string | null;
  sectionId?: string | null;
  event: UpcomingEventItem;
};

export const UpcomingHawkEventBlockView: React.FC<UpcomingHawkEventBlockViewProps> = ({
  title,
  subtitle,
  linkLabel = 'Learn more',
  sectionId,
  event,
}) => {
  return (
    <section className="py-12 lg:py-20" id={sectionId || ''}>
      <div className="container mx-auto">
        {(title || subtitle) && (
          <div className="mb-10 text-center">
            {title && (
              <h2 className="mb-4 text-3xl font-bold lg:text-4xl">{title}</h2>
            )}
            {subtitle && (
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col md:flex-row">
            {event.image?.url && (
              <div className="relative h-64 w-full shrink-0 md:h-auto md:w-1/3">
                <Image
                  src={event.image.url}
                  alt={event.image.alt || event.heading}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex flex-1 flex-col justify-center p-6 md:p-10">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                {event.badge && (
                  <span className="rounded-full bg-bege-light px-3 py-1 text-xs font-semibold uppercase text-black">
                    {event.badge}
                  </span>
                )}
              </div>

              <h3 className="mb-2 text-2xl font-semibold lg:text-3xl">
                {event.heading}
              </h3>

              {event.subheading && (
                <p className="mb-2 text-lg text-gray-600">
                  {event.subheading}
                </p>
              )}

              {event.description && (
                <p className="mb-4 line-clamp-3 text-gray-700">
                  {event.description}
                </p>
              )}

              <a
                href={event.href}
                className="text-green mt-2 inline-flex items-center gap-2 font-medium transition-colors hover:underline"
              >
                {linkLabel}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
