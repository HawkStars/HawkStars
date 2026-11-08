import type { IconType } from 'react-icons';
import {
  LuBriefcase,
  LuGamepad2,
  LuGlobe,
  LuGraduationCap,
  LuHandHeart,
  LuMic,
  LuUsers,
  LuUtensils,
} from 'react-icons/lu';
import type { StaticImageData } from 'next/image';
import type { HawkStarsPaths } from '@/utils/paths';

import pinhelAerial from '@/public/images/pinhel/foto1.jpeg';
import pinhelSign from '@/public/images/pinhel/foto5.jpeg';
import humanitarian from '@/public/images/history/humanitarian_2.jpg';
import centreExterior from '@/public/images/training_center/exterior.jpg';
import centreCowork from '@/public/images/training_center/cowork1.jpg';
import project1 from '@/public/images/projects/1.jpeg';
import project3 from '@/public/images/projects/3.jpeg';
import project5 from '@/public/images/projects/5.jpeg';
import project7 from '@/public/images/projects/7.jpeg';
import project9 from '@/public/images/projects/9.jpeg';
import project11 from '@/public/images/projects/11.jpeg';
import project12 from '@/public/images/projects/12.jpeg';
import project14 from '@/public/images/projects/14.jpeg';
import project16 from '@/public/images/projects/16.jpeg';
import project18 from '@/public/images/projects/18.jpeg';
import project20 from '@/public/images/projects/20.jpeg';
import project22 from '@/public/images/projects/22.jpeg';
import project24 from '@/public/images/projects/24.jpeg';

export const CONTACT_EMAIL = 'geral@hawkstars.org';

export const heroImage = pinhelAerial;
export const missionImage = pinhelSign;
export const impactImage = humanitarian;
export const villageImages = { exterior: centreExterior, cowork: centreCowork };

export const marqueeKeys = [
  'erasmus',
  'mobility',
  'solidarity',
  'humanitarian',
  'culture',
  'innovation',
  'village',
  'education',
] as const;

export const valueKeys = ['solidarity', 'identity', 'sense'] as const;

export type Pillar = {
  key: 'erasmus' | 'village' | 'humanitarian' | 'culture';
  icon: IconType;
  image: StaticImageData;
  path: HawkStarsPaths;
};

export const pillars: Pillar[] = [
  { key: 'erasmus', icon: LuGlobe, image: project20, path: 'erasmus' },
  { key: 'village', icon: LuGraduationCap, image: centreExterior, path: 'crowdfunding' },
  { key: 'humanitarian', icon: LuHandHeart, image: humanitarian, path: 'history' },
  { key: 'culture', icon: LuUsers, image: project12, path: 'gallery' },
];

export type ImpactStat = {
  key: 'tons' | 'km' | 'people' | 'brigades' | 'institutions' | 'value';
  value: number;
  /** Translation key under `impact.units`, rendered before (`prefix`) or after the number. */
  unit?: { key: string; position: 'prefix' | 'suffix' };
};

export const impactStats: ImpactStat[] = [
  { key: 'tons', value: 90, unit: { key: 'tons', position: 'suffix' } },
  { key: 'km', value: 30342, unit: { key: 'km', position: 'suffix' } },
  { key: 'people', value: 90 },
  { key: 'brigades', value: 23 },
  { key: 'institutions', value: 18 },
  { key: 'value', value: 24500, unit: { key: 'value', position: 'prefix' } },
];

export const timelineKeys = ['eurohawk', 'festival', 'ukraine', 'foundation', 'future'] as const;

export const villageFeatures: { key: string; icon: IconType }[] = [
  { key: 'training', icon: LuGraduationCap },
  { key: 'cowork', icon: LuBriefcase },
  { key: 'studio', icon: LuMic },
  { key: 'gaming', icon: LuGamepad2 },
  { key: 'restaurant', icon: LuUtensils },
];

export const galleryRows: StaticImageData[][] = [
  [project1, project20, project3, project12, project5, project7, project9],
  [project11, project14, project16, project18, project22, project24, humanitarian],
];

export type InvolvePath = {
  key: 'member' | 'volunteer' | 'donate' | 'erasmus';
  path: HawkStarsPaths;
  accent?: boolean;
};

export const involvePaths: InvolvePath[] = [
  { key: 'member', path: 'how_to_help_us' },
  { key: 'volunteer', path: 'how_to_help_us' },
  { key: 'erasmus', path: 'erasmus' },
  { key: 'donate', path: 'contribute', accent: true },
];
