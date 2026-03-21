'use client';

import React from 'react';
import Image from 'next/image';

export type SponsorItem = {
  id: string;
  name: string;
  logo: { url?: string | null } | null;
  website?: string | null;
  tier: 'gold' | 'silver' | 'bronze';
};

export type SponsorsBlockViewProps = {
  title?: string | null;
  subtitle?: string | null;
  sectionId?: string | null;
  sponsors: SponsorItem[];
};

const tierOrder: Record<string, number> = {
  gold: 1,
  silver: 2,
  bronze: 3,
};

const tierStyles: Record<string, string> = {
  gold: 'border-yellow-400 bg-yellow-50',
  silver: 'border-gray-300 bg-gray-50',
  bronze: 'border-amber-600/30 bg-amber-50',
};

export const SponsorsBlockView: React.FC<SponsorsBlockViewProps> = ({
  title,
  subtitle,
  sectionId,
  sponsors,
}) => {
  const sorted = [...sponsors].sort(
    (a, b) => (tierOrder[a.tier] ?? 99) - (tierOrder[b.tier] ?? 99),
  );

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

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {sorted.map((sponsor) => {
            const logoUrl = sponsor.logo?.url;
            const borderStyle = tierStyles[sponsor.tier] || 'border-gray-100 bg-white';

            const content = (
              <div
                key={sponsor.id}
                className={`flex flex-col items-center justify-center rounded-lg border p-6 transition-shadow hover:shadow-md ${borderStyle}`}
              >
                {logoUrl ? (
                  <div className="relative mb-3 h-16 w-full">
                    <Image
                      src={logoUrl}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="mb-3 flex h-16 w-full items-center justify-center rounded bg-gray-100">
                    <span className="text-sm font-medium text-gray-400">
                      {sponsor.name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-center text-sm font-medium text-gray-700">
                  {sponsor.name}
                </span>
              </div>
            );

            if (sponsor.website) {
              return (
                <a
                  key={sponsor.id}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              );
            }

            return content;
          })}
        </div>
      </div>
    </section>
  );
};
