/**
 * Geometry and room data for the HawkStars headquarters 3D model.
 *
 * Traced from the architect's technical floor plans (1600 px wide) and checked against
 * the cut-away views and renders. The plans carry no dimensions: the old building is
 * taken as 11.2 m wide, which puts the whole complex at about 36 × 11 m. Heights come
 * from the sections (≈3.4 m floor to floor). Every measurement is therefore an estimate.
 */

export type Pt = [number, number];
export type Vec3 = [number, number, number];
export type FloorView = 'ext' | '0' | '1' | '2';

/** Plan pixel → metres. */
const K = 11.2 / 461;
export const X = (px: number) => (px - 78) * K;
export const Z = (py: number) => (py - 42) * K;
/** A polygon given in plan pixels. */
export const P = (pts: Pt[]): Pt[] => pts.map(([px, py]) => [X(px), Z(py)]);
export const rect = (x0: number, z0: number, x1: number, z1: number): Pt[] => [
  [x0, z0],
  [x1, z0],
  [x1, z1],
  [x0, z1],
];
/** A rectangle given in plan pixels. */
export const R = (px0: number, py0: number, px1: number, py1: number) =>
  rect(X(px0), Z(py0), X(px1), Z(py1));

export const FH = 3.4; // floor to floor
/**
 * The street climbs steeply along the building. The old building's ground floor is the
 * datum; the atrium is level with its first floor; the new building sits 2.2 m up, so
 * its lowest floor is half-buried on the street side.
 */
export const LV = { L: [0, 3.4, 6.8], R: [2.2, 5.6, 9.0] } as const;
export const ATRIUM = LV.L[1];
export const PL = LV.R[0];
export const R_ROOF = 12.4;
export const L_EAVE = 7.2;
export const L_RIDGE = 10.0;
export const GLASS_ROOF = 7.8;

/** Old building, outer faces. */
export const LX = X(540);
export const LZ = Z(498);
export const LFP: Pt[] = rect(0, 0, LX, LZ);
/** Atrium floor (first-floor level of the old building). */
export const ATRIUM_FP: Pt[] = P([
  [540, 55],
  [852, 52],
  [858, 95],
  [930, 100],
  [950, 268],
  [866, 278],
  [866, 472],
  [540, 472],
]);
/** Atrium envelope, covered by the glass roof. */
export const ATRIUM_OUT: Pt[] = P([
  [540, 42],
  [856, 42],
  [862, 90],
  [985, 78],
  [1048, 474],
  [1010, 490],
  [540, 498],
]);
/** New building, lowest floor (gaming + recording). It runs under the atrium platform. */
export const R0_FP: Pt[] = P([
  [868, 278],
  [950, 268],
  [930, 100],
  [1535, 45],
  [1545, 372],
  [1040, 468],
  [868, 474],
]);
/** New building, upper floors. */
export const RU_FP: Pt[] = P([
  [990, 82],
  [1542, 36],
  [1554, 380],
  [1050, 468],
]);
/** New building, top floor (set back from the street behind a terrace). */
export const R2_FP: Pt[] = P([
  [992, 86],
  [1540, 40],
  [1548, 292],
  [1220, 347],
  [1044, 378],
]);
/** Slab over the lowest floor: the upper building plus the platform that sticks into the atrium. */
export const R1_SLAB: Pt[] = P([
  [868, 278],
  [868, 405],
  [1046, 405],
  [1050, 468],
  [1554, 380],
  [1542, 36],
  [990, 82],
  [930, 100],
  [950, 268],
]);

/** Street level along the building (it only varies along x). */
export const terrain = (x: number) => {
  const t = (v: number) => Math.min(1, Math.max(0, v));
  return t((x - 1) / (X(766) - 1)) * ATRIUM + t((x - X(766)) / 20) * 1.6;
};

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
    at: [X(240), 1.2, Z(280)],
    poly: R(104, 78, 375, 470),
    desc: 'Sala de refeições no rés-do-chão do edifício antigo, com mesas corridas junto à parede e mesas redondas. A porta principal dá para o largo.',
  }),
  room({
    id: 'cozinha',
    floor: '0',
    name: 'Cozinha',
    color: C.dark,
    at: [X(445), 1.2, Z(160)],
    poly: R(380, 78, 510, 240),
    desc: 'Cozinha aberta com balcão de serviço virado para a sala.',
  }),
  room({
    id: 'wc',
    floor: '0',
    name: 'Instalações sanitárias',
    color: C.blue,
    at: [X(445), 1.2, Z(395)],
    poly: R(380, 310, 510, 470),
    desc: 'Três cabines e lavatórios. O corredor ao lado liga à escada que sobe para o átrio.',
  }),
  room({
    id: 'gaming',
    floor: '0',
    name: 'Sala de gaming e criação',
    color: C.ink,
    at: [X(1090), PL + 1.2, Z(260)],
    poly: P([
      [868, 278],
      [950, 268],
      [930, 100],
      [1262, 78],
      [1300, 215],
      [1270, 345],
      [1040, 468],
      [868, 474],
    ]),
    desc: 'Mesa comprida para doze pessoas, canto verde de chroma key, dois simuladores, pufes e ecrãs. Fica meio enterrada do lado da rua e entra por baixo da plataforma do átrio.',
  }),
  room({
    id: 'gravacao',
    floor: '0',
    name: 'Estúdio de gravação',
    color: C.dark,
    at: [X(1410), PL + 1.2, Z(190)],
    poly: P([
      [1262, 78],
      [1535, 45],
      [1545, 372],
      [1270, 420],
      [1270, 345],
      [1300, 215],
    ]),
    desc: 'Estúdio com bateria, cabine de voz em vidro no canto e régie. Paredes em ziguezague para a acústica; abaixo do nível da rua.',
  }),
  room({
    id: 'cowork',
    floor: '1',
    name: 'Cowork',
    color: C.blue,
    at: [X(250), LV.L[1] + 1.2, Z(330)],
    poly: R(104, 195, 512, 470),
    desc: 'Open space com quatro ilhas de secretárias, mesa redonda e duas cabines telefónicas amarelas. Duas portas dão diretamente para o átrio.',
  }),
  room({
    id: 'reunioes1',
    floor: '1',
    name: 'Zona de reuniões',
    color: C.gold,
    at: [X(180), LV.L[1] + 1.2, Z(135)],
    poly: R(104, 78, 268, 190),
    desc: 'Mesa oval para oito pessoas, no topo do cowork.',
  }),
  room({
    id: 'gabinete',
    floor: '1',
    name: 'Gabinete',
    color: C.green,
    at: [X(440), LV.L[1] + 1.2, Z(135)],
    poly: R(372, 78, 510, 190),
    desc: 'Gabinete fechado, ao lado da escada para o sótão.',
  }),
  room({
    id: 'atrio',
    floor: '1',
    name: 'Átrio de entrada',
    color: C.gold,
    at: [X(740), ATRIUM + 1.3, Z(330)],
    poly: ATRIUM_FP,
    desc: 'Pátio coberto com vidro colorido, ao nível do cowork. Entrada pela Travessa do Portão Norte, receção, casas de banho e três escadas: para o restaurante, para a sala de gaming e para as salas de formação.',
  }),
  room({
    id: 'formacao-a',
    floor: '1',
    name: 'Sala de formação A',
    color: C.terra,
    at: [X(1160), LV.R[1] + 1.3, Z(310)],
    poly: P([
      [1010, 210],
      [1268, 165],
      [1310, 395],
      [1052, 440],
    ]),
    desc: 'Sala para cerca de 30 pessoas, com janela para a rua. Entra-se pela plataforma do átrio.',
  }),
  room({
    id: 'formacao-b',
    floor: '1',
    name: 'Sala de formação B',
    color: C.ink,
    at: [X(1410), LV.R[1] + 1.3, Z(220)],
    poly: P([
      [1262, 75],
      [1530, 48],
      [1538, 372],
      [1310, 395],
    ]),
    desc: 'Segunda sala de formação, para cerca de 35 pessoas. As duas salas servem formações e eventos Erasmus+.',
  }),
  room({
    id: 'sotao',
    floor: '2',
    name: 'Sótão e copa',
    color: C.gold,
    at: [X(315), LV.L[2] + 1.0, Z(160)],
    poly: R(190, 78, 440, 238),
    desc: 'Copa sob o telhado, com balcão em L. Na água nascente do telhado ficam os painéis solares.',
  }),
  room({
    id: 'auditorio',
    floor: '2',
    name: 'Sala polivalente',
    color: C.blue,
    at: [X(1230), LV.R[2] + 1.3, Z(250)],
    poly: P([
      [1000, 150],
      [1400, 115],
      [1405, 312],
      [1220, 345],
      [1044, 378],
      [1018, 260],
    ]),
    desc: 'Sala no último piso com cerca de 30 lugares e grandes envidraçados de canto para o terraço.',
  }),
  room({
    id: 'reunioes2',
    floor: '2',
    name: 'Sala de reuniões',
    color: C.ink,
    at: [X(1475), LV.R[2] + 1.3, Z(185)],
    poly: P([
      [1410, 60],
      [1535, 48],
      [1545, 290],
      [1412, 312],
    ]),
    desc: 'Sala de reuniões com mesa oval para oito pessoas.',
  }),
  room({
    id: 'terraco',
    floor: '2',
    name: 'Terraço',
    color: C.green,
    at: [X(1300), LV.R[2] + 0.9, Z(390)],
    poly: P([
      [1044, 378],
      [1220, 347],
      [1548, 292],
      [1554, 380],
      [1050, 468],
    ]),
    desc: 'Terraço do último piso, virado para a Travessa do Portão Norte.',
  }),
  room({
    id: 'edificio-antigo',
    floor: 'ext',
    name: 'Edifício antigo',
    color: C.terra,
    at: [LX / 2, 11.3, LZ / 2],
    poly: LFP,
    desc: 'Casa tradicional recuperada: paredes grossas rebocadas a branco, telhado de telha e chaminé. Restaurante, cowork e sótão.',
  }),
  room({
    id: 'atrio-ext',
    floor: 'ext',
    name: 'Átrio coberto',
    color: C.gold,
    at: [X(760), GLASS_ROOF + 0.9, Z(270)],
    poly: ATRIUM_OUT,
    desc: 'Pátio entre os dois edifícios, coberto por uma estrutura de vidro com painéis coloridos. A entrada fica a meio da subida da travessa.',
  }),
  room({
    id: 'edificio-novo',
    floor: 'ext',
    name: 'Edifício novo',
    color: C.ink,
    at: [X(1290), R_ROOF + 1.6, Z(190)],
    poly: RU_FP,
    desc: 'Volume contemporâneo: piso semienterrado com gaming e estúdio, piso de formação e último piso recuado com terraço.',
  }),
];

export const FLOORS: { id: FloorView; label: string }[] = [
  { id: 'ext', label: 'Exterior' },
  { id: '0', label: 'Piso 0' },
  { id: '1', label: 'Piso 1' },
  { id: '2', label: 'Piso 2' },
];
