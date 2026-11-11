import { TFunction } from 'i18next';
import { LuHeart, LuMail } from 'react-icons/lu';
import { CrowdfundingSetting } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { Button } from '@/components/ui/button';
import { ShareButton } from './ShareButton';
import { Container, Glow } from './ui';

type Props = { t: TFunction<string, string> } & Pick<
  CrowdfundingSetting,
  'ctaImage' | 'supportUrl' | 'contactUrl'
>;

const FALLBACK_IMAGE = '/images/training_center/entry_2.jpg';

/** `contactUrl` historically held a bare address (e.g. geral@…); accept both forms. */
const toContactHref = (contact: string) =>
  /^(mailto:|https?:)/.test(contact) ? contact : `mailto:${contact}`;

const CrowdfundingCTA = ({ ctaImage, supportUrl, contactUrl, t }: Props) => (
  <section id='support' className='bg-crowdfunding-bg relative isolate w-full overflow-hidden'>
    <div className='absolute inset-0 -z-10'>
      <ImageMedia
        resource={typeof ctaImage === 'object' && ctaImage ? ctaImage : FALLBACK_IMAGE}
        alt=''
        fill
        sizes='100vw'
        className='object-cover opacity-30'
      />
      <div className='from-crowdfunding-bg via-crowdfunding-bg/70 to-crowdfunding-bg absolute inset-0 bg-linear-to-t' />
    </div>
    <Glow className='-bottom-60 left-1/2 size-176 -translate-x-1/2 opacity-40' />

    <Container className='flex flex-col items-center py-24 text-center lg:py-36'>
      <h2 className='text-h1_semibold max-w-3xl text-white'>
        {t('cta.title_line1')}{' '}
        <span className='text-crowdfunding-accent'>{t('cta.title_highlight')}</span>
      </h2>
      <p className='text-h2_light mt-5 max-w-xl text-white/80'>{t('cta.description')}</p>

      <div className='mt-10 flex flex-wrap justify-center gap-3'>
        <Button asChild variant='crowdfunding' size='xl'>
          <a
            href={supportUrl || '#rewards'}
            target={supportUrl ? '_blank' : undefined}
            rel='noopener noreferrer'
          >
            <LuHeart aria-hidden='true' />
            {t('cta.cta_support')}
          </a>
        </Button>
        <ShareButton label={t('cta.cta_share')} />
        {contactUrl && (
          <Button asChild variant='crowdfunding-outline' size='xl'>
            <a href={toContactHref(contactUrl)}>
              <LuMail aria-hidden='true' />
              {t('cta.cta_team')}
            </a>
          </Button>
        )}
      </div>
    </Container>
  </section>
);

export default CrowdfundingCTA;
