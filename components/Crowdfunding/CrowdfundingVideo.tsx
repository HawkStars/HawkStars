import { TFunction } from 'i18next';
import { LuHeart } from 'react-icons/lu';
import { CrowdfundingSetting, Media } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { ShareButton } from './ShareButton';
import { VideoEmbed } from './VideoEmbed';
import { CfSection, Container, SectionEyebrow } from './ui';

type Props = { t: TFunction<string, string> } & Pick<
  CrowdfundingSetting,
  'videoUrl' | 'videoThumbnail' | 'supportUrl'
>;

const FALLBACK_THUMBNAIL = '/images/training_center/exterior2.jpg';

/** Only rendered once a video URL is set in Payload — a poster with no video was a dead end. */
const CrowdfundingVideo = ({ t, videoUrl, videoThumbnail, supportUrl }: Props) => {
  if (!videoUrl) return null;

  const thumbnailUrl =
    (typeof videoThumbnail === 'object' && (videoThumbnail as Media)?.url) || FALLBACK_THUMBNAIL;

  return (
    <CfSection id='video' alt>
      <Container className='grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16'>
        <VideoEmbed
          videoUrl={videoUrl}
          thumbnailUrl={thumbnailUrl}
          overlayLine1={t('video.overlay_line1')}
          overlayLine2={t('video.overlay_line2')}
        />

        <div className='flex flex-col gap-5'>
          <SectionEyebrow>{t('video.badge')}</SectionEyebrow>
          <h2 className='text-h2_semibold text-white'>{t('video.title')}</h2>
          <p className='text-crowdfunding-muted leading-relaxed'>{t('video.description')}</p>
          <div className='flex flex-wrap gap-3 pt-2'>
            <Button asChild variant='crowdfunding' size='xl'>
              <a
                href={supportUrl || '#rewards'}
                target={supportUrl ? '_blank' : undefined}
                rel='noopener noreferrer'
              >
                <LuHeart aria-hidden='true' />
                {t('video.cta_support')}
              </a>
            </Button>
            <ShareButton label={t('video.cta_share')} />
          </div>
        </div>
      </Container>
    </CfSection>
  );
};

export default CrowdfundingVideo;
