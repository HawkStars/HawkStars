import { getServerTranslation } from '@/i18n';
import type { Language } from '@/i18n/settings';
import { HomeHero } from './HomeHero';
import { HomeMarquee } from './HomeMarquee';
import { HomeMission } from './HomeMission';
import { HomePillars } from './HomePillars';
import { HomeImpact } from './HomeImpact';
import { HomeTimeline } from './HomeTimeline';
import { HomeVillage } from './HomeVillage';
import { HomeGallery } from './HomeGallery';
import { HomeInvolve } from './HomeInvolve';

/**
 * The static landing page. All copy lives in `i18n/locales/{pt,en}/home.json`
 * and all imagery in `public/images` — nothing here reads from Payload.
 */
export const HomeLanding = async ({ lng }: { lng: Language }) => {
  const { t } = await getServerTranslation(lng, 'home');

  return (
    <>
      <HomeHero t={t} lng={lng} />
      <HomeMarquee t={t} />
      <HomeMission t={t} />
      <HomePillars t={t} lng={lng} />
      <HomeImpact t={t} lng={lng} />
      <HomeTimeline t={t} />
      <HomeVillage t={t} lng={lng} />
      <HomeGallery t={t} lng={lng} />
      <HomeInvolve t={t} lng={lng} />
    </>
  );
};
