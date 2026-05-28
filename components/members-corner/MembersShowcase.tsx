import Link from 'next/link';
import { MemberProjectDoc } from '@/lib/payload/queries/memberProject';

type T = (key: string) => string;

type MembersShowcaseProps = {
  projects: MemberProjectDoc[];
  t: T;
};

// Format deterministically from the ISO date parts (no timezone/locale
// dependency) so the server and client render identical output — otherwise
// toLocaleDateString causes a React hydration mismatch.
const formatDate = (iso: string) => {
  const datePart = iso.split('T')[0];
  const [year, month, day] = datePart.split('-');
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
};

const MembersShowcase = ({ projects, t }: MembersShowcaseProps) => {
  if (!projects.length) {
    return (
      <div className='mx-auto max-w-2xl px-4 py-20 text-center'>
        <p className='text-body text-disabled'>{t('showcase.empty')}</p>
      </div>
    );
  }

  return (
    <div className='mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 lg:grid-cols-3'>
      {projects.map((project) => (
        <MemberProjectCard key={project.id} project={project} t={t} />
      ))}
    </div>
  );
};

const MemberProjectCard = ({ project, t }: { project: MemberProjectDoc; t: T }) => {
  const languageLabel = t(`languages.${project.language}`);

  return (
    <article className='border-bege-dark flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md'>
      <div className='bg-bege-light relative aspect-video w-full overflow-hidden'>
        {project.image_url ? (
          // Members supply arbitrary external URLs, so next/image remotePatterns
          // cannot cover them — use a plain img element.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url}
            alt={project.title}
            className='absolute inset-0 h-full w-full object-cover'
          />
        ) : project.video_url ? (
          <Link
            href={project.video_url}
            target='_blank'
            rel='noopener noreferrer'
            className='bg-green flex h-full w-full items-center justify-center text-white'
          >
            <span className='text-body_semibold'>▶ {t('showcase.watchVideo')}</span>
          </Link>
        ) : null}
      </div>

      <div className='flex flex-1 flex-col gap-4 p-6'>
        <div className='flex items-start justify-between gap-3'>
          <h3 className='text-h3_semibold text-green'>{project.title}</h3>
          <span className='bg-bege-dark shrink-0 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap'>
            {languageLabel}
          </span>
        </div>

        <p className='text-body text-disabled whitespace-pre-line'>{project.description}</p>

        {project.video_url && project.image_url && (
          <Link
            href={project.video_url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-green text-body_semibold hover:underline'
          >
            ▶ {t('showcase.watchVideo')}
          </Link>
        )}

        {project.dates && project.dates.length > 0 && (
          <div className='mt-auto'>
            <h4 className='text-body_semibold mb-2'>{t('showcase.datesTitle')}</h4>
            <ul className='flex flex-col gap-2'>
              {project.dates.map((d, i) => (
                <li key={i} className='flex flex-wrap items-baseline gap-x-2'>
                  <span className='text-green font-semibold'>{formatDate(d.date)}</span>
                  <span>{d.label}</span>
                  {d.link && (
                    <Link
                      href={d.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-linkedin text-sm hover:underline'
                    >
                      {t('showcase.moreInfo')} →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
};

export default MembersShowcase;
