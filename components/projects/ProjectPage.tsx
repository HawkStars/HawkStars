import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { HawkProject, Media, Partner } from '@/payload-types';
import { FlagIcons } from '@/lib/flags';
import { getImagePayloadUrl } from '@/lib/image';
import { coFoundedEuropeanLogoBlue } from '@/utils/models/images/logos';

/* ================================================================== */
/*  Helper: render a flag icon by FlagIcons key                       */
/* ================================================================== */
function FlagIcon({ country }: { country: string }) {
  const Icon = FlagIcons[country];
  if (!Icon) return null;
  return (
    <span className='aspect-auto h-auto w-10'>
      {Icon({ title: country, className: 'w-full h-full rounded-full object-cover' })}
    </span>
  );
}

/* ================================================================== */
/*  Helper: format number with locale (e.g. 38064 → 38064,00)        */
/* ================================================================== */
function formatCurrency(amount: number): string {
  return amount.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ================================================================== */
/*  Section wrapper for consistent spacing + alternating backgrounds  */
/* ================================================================== */
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`py-4 ${className}`}>
      <div className='container mx-auto max-w-6xl px-4'>{children}</div>
    </section>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                    */
/* ================================================================== */
interface ProjectPageProps {
  project: HawkProject;
}

export default function ProjectPage({ project }: ProjectPageProps) {
  const { hero, partnersInformation, details, dissemination } = project;
  const { partners } = partnersInformation || {};
  const { text, phases } = details || {};

  const objectives = project.objectives;
  const results = project.results;
  const gallery = project.gallery;

  /* Date formatting */
  const startDate = project.startDate ? new Date(project.startDate) : null;
  const endDate = project.endDate ? new Date(project.endDate) : null;

  const dateLabel = (() => {
    if (!startDate) return '';
    if (endDate)
      return `${format(startDate, 'd', { locale: pt })} a ${format(endDate, "d 'de' MMMM 'de' yyyy", { locale: pt })}`;

    return format(startDate, "d 'de' MMMM 'de' yyyy", { locale: pt });
  })();

  /* Hero images */
  const badgeImage = hero?.projectBadge ? getImagePayloadUrl(hero.projectBadge) : null;

  return (
    <main>
      {/* ---------------------------------------------------------- */}
      {/*  1. HERO SECTION                                           */}
      {/* ---------------------------------------------------------- */}
      <Section className='bg-[#eef5f0] pt-32'>
        <div className='grid gap-10 md:grid-cols-2'>
          {/* Left column */}
          <div className=''>
            {/* Badge */}
            {badgeImage?.url && (
              <div className='mb-4'>
                <Image
                  src={badgeImage.url}
                  alt={badgeImage.alt || 'Project badge'}
                  width={120}
                  height={120}
                  className='object-contain'
                />
              </div>
            )}

            {/* Title */}
            <h1 className='text-4xl font-bold md:text-5xl'>{project.heading}</h1>

            {/* Stats row */}
            {(hero?.participants || hero?.fundedAmount) && (
              <div className='mt-6 flex flex-wrap items-center gap-8' data-project-stats>
                {hero.participants && (
                  <div className='flex items-center gap-2'>
                    <svg
                      className='h-6 w-6 text-gray-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                    <div>
                      <span className='text-2xl font-bold'>{hero.participants}</span>
                      <p className='text-sm text-gray-600'>{'Participantes'}</p>
                    </div>
                  </div>
                )}
                {hero.fundedAmount && (
                  <div className='flex items-center gap-2'>
                    <span className='text-xl'>💰</span>
                    <div>
                      <span className='text-2xl font-bold'>
                        {formatCurrency(hero.fundedAmount)}
                      </span>
                      <p className='text-sm text-gray-600'>{'Euros Financiados'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Date */}
            {dateLabel && (
              <div className='mt-4 flex items-center gap-2'>
                <svg
                  className='h-5 w-5 text-gray-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                <span className='text-lg font-semibold'>{dateLabel}</span>
              </div>
            )}

            {/* Country flags */}
            {partners && partners.length > 0 && (
              <div className='mt-6 flex flex-wrap gap-3'>
                {partners.map((c, i) => (
                  <FlagIcon key={i} country={(c.partner as Partner).country} />
                ))}
              </div>
            )}
          </div>

          {/* Right column: video + metadata */}
          <div className='flex flex-col gap-4'>
            {/* Video */}
            {hero?.videoUrl && (
              <div className='aspect-video w-full overflow-hidden rounded-lg bg-black'>
                <iframe
                  src={hero.videoUrl}
                  className='h-full w-full'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  title='Project video'
                />
              </div>
            )}

            {/* Metadata */}
            <div className='space-y-1 text-sm text-gray-700'>
              {project.heading && (
                <p>
                  <span className='font-semibold'>Nome do Projeto:</span> {project.heading}
                </p>
              )}
              {project.actionType && (
                <p>
                  <span className='font-semibold'>Tipo de Ação:</span> {project.actionType}
                </p>
              )}
              {project.referenceNumber && (
                <p>
                  <span className='font-semibold'>Número de Referência:</span>{' '}
                  {project.referenceNumber}
                </p>
              )}
              {project.beneficiary && (
                <p>
                  <span className='font-semibold'>Beneficiário:</span> {project.beneficiary}
                </p>
              )}
              {project.location && (
                <p>
                  <span className='font-semibold'>Localização:</span> {project.location}
                </p>
              )}
            </div>
          </div>
        </div>
      </Section>
      <Section className='bg-bege-dark'>
        {/* Description below hero grid */}

        <div className='mt-10 p-3'>
          {text && <p className='text-justify text-base leading-relaxed text-gray-800'>{text}</p>}
          {phases && phases.length > 0 && (
            <ul className='mt-4 list-disc space-y-2 pl-6 text-gray-800'>
              {phases.map((phase, i) => (
                <li key={i}>
                  {phase.title && <span className='font-semibold'>{phase.title}: </span>}
                  {phase.description && <p>{phase.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  2. PARTNERS SECTION                                       */}
      {/* ---------------------------------------------------------- */}
      {partners && partners.length > 0 && (
        <Section>
          <h2 className='mb-10 text-4xl font-bold'>Parceiros</h2>
          <div className='grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
            {partners.map((partner) => {
              const { country, logo, name } = partner.partner as Partner;
              const logoUrl = logo ? (logo as Media).url : null;
              return (
                <div key={partner.id} className='flex flex-col items-center gap-3 text-center'>
                  <h3 className='text-sm font-semibold'>{country}</h3>
                  {logoUrl && (
                    <Image
                      src={logoUrl}
                      alt={`${name} logo`}
                      width={120}
                      height={120}
                      className='h-24 w-24 object-contain'
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* ---------------------------------------------------------- */}
      {/*  3. OBJECTIVES SECTION                                     */}
      {/* ---------------------------------------------------------- */}
      {objectives &&
        (objectives.introduction || (objectives.items && objectives.items.length > 0)) && (
          <Section>
            <h2 className='mb-8 text-4xl font-bold'>Objetivos</h2>
            {objectives.introduction && (
              <p className='mb-6 text-justify text-base leading-relaxed text-gray-800'>
                {objectives.introduction}
              </p>
            )}
            {objectives.items && objectives.items.length > 0 && (
              <ul className='list-disc space-y-4 pl-6 text-gray-800'>
                {objectives.items.map((item, i) => (
                  <li key={i} className='text-justify leading-relaxed'>
                    {item.text}
                  </li>
                ))}
              </ul>
            )}

            {objectives.objectivesImage &&
              (() => {
                const img = getImagePayloadUrl(objectives.objectivesImage);
                return img?.url ? (
                  <div className='relative my-4 h-40 w-full'>
                    <Image
                      fill
                      src={img.url}
                      alt={img.alt || 'Objectives'}
                      className='rounded-lg object-contain'
                    />
                  </div>
                ) : null;
              })()}
          </Section>
        )}

      {/* ---------------------------------------------------------- */}
      {/*  4. RESULTS SECTION                                        */}
      {/* ---------------------------------------------------------- */}
      {results && (results.text || results.resultsImage) && (
        <Section>
          <h2 className='mb-8 text-4xl font-bold'>Resultados</h2>
          <div className='grid items-start gap-10 md:grid-cols-3'>
            {results.text && (
              <p className='col-span-2 text-justify text-base leading-relaxed text-gray-800'>
                {results.text}
              </p>
            )}
            {results.resultsImage &&
              (() => {
                const img = getImagePayloadUrl(results.resultsImage);
                return img?.url ? (
                  <Image
                    src={img.url}
                    alt={img.alt || 'Results'}
                    width={600}
                    height={400}
                    className='rounded-lg object-cover'
                  />
                ) : null;
              })()}
          </div>
        </Section>
      )}

      <Section className='bg-bege-dark'>
        <h2 className='mb-8 text-4xl font-bold'>Disseminação</h2>
        {/* ---------------------------------------------------------- */}
        {/*  5. DISSEMINATION SECTION                                  */}
        {/* ---------------------------------------------------------- */}
        <div className='flex flex-col gap-3'>
          {partners?.map((p) => {
            const partner = p.partner as Partner;
            const reports = p.reports || [];

            return (
              <div className='space-y-4' key={p.id}>
                <div key={partner.id} className='flex flex-wrap items-center gap-4'>
                  <FlagIcon country={partner.country} />
                  {reports &&
                    reports.map((report, j) => {
                      const { url, label, platform } = report;
                      if (!url) return null;

                      return (
                        <Link
                          key={j}
                          href={url}
                          target='_blank'
                          className='rounded-full bg-amber-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500'
                        >
                          {label ||
                            `Disseminação via ${platform?.charAt(0)?.toUpperCase() + platform?.slice(1)}`}
                        </Link>
                      );
                    })}
                </div>
              </div>
            );
          })}

          <div className='flex flex-wrap gap-3'>
            <div className='relative aspect-auto h-auto w-40'>
              <Image
                className='absolute'
                src={coFoundedEuropeanLogoBlue}
                alt='Co-founded by the European Union'
                fill
              />
            </div>

            {dissemination?.reports?.map((report, j) => (
              <Link
                key={j}
                href={report.url}
                target='_blank'
                className='rounded-full bg-amber-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500'
              >
                {report.label}
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  6. PHOTO GALLERY                                          */}
      {/* ---------------------------------------------------------- */}
      {gallery &&
        ((gallery.internalImages && gallery.internalImages.length > 0) ||
          (gallery.externalImages && gallery.externalImages.length > 0)) && (
          <Section>
            <h2 className='mb-8 text-4xl font-bold'>Galeria de Fotos</h2>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
              {gallery.internalImages?.map((item, i) => {
                const media = item.image as Media;
                return media?.url ? (
                  <Image
                    key={`int-${i}`}
                    src={media.url}
                    alt={media.alt || ''}
                    width={400}
                    height={300}
                    className='h-64 w-full rounded-lg object-cover'
                  />
                ) : null;
              })}
              {gallery.externalImages?.map((item, i) => (
                <Image
                  key={`ext-${i}`}
                  src={item.url}
                  alt={item.alt}
                  width={400}
                  height={300}
                  className='h-64 w-full rounded-lg object-cover'
                />
              ))}
            </div>
          </Section>
        )}
    </main>
  );
}
