'use client';

import { Language } from '@/i18n/settings';
import { HawkProject } from '@/payload-types';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import dynamic from 'next/dynamic';
import { FC } from 'react';

const SingleProjectTravelMap = dynamic(
  () => import('@/components/projects/single/SingleProjectTravelMap'),
  { ssr: false }
);

type SingleProjectTravelMapWrapperProps = Pick<HawkProject, 'project_type' | 'discoverEuFields'> & {
  lng?: Language;
};

const SingleProjectTravelMapWrapper: FC<SingleProjectTravelMapWrapperProps> = ({
  project_type,
  discoverEuFields,
  lng,
}) => {
  const cookieLng = useLanguageCookie();
  return (
    <SingleProjectTravelMap
      lng={lng ?? cookieLng}
      project_type={project_type}
      discoverEuFields={discoverEuFields}
    />
  );
};

export default SingleProjectTravelMapWrapper;
