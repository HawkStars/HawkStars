/**
 * Geometry and room data for the HawkStars headquarters 3D model.
 *
 * Reconstructed from the architect's plans (piso_0/1/2), the long section and the renders.
 * The plans carry no dimensions: 1 plan pixel ≈ 0.028 m, derived from the section's
 * floor-to-floor height, puts the whole building at about 36 × 11 m. Every measurement
 * here is therefore an estimate.
 */

export type Pt = [number, number];
export type Vec3 = [number, number, number];
export type FloorView = 'ext' | '0' | '1' | '2';

/** Plan pixel (1400 px-wide image) → metres. */
export const S = 0.028;
export const X = (px: number) => (px - 65) * S;
export const Z = (py: number) => (py - 260) * S;

export const FH = 3.4; // floor to floor
export const LV = { L: [0, 3.4, 6.8], R: [1.8, 5.2, 8.6] } as const;
/** The street climbs: the new building's ground floor sits ≈1.8 m above the old one. */
export const PL = LV.R[0];
export const R_ROOF = 12.0;
export const L_EAVE = 7.2;
export const L_RIDGE = 10.0;
export const GLASS_ROOF = 9.0;

export const rect = (x0: number, z0: number, x1: number, z1: number): Pt[] => [
  [x0, z0],
  [x1, z0],
  [x1, z1],
  [x0, z1],
];

export const LFP: Pt[] = rect(0, 0, 11.2, 11.2);
export const MFP: Pt[] = [
  [11.2, 0],
  [19.2, 0],
  [19.4, 1.3],
  [19.4, 11.2],
  [11.2, 11.2],
];
export const RFP: Pt[] = [
  [19.4, 1.3],
  [35.8, -0.3],
  [36.2, 9.0],
  [23.2, 11.1],
  [19.4, 11.2],
];
export const R2FP: Pt[] = [
  [22.4, 1.0],
  [35.8, -0.3],
  [36.1, 6.7],
  [22.6, 8.0],
];
export const RTOP: Pt[] = [
  [22.4, 1.0],
  [35.8, -0.3],
  [36.2, 9.0],
  [23.2, 11.1],
  [22.4, 11.15],
];

export const polygonArea = (pts: Pt[]) => {
  let a = 0;
  pts.forEach(([x1, z1], i) => {
    const [x2, z2] = pts[(i + 1) % pts.length];
    a += x1 * z2 - x2 * z1;
  });
  return Math.abs(a / 2);
};

/** Room swatches reuse the site's colour tokens (rendered as CSS, never as 3D materials). */
const C = {
  blue: 'var(--color-ink-light)',
  gold: 'var(--color-gold)',
  green: 'var(--color-green)',
  ink: 'var(--color-ink)',
  terra: 'var(--color-terracotta)',
  dark: 'var(--color-disabled)',
};

export type Room = {
  id: string;
  floor: FloorView;
  name: string;
  color: string;
  /** Label anchor, in metres. */
  at: Vec3;
  poly: Pt[];
  desc: string;
  area: number;
};

const room = (r: Omit<Room, 'area'>): Room => ({ ...r, area: Math.round(polygonArea(r.poly)) });

export const ROOMS: Room[] = [
  room({
    id: 'restaurante',
    floor: '0',
    name: 'Restaurante e cafetaria',
    color: C.terra,
    at: [3.6, 1.2, 6.0],
    poly: [
      [0.3, 0.3],
      [X(325), 0.3],
      [X(325), 10.9],
      [0.3, 10.9],
    ],
    desc: 'Sala de refeições no edifício antigo, com bancos corridos, mesas redondas e muitas plantas. Abre para a rua e para o átrio.',
  }),
  room({
    id: 'cozinha',
    floor: '0',
    name: 'Cozinha',
    color: C.dark,
    at: [9.0, 1.2, 2.3],
    poly: rect(X(325), 0.3, 10.9, 4.0),
    desc: 'Cozinha de apoio ao restaurante, com balcão de serviço virado para a sala.',
  }),
  room({
    id: 'wc',
    floor: '0',
    name: 'Instalações sanitárias',
    color: C.blue,
    at: [9.0, 1.2, 8.7],
    poly: rect(X(325), 6.6, 10.9, 10.9),
    desc: 'Três cabines e lavatórios, junto à passagem para o átrio.',
  }),
  room({
    id: 'atrio',
    floor: '0',
    name: 'Átrio de entrada',
    color: C.gold,
    at: [14.2, 1.4, 8.2],
    poly: MFP,
    desc: 'Pátio coberto com vidro colorido que liga os dois edifícios. Entrada principal pela Travessa do Portão Norte, escada em madeira e floreiras.',
  }),
  room({
    id: 'gaming',
    floor: '0',
    name: 'Sala de gaming e criação',
    color: C.ink,
    at: [24.6, PL + 1.2, 6.2],
    poly: [
      [19.4, 1.3],
      [29.6, 0.5],
      [30.0, 9.5],
      [23.2, 11.1],
      [19.4, 11.2],
    ],
    desc: 'Espaço escuro para jogos, streaming e criação de conteúdos: parede verde (chroma key), mesa comprida, pufes e ecrãs.',
  }),
  room({
    id: 'gravacao',
    floor: '0',
    name: 'Estúdio de gravação',
    color: C.dark,
    at: [32.8, PL + 1.2, 4.6],
    poly: [
      [30.0, 0.5],
      [35.8, -0.3],
      [36.2, 9.0],
      [30.0, 9.6],
    ],
    desc: 'Estúdio com bateria, régie de mistura e cabine de voz em vidro. O piso é cerca de 1,8 m mais alto que o do edifício antigo.',
  }),
  room({
    id: 'cowork',
    floor: '1',
    name: 'Cowork',
    color: C.blue,
    at: [5.0, LV.L[1] + 1.2, 7.5],
    poly: rect(0.3, Z(392), 10.9, 10.9),
    desc: 'Open space com quatro ilhas de secretárias azuis, iluminação em calha e janelas para a rua.',
  }),
  room({
    id: 'reunioes1',
    floor: '1',
    name: 'Sala de reuniões',
    color: C.gold,
    at: [X(160), LV.L[1] + 1.2, 2.0],
    poly: rect(0.3, 0.3, X(230), Z(392)),
    desc: 'Sala pequena para reuniões de equipa, no topo do cowork.',
  }),
  room({
    id: 'gabinete',
    floor: '1',
    name: 'Gabinete',
    color: C.green,
    at: [X(385), LV.L[1] + 1.2, 2.0],
    poly: rect(X(320), 0.3, 10.9, Z(392)),
    desc: 'Gabinete da direção, ao lado da escada para o sótão.',
  }),
  room({
    id: 'galeria',
    floor: '1',
    name: 'Galeria do átrio',
    color: C.gold,
    at: [14.8, LV.R[1] + 1.0, 1.2],
    poly: rect(11.6, 0.3, 19.3, 2.4),
    desc: 'Passadiço sob a cobertura de vidro, com quadros pendurados. Liga a escada do átrio ao auditório.',
  }),
  room({
    id: 'auditorio',
    floor: '1',
    name: 'Auditório e formação',
    color: C.terra,
    at: [29.5, LV.R[1] + 1.4, 5.2],
    poly: RFP,
    desc: 'Sala ampla para cerca de 70 pessoas, com projetor e ecrã. Serve para formações, conferências e eventos Erasmus+.',
  }),
  room({
    id: 'sotao',
    floor: '2',
    name: 'Sótão e copa',
    color: C.gold,
    at: [5.2, LV.L[2] + 1.0, 6.0],
    poly: rect(0.6, 0.6, 10.6, 10.6),
    desc: 'Espaço sob o telhado com copa, mesa de apoio e zona de descanso. Por cima ficam os painéis solares do edifício antigo.',
  }),
  room({
    id: 'lounge',
    floor: '2',
    name: 'Lounge criativo',
    color: C.blue,
    at: [27.5, LV.R[2] + 1.2, 4.2],
    poly: [
      [22.4, 1.0],
      [X(1245), 0.1],
      [X(1245), 6.9],
      [22.6, 8.0],
    ],
    desc: 'Zona informal com bancos em madeira, pufes, tapetes e grandes janelas.',
  }),
  room({
    id: 'reunioes2',
    floor: '2',
    name: 'Sala de reuniões',
    color: C.ink,
    at: [34.6, LV.R[2] + 1.2, 3.4],
    poly: [
      [X(1245), 0.1],
      [35.8, -0.3],
      [36.1, 6.7],
      [X(1245), 6.9],
    ],
    desc: 'Sala de reuniões com mesa oval para oito pessoas e ecrã.',
  }),
  room({
    id: 'terraco',
    floor: '2',
    name: 'Terraço',
    color: C.green,
    at: [27.0, LV.R[2] + 0.9, 9.2],
    poly: [
      [22.6, 8.0],
      [36.1, 6.7],
      [36.2, 9.0],
      [23.2, 11.1],
      [19.4, 11.2],
      [19.4, 1.3],
      [22.4, 1.0],
    ],
    desc: 'Terraço sobre o auditório, virado para a Travessa do Portão Norte.',
  }),
  room({
    id: 'edificio-antigo',
    floor: 'ext',
    name: 'Edifício antigo',
    color: C.terra,
    at: [5.6, 11.3, 5.6],
    poly: LFP,
    desc: 'Casa tradicional recuperada: paredes grossas em pedra rebocada a branco, telhado de telha e chaminé. Restaurante, cowork e sótão.',
  }),
  room({
    id: 'atrio-ext',
    floor: 'ext',
    name: 'Átrio coberto',
    color: C.gold,
    at: [15.3, GLASS_ROOF + 0.9, 5.6],
    poly: MFP,
    desc: 'Pátio entre os dois edifícios, coberto por uma estrutura de vidro com painéis amarelos, azuis e verdes.',
  }),
  room({
    id: 'edificio-novo',
    floor: 'ext',
    name: 'Edifício novo',
    color: C.ink,
    at: [29.0, R_ROOF + 1.6, 3.8],
    poly: RFP,
    desc: 'Volume contemporâneo de três pisos, com cobertura verde e painéis solares. Gaming, estúdio, auditório e lounge.',
  }),
];

export const FLOORS: { id: FloorView; label: string }[] = [
  { id: 'ext', label: 'Exterior' },
  { id: '0', label: 'Piso 0' },
  { id: '1', label: 'Piso 1' },
  { id: '2', label: 'Piso 2' },
];
