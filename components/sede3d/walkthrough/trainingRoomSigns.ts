import type { Media, Sponsor } from '@/payload-types';

/**
 * Signage for the two training rooms: a name, a short line of text and a row of logos, shown
 * as a panel on the front wall of each room in the walkthrough.
 *
 * MOCK DATA. The shape follows the Payload documents it will come from later — each logo is
 * a `Sponsor`-like entry with a populated `Media` — so swapping these for a database query
 * (e.g. sponsors or partners linked to a room) does not touch the 3D code. The images are
 * local files in public/images/logos, standing in for Cloudinary media URLs.
 */

export type SignLogo = Pick<Sponsor, 'id' | 'name'> & {
  logo: Pick<Media, 'id' | 'alt' | 'url' | 'width' | 'height'>;
};

export type TrainingRoomSign = {
  roomId: 'formacao-a' | 'formacao-b';
  /** Room name, as people will call it */
  name: string;
  /** One short line under the name */
  text: string;
  logos: SignLogo[];
};

const logo = (id: string, name: string, url: string, alt: string): SignLogo => ({
  id,
  name,
  logo: { id: `media-${id}`, alt, url, width: null, height: null },
});

export const MOCK_TRAINING_ROOM_SIGNS: TrainingRoomSign[] = [
  {
    roomId: 'formacao-a',
    name: 'Sala Global Village',
    text: 'Formação e eventos Erasmus+ · 30 lugares',
    logos: [
      logo(
        'global-village',
        'Global Village',
        '/images/logos/global_village.png',
        'Global Village'
      ),
      logo(
        'eu',
        'Cofinanciado pela União Europeia',
        '/images/logos/co-founded.png',
        'Cofinanciado pela União Europeia'
      ),
    ],
  },
  {
    roomId: 'formacao-b',
    name: 'Sala EuroHawk',
    text: 'Cooperação europeia para a juventude · 35 lugares',
    logos: [
      logo('eurohawk', 'EuroHawk', '/images/logos/eurohawk.webp', 'EuroHawk'),
      logo('hawkstars', 'Associação HawkStars', '/images/logos/logo.svg', 'Associação HawkStars'),
    ],
  },
];

/**
 * The sign on the building's façade (naming of the training centre). MOCK DATA, like the room
 * signs: a placeholder that invites sponsors, until a named partner comes from Payload.
 */
export type BuildingSign = { name: string; text: string; logo: SignLogo | null };

export const MOCK_BUILDING_SIGN: BuildingSign = {
  name: 'HawkStars Training Center',
  text: 'Naming disponível · o nome da sua marca aqui',
  logo: logo('hawkstars', 'Associação HawkStars', '/images/logos/logo.svg', 'Associação HawkStars'),
};
