import Image from 'next/image';
import Link from 'next/link';
import { HawkProject, Media, Partner } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { coFoundedEuropeanLogoBlue } from '@/utils/models/images/logos';
import { FlagIcon } from '@/lib/icon';
import ProjectsSingleHero from './single/ProjectsSingleHero';
import NewsSingleGallery from '../news/single/NewsSingleGallery';

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
  const { partnersInformation, details, otherDisseminationFields } = project;
  const { partners } = partnersInformation || {};
  const { text, phases } = details || {};

  const objectives = project.objectives;
  const results = project.results;
  const gallery = project.gallery;

  return (
    <main>
      <ProjectsSingleHero {...project} />
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
                          rel='noopener noreferrer'
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

            {otherDisseminationFields?.reports?.map((report, j) => (
              <Link
                key={j}
                href={report.url}
                target='_blank'
                rel='noopener noreferrer'
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
      <NewsSingleGallery gallery={gallery} />
    </main>
  );
}
