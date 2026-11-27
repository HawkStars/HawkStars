/**
 * Room data for the 3D model of the HawkStars headquarters (`/sede-3d`).
 *
 * The model itself is built in Blender (sede_hawkstars.py, exported to public/models/sede-blender.glb)
 * from the architect's floor plans, calibrated against the topographic survey. Each room here has a
 * matching anchor node in the GLB (glTF extras `sala: <id>`), where the viewer puts the room's label
 * and points the camera.
 *
 * Room outlines are traced in plan pixels from the architect's plans; the survey puts the plan scale
 * at 11.2 / 461 × 0.9172 m per pixel (old building ≈ 10.3 × 10.2 m, whole complex ≈ 33 m long).
 * Areas are therefore estimates.
 */

export type Pt = [number, number];
export type FloorView = 'ext' | '0' | '1' | '2';

/** Plan pixel → metres, with the scale fitted to the plot limits of the survey. */
const K = (11.2 / 461) * 0.9172;
const X = (px: number) => (px - 78) * K;
const Z = (py: number) => (py - 42) * K;
const P = (pts: Pt[]): Pt[] => pts.map(([px, py]) => [X(px), Z(py)]);
const R = (px0: number, py0: number, px1: number, py1: number): Pt[] => [
  [X(px0), Z(py0)],
  [X(px1), Z(py0)],
  [X(px1), Z(py1)],
  [X(px0), Z(py1)],
];

const polygonArea = (pts: Pt[]) => {
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
  desc: string;
  /** Floor area in m² (estimate). */
  area: number;
};

const room = ({ poly, ...r }: Omit<Room, 'area'> & { poly: Pt[] }): Room => ({
  ...r,
  area: Math.round(polygonArea(poly)),
});

export const ROOMS: Room[] = [
  room({
    id: 'restaurante',
    floor: '0',
    name: 'Restaurante e cafetaria',
    color: C.terra,
    poly: R(104, 78, 375, 470),
    desc: 'Sala de refeições no rés-do-chão do edifício antigo, com mesas corridas junto à parede e mesas redondas. A porta principal dá para o largo.',
  }),
  room({
    id: 'cozinha',
    floor: '0',
    name: 'Cozinha',
    color: C.dark,
    poly: R(380, 78, 510, 240),
    desc: 'Cozinha aberta com balcão de serviço virado para a sala.',
  }),
  room({
    id: 'wc',
    floor: '0',
    name: 'Instalações sanitárias',
    color: C.blue,
    poly: R(380, 310, 510, 470),
    desc: 'Três cabines e lavatórios. O corredor ao lado liga à escada que sobe para o átrio.',
  }),
  room({
    id: 'gaming',
    floor: '0',
    name: 'Sala de gaming e criação',
    color: C.ink,
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
    desc: 'Mesa comprida para doze pessoas, canto verde de chroma key, dois simuladores, pufes e ecrãs. Fica meio enterrada do lado da rua; uma escada curta sobe para o átrio.',
  }),
  room({
    id: 'gravacao',
    floor: '0',
    name: 'Estúdio de gravação',
    color: C.dark,
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
    poly: R(104, 195, 512, 470),
    desc: 'Open space com quatro ilhas de secretárias, mesa redonda e duas cabines telefónicas amarelas. Duas portas dão diretamente para o átrio.',
  }),
  room({
    id: 'reunioes1',
    floor: '1',
    name: 'Zona de reuniões',
    color: C.gold,
    poly: R(104, 78, 268, 190),
    desc: 'Mesa oval para oito pessoas, no topo do cowork.',
  }),
  room({
    id: 'gabinete',
    floor: '1',
    name: 'Gabinete',
    color: C.green,
    poly: R(372, 78, 510, 190),
    desc: 'Gabinete fechado, ao lado da escada que sobe para o sótão.',
  }),
  room({
    id: 'atrio',
    floor: '1',
    name: 'Átrio de entrada',
    color: C.gold,
    poly: P([
      [540, 55],
      [852, 52],
      [858, 95],
      [930, 100],
      [950, 268],
      [866, 278],
      [866, 472],
      [540, 472],
    ]),
    desc: 'Pátio coberto com vidro colorido, ao nível do cowork. Entrada pela Travessa do Portão Norte, receção, casas de banho e três escadas: para o restaurante, para a sala de gaming e para as salas de formação.',
  }),
  room({
    id: 'formacao-a',
    floor: '1',
    name: 'Sala de formação A',
    color: C.terra,
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
    poly: R(190, 78, 440, 238),
    desc: 'Copa sob o telhado, com balcão em L, servida pela escada do cowork. Na água nascente do telhado ficam os painéis solares.',
  }),
  room({
    id: 'auditorio',
    floor: '2',
    name: 'Sala polivalente',
    color: C.blue,
    poly: P([
      [1000, 150],
      [1400, 115],
      [1405, 312],
      [1220, 345],
      [1044, 378],
      [1018, 260],
    ]),
    desc: 'Sala no último piso com cerca de 30 lugares e grandes envidraçados de canto para o terraço. A escada das salas de formação chega aqui.',
  }),
  room({
    id: 'reunioes2',
    floor: '2',
    name: 'Sala de reuniões',
    color: C.ink,
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
    poly: R(78, 42, 540, 498),
    desc: 'Casa tradicional recuperada: paredes grossas rebocadas a branco, telhado de telha e chaminé. Restaurante, cowork e sótão.',
  }),
  room({
    id: 'atrio-ext',
    floor: 'ext',
    name: 'Átrio coberto',
    color: C.gold,
    poly: P([
      [540, 42],
      [856, 42],
      [862, 90],
      [985, 78],
      [1048, 474],
      [1010, 490],
      [540, 498],
    ]),
    desc: 'Pátio entre os dois edifícios, coberto por uma estrutura de vidro com painéis coloridos. A entrada fica a meio da subida da travessa.',
  }),
  room({
    id: 'edificio-novo',
    floor: 'ext',
    name: 'Edifício novo',
    color: C.ink,
    poly: P([
      [990, 82],
      [1542, 36],
      [1554, 380],
      [1050, 468],
    ]),
    desc: 'Volume contemporâneo: piso semienterrado com gaming e estúdio, piso de formação e último piso recuado com terraço.',
  }),
];

export const FLOORS: { id: FloorView; label: string }[] = [
  { id: 'ext', label: 'Exterior' },
  { id: '0', label: 'Piso 0' },
  { id: '1', label: 'Piso 1' },
  { id: '2', label: 'Piso 2' },
];
