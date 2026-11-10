import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  ATRIUM,
  ATRIUM_FP,
  FH,
  GLASS_ROOF,
  L_EAVE,
  L_RIDGE,
  LV,
  LX,
  LZ,
  P,
  PL,
  R,
  R0_FP,
  R1_SLAB,
  R2_FP,
  R_ROOF,
  ROOMS,
  RU_FP,
  X,
  Z,
  rect,
  terrain,
  type FloorView,
  type Pt,
  type Vec3,
} from './data';

/**
 * Builds the HawkStars headquarters model and drives it. Imperative on purpose: it owns
 * a WebGL canvas and the floating room labels, and the React component only calls the
 * methods below. Import it dynamically so three.js never runs on the server.
 */
export type SedeScene = {
  setView: (view: FloorView) => void;
  focusRoom: (id: string) => void;
  setFurniture: (on: boolean) => void;
  setLabels: (on: boolean) => void;
  setContext: (on: boolean) => void;
  setSun: (hour: number) => void;
  resize: () => void;
  dispose: () => void;
};

type SceneOptions = {
  container: HTMLElement;
  labels: HTMLElement;
  panel: HTMLElement;
  onSelectRoom: (id: string) => void;
};

type Shape = 'box' | 'cyl' | 'sph' | 'cone';
type PartFn = (
  mat: THREE.Material,
  cx: number,
  cy: number,
  cz: number,
  sx: number,
  sy: number,
  sz: number,
  rx?: number,
  ry?: number,
  rz?: number
) => Builder;
type Builder = Record<Shape, PartFn>;
type Opening = {
  w: number;
  f?: number;
  x?: number;
  z?: number;
  lo?: number;
  hi?: number;
  door?: 'glass' | 'wood';
};
/** Section planes: one per building zone, plus the ground and neighbours. */
type Zone = 'L' | 'M' | 'R' | 'G';
type GroupKey =
  'L0' | 'L1' | 'L2' | 'Lroof' | 'M0' | 'M1' | 'Mroof' | 'R0' | 'R1' | 'R2' | 'Rroof' | 'context';

const SKY = 0xe6eef0;
const CENTER = new THREE.Vector3(18, 5, 5.5);
const TW = 0.6; // old stone walls
const TI = 0.15; // partitions
const TN = 0.3; // new walls
const NARROW = 768; // matches Tailwind `md`, where the panel moves from the bottom to the side

const VIEWS: Record<
  FloorView,
  { show: GroupKey[]; cut: Record<Zone, number>; cam: Vec3; target: Vec3 }
> = {
  ext: {
    show: ['L0', 'L1', 'L2', 'Lroof', 'M0', 'M1', 'Mroof', 'R0', 'R1', 'R2', 'Rroof'],
    cut: { L: 1e4, M: 1e4, R: 1e4, G: 1e4 },
    cam: [-10, 24, 42],
    target: [18, 6, 5.5],
  },
  // Restaurant level, plus the new building's half-buried floor; the ground is cut with it.
  '0': {
    show: ['L0', 'M0', 'R0'],
    cut: { L: 1.7, M: 1.7, R: PL + 1.7, G: PL + 1.7 },
    cam: [17, 40, 34],
    target: [18, 1, 5.2],
  },
  '1': {
    show: ['L0', 'L1', 'M0', 'M1', 'R0', 'R1'],
    cut: { L: LV.L[1] + 1.7, M: LV.L[1] + 1.7, R: LV.R[1] + 1.7, G: 1e4 },
    cam: [17, 44, 34],
    target: [18, 4.5, 5.2],
  },
  '2': {
    show: ['L0', 'L1', 'L2', 'M0', 'M1', 'R0', 'R1', 'R2'],
    cut: { L: LV.L[2] + 0.45, M: 1e4, R: LV.R[2] + 1.7, G: 1e4 },
    cam: [17, 48, 34],
    target: [18, 8, 5.2],
  },
};

const std = (color: number, o: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    metalness: 0,
    envMapIntensity: 0.45,
    ...o,
  });

const canvasTexture = (draw: (g: CanvasRenderingContext2D) => void, repeat = 1) => {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const g = c.getContext('2d');
  if (g) draw(g);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};

export function createSedeScene({
  container,
  labels,
  panel,
  onSelectRoom,
}: SceneOptions): SedeScene {
  // ---------- Renderer / scene ----------
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.touchAction = 'none';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(SKY);
  scene.fog = new THREE.Fog(SKY, 150, 300);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;

  // A near plane of 0.5 m (the camera never gets closer than 6 m) keeps depth precision high.
  const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 500);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.minDistance = 6;
  controls.maxDistance = 180;

  // ---------- Materials ----------
  const clipPlanes: Record<Zone, THREE.Plane> = {
    L: new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e4),
    M: new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e4),
    R: new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e4),
    G: new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e4),
  };
  const zoneMats = (zone: Exclude<Zone, 'G'>) => ({
    wall: std(0xeeebe5, {
      roughness: 0.95,
      clippingPlanes: [clipPlanes[zone]],
      clipShadows: true,
      side: THREE.DoubleSide,
    }),
    dark: std(0x2c3036, {
      roughness: 0.9,
      clippingPlanes: [clipPlanes[zone]],
      clipShadows: true,
      side: THREE.DoubleSide,
    }),
    glass: new THREE.MeshStandardMaterial({
      color: 0xa9cddc,
      roughness: 0.05,
      metalness: 0.2,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      clippingPlanes: [clipPlanes[zone]],
    }),
  });
  const Zm = { L: zoneMats('L'), M: zoneMats('M'), R: zoneMats('R') };

  const tileTex = canvasTexture((g) => {
    g.fillStyle = '#c0623d';
    g.fillRect(0, 0, 128, 128);
    for (let r = 0; r < 8; r++) {
      g.fillStyle = r % 2 ? '#b65a37' : '#c86c44';
      g.fillRect(0, r * 16, 128, 13);
      g.fillStyle = 'rgba(70,25,10,.35)';
      g.fillRect(0, r * 16 + 13, 128, 3);
      for (let k = 0; k < 6; k++) {
        g.fillStyle = 'rgba(70,25,10,.18)';
        g.fillRect((k * 22 + (r % 2) * 11) % 128, r * 16, 2, 13);
      }
    }
  });
  const cobbleTex = canvasTexture((g) => {
    g.fillStyle = '#a7a39b';
    g.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 128; y += 16)
      for (let x = 0; x < 128; x += 16) {
        const v = 150 + ((x * 7 + y * 13) % 40);
        g.fillStyle = `rgb(${v},${v - 4},${v - 10})`;
        g.fillRect(x + 1 + ((y / 16) % 2) * 4, y + 1, 13, 13);
      }
  });

  const transparent = (color: number, opacity: number) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

  const M = {
    wood: std(0xb88b5c, { roughness: 0.7 }),
    woodDark: std(0x5a4330, { roughness: 0.7 }),
    oak: std(0xd2ac78, { roughness: 0.6 }),
    concrete: std(0xcfcdc8, { roughness: 0.95 }),
    patio: std(0xdedbd4, { roughness: 0.95 }),
    slabEdge: std(0xe9e6e0),
    greyFloor: std(0xa9b0b6, { roughness: 0.9 }),
    frame: std(0x33373c, { roughness: 0.5, metalness: 0.3 }),
    white: std(0xf7f7f5, { roughness: 0.6 }),
    black: std(0x24272b, { roughness: 0.6 }),
    blue: std(0x6f93c6, { roughness: 0.6 }),
    blueDark: std(0x3f5f95, { roughness: 0.6 }),
    yellow: std(0xe8b52f, { roughness: 0.6 }),
    green: std(0x2f6f4e, { roughness: 0.7 }),
    chroma: std(0x22b14c, { roughness: 0.8 }),
    purple: std(0x5a4fb3, { roughness: 0.6 }),
    leaf: std(0x4f8a3c, { roughness: 0.8 }),
    leaf2: std(0x6aa84f, { roughness: 0.8 }),
    pot: std(0xe9e4dc, { roughness: 0.8 }),
    steel: std(0x9aa1a8, { roughness: 0.35, metalness: 0.7 }),
    screen: std(0x12161b, {
      roughness: 0.25,
      metalness: 0.2,
      emissive: 0x1d2a3a,
      emissiveIntensity: 0.6,
    }),
    brass: std(0xd1a640, { roughness: 0.3, metalness: 0.8 }),
    drum: std(0xeeeeee, { roughness: 0.4 }),
    porcelain: std(0xffffff, { roughness: 0.2 }),
    rugBlue: std(0x5f86c2, { roughness: 1 }),
    rugBeige: std(0xd9c49c, { roughness: 1 }),
    panel: std(0x1d2a52, { roughness: 0.3, metalness: 0.5 }),
    greenRoof: std(0x6f9a4a, { roughness: 1 }),
    plinth: std(0xd8d2c6, { roughness: 1 }),
    neighbor: std(0xe7e2da, {
      roughness: 1,
      clippingPlanes: [clipPlanes.G],
      side: THREE.DoubleSide,
    }),
    neighborRoof: std(0xb8775a, { roughness: 1, clippingPlanes: [clipPlanes.G] }),
    tile: std(0xffffff, { map: tileTex, roughness: 0.8, side: THREE.DoubleSide }),
    cobble: std(0xffffff, { map: cobbleTex, roughness: 1, clippingPlanes: [clipPlanes.G] }),
    railGlass: transparent(0xbfdbe6, 0.25),
    tintYellow: transparent(0xf2c94c, 0.55),
    tintBlue: transparent(0x5b8fd6, 0.5),
    tintGreen: transparent(0x7cc46a, 0.5),
  };

  // ---------- Groups: one per zone and level, so floors can be shown and hidden ----------
  const root = new THREE.Group();
  scene.add(root);
  const groupKeys: GroupKey[] = [
    'L0',
    'L1',
    'L2',
    'Lroof',
    'M0',
    'M1',
    'Mroof',
    'R0',
    'R1',
    'R2',
    'Rroof',
    'context',
  ];
  const G = Object.fromEntries(groupKeys.map((k) => [k, new THREE.Group()])) as Record<
    GroupKey,
    THREE.Group
  >;
  groupKeys.forEach((k) => root.add(G[k]));
  const furnKeys = ['L0', 'L1', 'L2', 'M0', 'M1', 'R0', 'R1', 'R2', 'Rroof', 'Lroof'] as const;
  type FurnKey = (typeof furnKeys)[number];
  const fg = Object.fromEntries(furnKeys.map((k) => [k, new THREE.Group()])) as Record<
    FurnKey,
    THREE.Group
  >;
  furnKeys.forEach((k) => G[k].add(fg[k]));

  const shadow = <T extends THREE.Object3D>(m: T) => {
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  // ---------- Instanced furniture: one draw call per (group, shape, material) ----------
  const UNIT: Record<Shape, THREE.BufferGeometry> = {
    box: new THREE.BoxGeometry(1, 1, 1),
    cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 20),
    sph: new THREE.SphereGeometry(0.5, 18, 12),
    cone: new THREE.ConeGeometry(0.5, 1, 18),
  };
  const batches = new Map<
    string,
    { group: THREE.Group; shape: Shape; mat: THREE.Material; list: THREE.Matrix4[] }
  >();
  const _m = new THREE.Matrix4();
  const _p = new THREE.Matrix4();
  const _q = new THREE.Quaternion();
  const _e = new THREE.Euler();
  const _v = new THREE.Vector3();
  const _s = new THREE.Vector3();

  /** An object placed at (x, y, z) and turned by ry; its parts use local metres. */
  const obj = (group: THREE.Group, x: number, y: number, z: number, ry = 0): Builder => {
    const base = new THREE.Matrix4().compose(
      new THREE.Vector3(x, y, z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)),
      new THREE.Vector3(1, 1, 1)
    );
    const put =
      (shape: Shape): PartFn =>
      (mat, cx, cy, cz, sx, sy, sz, rx = 0, ry2 = 0, rz = 0) => {
        _p.compose(_v.set(cx, cy, cz), _q.setFromEuler(_e.set(rx, ry2, rz)), _s.set(sx, sy, sz));
        _m.multiplyMatrices(base, _p);
        const key = `${group.uuid}|${shape}|${mat.uuid}`;
        const b = batches.get(key) ?? { group, shape, mat, list: [] };
        batches.set(key, b);
        b.list.push(_m.clone());
        return api;
      };
    const api: Builder = { box: put('box'), cyl: put('cyl'), sph: put('sph'), cone: put('cone') };
    return api;
  };
  const flushInstances = () => {
    for (const b of batches.values()) {
      const im = new THREE.InstancedMesh(UNIT[b.shape], b.mat, b.list.length);
      b.list.forEach((mx, i) => im.setMatrixAt(i, mx));
      b.group.add(shadow(im));
    }
    batches.clear();
  };

  // ---------- Furniture vocabulary ----------
  type G3 = THREE.Group;
  type Mat = THREE.Material;
  const F = {
    chair(
      g: G3,
      x: number,
      y: number,
      z: number,
      ry: number,
      seat: Mat = M.blue,
      legs: Mat = M.steel
    ) {
      obj(g, x, y, z, ry)
        .box(seat, 0, 0.46, 0, 0.46, 0.06, 0.44)
        .box(seat, 0, 0.75, -0.2, 0.44, 0.48, 0.05, -0.08)
        .box(legs, -0.19, 0.22, -0.18, 0.03, 0.44, 0.03)
        .box(legs, 0.19, 0.22, -0.18, 0.03, 0.44, 0.03)
        .box(legs, -0.19, 0.22, 0.18, 0.03, 0.44, 0.03)
        .box(legs, 0.19, 0.22, 0.18, 0.03, 0.44, 0.03);
    },
    officeChair(g: G3, x: number, y: number, z: number, ry: number, seat: Mat = M.blue) {
      obj(g, x, y, z, ry)
        .box(seat, 0, 0.48, 0, 0.5, 0.08, 0.48)
        .box(seat, 0, 0.82, -0.23, 0.48, 0.55, 0.06, -0.1)
        .cyl(M.steel, 0, 0.26, 0, 0.05, 0.42, 0.05)
        .box(M.steel, 0, 0.05, 0, 0.6, 0.04, 0.06)
        .box(M.steel, 0, 0.05, 0, 0.06, 0.04, 0.6);
    },
    table(
      g: G3,
      x: number,
      y: number,
      z: number,
      w: number,
      d: number,
      ry = 0,
      top: Mat = M.oak,
      h = 0.75,
      legs: Mat = M.black
    ) {
      const o = obj(g, x, y, z, ry).box(top, 0, h - 0.02, 0, w, 0.04, d);
      const lx = w / 2 - 0.06;
      const lz = d / 2 - 0.06;
      for (const [a, b] of [
        [-lx, -lz],
        [lx, -lz],
        [-lx, lz],
        [lx, lz],
      ])
        o.box(legs, a, (h - 0.04) / 2, b, 0.05, h - 0.04, 0.05);
    },
    roundTable(g: G3, x: number, y: number, z: number, r: number, top: Mat = M.white, h = 0.75) {
      obj(g, x, y, z)
        .cyl(top, 0, h - 0.02, 0, r * 2, 0.04, r * 2)
        .cyl(M.black, 0, h / 2, 0, 0.07, h, 0.07)
        .cyl(M.black, 0, 0.02, 0, 0.5, 0.03, 0.5);
    },
    desk(g: G3, x: number, y: number, z: number, w: number, d: number, ry = 0, top: Mat = M.blue) {
      F.table(g, x, y, z, w, d, ry, top, 0.75, M.black);
      obj(g, x, y, z, ry).box(top, 0, 0.45, 0, w - 0.1, 0.5, 0.02);
    },
    monitor(g: G3, x: number, y: number, z: number, ry = 0) {
      obj(g, x, y, z, ry)
        .box(M.screen, 0, 1.06, 0, 0.6, 0.38, 0.03)
        .box(M.steel, 0, 0.84, 0.03, 0.05, 0.16, 0.05)
        .box(M.steel, 0, 0.76, 0.03, 0.22, 0.01, 0.16);
    },
    sofa(g: G3, x: number, y: number, z: number, w: number, ry = 0, mat: Mat = M.blueDark) {
      obj(g, x, y, z, ry)
        .box(mat, 0, 0.22, 0, w, 0.44, 0.85)
        .box(mat, 0, 0.62, -0.34, w, 0.5, 0.18)
        .box(mat, -w / 2 + 0.09, 0.5, 0, 0.18, 0.28, 0.85)
        .box(mat, w / 2 - 0.09, 0.5, 0, 0.18, 0.28, 0.85);
    },
    bench(
      g: G3,
      x: number,
      y: number,
      z: number,
      w: number,
      d: number,
      ry = 0,
      mat: Mat = M.green
    ) {
      obj(g, x, y, z, ry)
        .box(mat, 0, 0.23, 0, w, 0.46, d)
        .box(mat, 0, 0.7, -d / 2 + 0.08, w, 0.5, 0.16);
    },
    pouf(g: G3, x: number, y: number, z: number, r = 0.25, mat: Mat = M.yellow) {
      obj(g, x, y, z).cyl(mat, 0, 0.21, 0, r * 2, 0.42, r * 2);
    },
    beanbag(g: G3, x: number, y: number, z: number, mat: Mat = M.black) {
      obj(g, x, y, z)
        .sph(mat, 0, 0.32, 0, 1.0, 0.65, 0.95)
        .sph(mat, 0, 0.62, -0.25, 0.8, 0.5, 0.45);
    },
    plant(g: G3, x: number, y: number, z: number, s = 1) {
      obj(g, x, y, z)
        .cyl(M.pot, 0, 0.22 * s, 0, 0.42 * s, 0.44 * s, 0.42 * s)
        .sph(M.leaf, 0, 0.75 * s, 0, 0.75 * s, 0.75 * s, 0.75 * s)
        .sph(M.leaf2, 0.18 * s, 1.0 * s, 0.08 * s, 0.5 * s, 0.55 * s, 0.5 * s)
        .sph(M.leaf, -0.15 * s, 1.15 * s, -0.1 * s, 0.4 * s, 0.45 * s, 0.4 * s);
    },
    tree(g: G3, x: number, y: number, z: number, s = 1) {
      obj(g, x, y, z)
        .cyl(M.woodDark, 0, 1.2 * s, 0, 0.18 * s, 2.4 * s, 0.18 * s)
        .sph(M.leaf, 0, 3.0 * s, 0, 2.6 * s, 2.2 * s, 2.6 * s)
        .sph(M.leaf2, 0.6 * s, 3.5 * s, 0.3 * s, 1.6 * s, 1.4 * s, 1.6 * s);
    },
    planter(g: G3, x: number, y: number, z: number, w: number, d: number) {
      const o = obj(g, x, y, z).box(M.white, 0, 0.4, 0, w, 0.8, d);
      const n = Math.max(2, Math.round(w * d * 2.2));
      for (let i = 0; i < n; i++) {
        const px = Math.sin(i * 12.9898 + x) * 0.5 * (w - 0.4);
        const pz = Math.sin(i * 78.233 + z) * 0.5 * (d - 0.4);
        const s = 0.45 + ((i * 37) % 10) / 25;
        o.sph(i % 2 ? M.leaf : M.leaf2, px, 0.85 + s * 0.4, pz, s, s * 1.3, s);
      }
    },
    rug(g: G3, x: number, y: number, z: number, rx: number, rz: number, mat: Mat, ry = 0) {
      obj(g, x, y, z, ry).cyl(mat, 0, 0.01, 0, rx * 2, 0.02, rz * 2);
    },
    /** Straight stair climbing along `dir` from y0 to y1 inside the given rectangle. */
    stair(
      g: G3,
      x0: number,
      z0: number,
      x1: number,
      z1: number,
      y0: number,
      y1: number,
      dir: '+x' | '-x' | '+z' | '-z',
      mat: Mat = M.oak,
      rail = true
    ) {
      const steps = Math.max(2, Math.round((y1 - y0) / 0.18));
      const alongX = dir[1] === 'x';
      const along = alongX ? x1 - x0 : z1 - z0;
      const across = alongX ? z1 - z0 : x1 - x0;
      const run = Math.abs(along) / steps;
      const o = obj(g, 0, 0, 0);
      for (let i = 0; i < steps; i++) {
        const h = y0 + ((i + 1) * (y1 - y0)) / steps;
        const t = dir[0] === '+' ? i : steps - 1 - i;
        if (alongX)
          o.box(
            mat,
            Math.min(x0, x1) + run * (t + 0.5),
            (y0 + h) / 2,
            (z0 + z1) / 2,
            run,
            h - y0,
            Math.abs(across)
          );
        else
          o.box(
            mat,
            (x0 + x1) / 2,
            (y0 + h) / 2,
            Math.min(z0, z1) + run * (t + 0.5),
            Math.abs(across),
            h - y0,
            run
          );
      }
      if (!rail) return;
      const len = Math.hypot(Math.abs(along), y1 - y0);
      const ang = Math.atan2(y1 - y0, Math.abs(along)) * (dir[0] === '+' ? 1 : -1);
      if (alongX)
        o.box(
          M.frame,
          (x0 + x1) / 2,
          (y0 + y1) / 2 + 0.95,
          Math.max(z0, z1),
          len,
          0.04,
          0.04,
          0,
          0,
          ang
        );
      else
        o.box(
          M.frame,
          Math.max(x0, x1),
          (y0 + y1) / 2 + 0.95,
          (z0 + z1) / 2,
          0.04,
          0.04,
          len,
          -ang,
          0,
          0
        );
    },
    railing(g: G3, x0: number, z0: number, x1: number, z1: number, y: number) {
      const len = Math.hypot(x1 - x0, z1 - z0);
      const ang = -Math.atan2(z1 - z0, x1 - x0);
      obj(g, (x0 + x1) / 2, y, (z0 + z1) / 2, ang)
        .box(M.railGlass, 0, 0.5, 0, len, 1.0, 0.02)
        .box(M.frame, 0, 1.02, 0, len, 0.05, 0.06);
    },
    shelf(g: G3, x: number, y: number, z: number, w: number, h: number, ry = 0) {
      const o = obj(g, x, y, z, ry);
      for (let i = 0; i <= 4; i++) o.box(M.oak, 0, (h / 4) * i + 0.02, 0, w, 0.03, 0.35);
      o.box(M.oak, -w / 2, h / 2, 0, 0.03, h, 0.35).box(M.oak, w / 2, h / 2, 0, 0.03, h, 0.35);
    },
    screenWall(g: G3, x: number, y: number, z: number, w: number, ry = 0, h = 1.1, at = 1.4) {
      obj(g, x, y, z, ry).box(M.screen, 0, at, 0, w, h, 0.05);
    },
    toilet(g: G3, x: number, y: number, z: number, ry: number) {
      obj(g, x, y, z, ry)
        .box(M.porcelain, 0, 0.2, 0.05, 0.38, 0.4, 0.55)
        .box(M.porcelain, 0, 0.6, -0.22, 0.4, 0.4, 0.16);
    },
    drums(g: G3, x: number, y: number, z: number) {
      obj(g, x, y, z)
        .cyl(M.drum, 0, 0.3, 0, 0.55, 0.45, 0.55, Math.PI / 2, 0, 0)
        .cyl(M.drum, -0.45, 0.6, 0.15, 0.36, 0.18, 0.36)
        .cyl(M.drum, 0.45, 0.55, 0.2, 0.4, 0.2, 0.4)
        .cyl(M.drum, 0.1, 0.75, -0.25, 0.3, 0.2, 0.3)
        .cyl(M.drum, -0.15, 0.75, -0.3, 0.3, 0.2, 0.3)
        .cyl(M.brass, -0.8, 1.15, -0.2, 0.45, 0.01, 0.45)
        .cyl(M.brass, 0.8, 1.2, -0.25, 0.5, 0.01, 0.5)
        .cyl(M.brass, -0.7, 0.9, 0.35, 0.34, 0.01, 0.34)
        .cyl(M.steel, -0.8, 0.57, -0.2, 0.02, 1.14, 0.02)
        .cyl(M.steel, 0.8, 0.6, -0.25, 0.02, 1.2, 0.02);
    },
    trackLight(g: G3, x0: number, x1: number, z: number, y: number) {
      const o = obj(g, 0, 0, 0).box(M.black, (x0 + x1) / 2, y - 0.03, z, x1 - x0, 0.05, 0.05);
      for (let x = x0 + 0.4; x < x1; x += 1.1) o.cyl(M.black, x, y - 0.18, z, 0.1, 0.22, 0.1);
    },
  };

  // ---------- Construction helpers ----------
  const unitMesh = (mat: Mat, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const mesh = shadow(new THREE.Mesh(UNIT.box, mat));
    mesh.scale.set(w, h, d);
    mesh.position.set(x, y, z);
    return mesh;
  };
  /** A straight wall from (x1, z1) to (x2, z2) with doors and windows cut out of it. */
  const wall = (
    group: G3,
    mat: Mat,
    x1: number,
    z1: number,
    x2: number,
    z2: number,
    y0: number,
    h: number,
    t: number,
    openings: Opening[] = [],
    glass: Mat | null = null
  ) => {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const L = Math.hypot(dx, dz);
    const g = new THREE.Group();
    g.position.set(x1, y0, z1);
    g.rotation.y = -Math.atan2(dz, dx);
    const ops = openings
      .map((o) => {
        const at =
          o.f != null
            ? o.f * L
            : o.x != null
              ? ((o.x - x1) / dx) * L
              : (((o.z ?? 0) - z1) / dz) * L;
        const lo = o.lo ?? 0;
        return {
          a: Math.max(0, at - o.w / 2),
          b: Math.min(L, at + o.w / 2),
          lo,
          hi: o.hi ?? 2.2,
          window: lo > 0,
          door: o.door,
        };
      })
      .sort((p, q) => p.a - q.a);
    const box = (a: number, b: number, lo: number, hi: number, m: Mat = mat, th = t) => {
      if (b - a < 0.01 || hi - lo < 0.01) return;
      g.add(unitMesh(m, b - a, hi - lo, th, (a + b) / 2, (lo + hi) / 2, 0));
    };
    let cur = 0;
    for (const o of ops) {
      box(cur, o.a, 0, h);
      box(o.a, o.b, 0, o.lo);
      box(o.a, o.b, o.hi, h);
      const mid = (o.a + o.b) / 2;
      if (glass && (o.window || o.door === 'glass')) {
        const pane = new THREE.Mesh(UNIT.box, glass);
        pane.scale.set(o.b - o.a, o.hi - o.lo, 0.03);
        pane.position.set(mid, (o.lo + o.hi) / 2, 0);
        g.add(pane);
        // Sill and lintel stand proud of the wall. Sharing a plane with the wall faces
        // around the opening makes the two surfaces flicker as the camera moves (z-fighting).
        if (o.window) box(o.a, o.b, o.lo - 0.03, o.lo + 0.03, M.frame, t + 0.06);
        else {
          box(o.a, o.b, o.hi - 0.06, o.hi, M.frame, 0.1);
          box(mid - 0.02, mid + 0.02, o.lo, o.hi, M.frame, 0.08);
        }
      }
      if (o.door === 'wood') box(o.a, o.b, o.lo, o.hi, M.frame, 0.06);
      cur = o.b;
    }
    box(cur, L, 0, h);
    group.add(g);
  };
  /** A horizontal slab whose top face sits at y, optionally with openings. */
  const poly = (group: G3, pts: Pt[], y: number, th: number, mat: Mat, holes: Pt[][] = []) => {
    const ring = (r: Pt[]) => r.map(([x, z]) => new THREE.Vector2(x, -z));
    const sh = new THREE.Shape(ring(pts));
    holes.forEach((h) => sh.holes.push(new THREE.Path(ring(h))));
    const geo = new THREE.ExtrudeGeometry(sh, { depth: th, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    const m = shadow(new THREE.Mesh(geo, mat));
    m.position.y = y - th;
    group.add(m);
  };

  const WL = Zm.L.wall;
  const GL = Zm.L.glass;
  const win = (at: number, axis: 'x' | 'z', w = 1.1, lo = 0.9, hi = 2.4): Opening => ({
    [axis]: at,
    w,
    lo,
    hi,
  });
  const fwin = (f: number, w = 1.2, lo = 0.9, hi = 2.6): Opening => ({ f, w, lo, hi });
  /** Walls along a polyline given in plan pixels. */
  const wallLine = (group: G3, mat: Mat, pts: Pt[], y0: number, h: number, t: number) => {
    for (let i = 0; i < pts.length - 1; i++)
      wall(group, mat, X(pts[i][0]), Z(pts[i][1]), X(pts[i + 1][0]), Z(pts[i + 1][1]), y0, h, t);
  };
  const E = Math.PI / 2; // a chair turned to face east (+x)
  const W = -Math.PI / 2;
  const N = Math.PI; // facing north (−z)

  // =========================================================
  // OLD BUILDING — restaurant, cowork, attic
  // =========================================================
  // Wall centre lines, 0.3 m inside the outer faces.
  const lw = 0.3;
  const le = LX - 0.3;
  const ln = 0.4;
  const ls = LZ - 0.3;
  /** Floor slabs stop inside the walls, so their edges never show on the façade. */
  const LIN = rect(0.15, 0.15, LX - 0.15, LZ - 0.15);

  // ----- Piso 0: restaurant -----
  poly(G.L0, LIN, 0.02, 0.2, M.wood);
  wall(G.L0, WL, lw, ln, le, ln, 0, FH, 0.8);
  // street side: half-buried towards the atrium, so one high window only
  wall(G.L0, WL, lw, ls, le, ls, 0, FH, TW, [win(X(322), 'x', 1.4, 1.5, 2.7)], GL);
  // end façade on the square: the main door between two windows
  wall(
    G.L0,
    WL,
    lw,
    ln,
    lw,
    ls,
    0,
    FH,
    TW,
    [win(Z(157), 'z'), { z: Z(268), w: 1.6, hi: 2.5, door: 'wood' }, win(Z(385), 'z', 1.2)],
    GL
  );
  wall(G.L0, WL, le, ln, le, ls, 0, FH, TW, [{ z: Z(272), w: 1.3, door: 'glass' }], GL);
  // kitchen / corridor / WC
  wall(G.L0, WL, X(378), Z(242), X(512), Z(242), 0, FH, TI);
  wall(G.L0, WL, X(378), Z(310), X(512), Z(310), 0, FH, TI, [{ x: X(478), w: 0.9 }]);
  wall(G.L0, WL, X(378), Z(310), X(378), Z(470), 0, FH, TI);
  // dining room
  obj(fg.L0, 0, 0.02, 0).box(M.green, X(235), 0.25, Z(86), 6.3, 0.5, 0.45);
  for (const px of [135, 233, 335]) {
    F.table(fg.L0, X(px), 0.02, Z(118), 1.4, 0.9, 0, M.white);
    F.chair(fg.L0, X(px) - 0.35, 0.02, Z(152), N, M.oak);
    F.chair(fg.L0, X(px) + 0.35, 0.02, Z(152), N, M.oak);
  }
  for (const px of [180, 290]) {
    const x = X(px);
    const z = Z(205);
    F.table(fg.L0, x, 0.02, z, 1.2, 1.4, 0, M.white);
    for (const dz of [-0.35, 0.35]) {
      F.chair(fg.L0, x - 0.95, 0.02, z + dz, E, M.oak);
      F.chair(fg.L0, x + 0.95, 0.02, z + dz, W, M.oak);
    }
  }
  F.roundTable(fg.L0, X(300), 0.02, Z(335), 0.6, M.white);
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + 0.6;
    F.chair(fg.L0, X(300) + Math.cos(a) * 0.95, 0.02, Z(335) + Math.sin(a) * 0.95, -a - E, M.oak);
  }
  F.table(fg.L0, X(180), 0.02, Z(348), 0.9, 0.6, 0, M.white);
  F.chair(fg.L0, X(180) - 0.75, 0.02, Z(348), E, M.oak);
  F.chair(fg.L0, X(180) + 0.75, 0.02, Z(348), W, M.oak);
  for (const px of [148, 322]) {
    F.roundTable(fg.L0, X(px), 0.02, Z(428), 0.65, M.white);
    for (const a of [-2.6, -1.57, -0.55]) {
      F.chair(fg.L0, X(px) + Math.cos(a) * 1.0, 0.02, Z(428) + Math.sin(a) * 1.0, -a - E, M.oak);
    }
  }
  F.table(fg.L0, X(236), 0.02, Z(432), 0.6, 0.8, 0, M.white);
  // kitchen: counters along two walls and a serving counter towards the room
  obj(fg.L0, 0, 0.02, 0)
    .box(M.black, X(452), 0.45, Z(92), 2.6, 0.9, 0.65)
    .box(M.steel, X(452), 0.91, Z(92), 2.6, 0.03, 0.66)
    .box(M.black, X(497), 0.45, Z(172), 0.65, 0.9, 3.3)
    .box(M.steel, X(497), 0.91, Z(172), 0.66, 0.03, 3.3)
    .box(M.white, X(389), 0.55, Z(160), 0.55, 1.1, 3.9)
    .box(M.oak, X(389), 1.12, Z(160), 0.7, 0.05, 4.0)
    .box(M.white, X(410), 0.55, Z(230), 1.2, 1.1, 0.5)
    .box(M.oak, X(410), 1.12, Z(230), 1.3, 0.05, 0.6);
  // WC: three cabins and a washbasin counter
  for (const py of [378, 412, 452]) F.toilet(fg.L0, X(396), 0.02, Z(py), E);
  for (const py of [395, 432]) obj(fg.L0, X(416), 0, Z(py)).box(WL, 0, 1.0, 0, 1.7, 2.0, 0.05);
  obj(fg.L0, X(500), 0.02, Z(365))
    .box(M.white, 0, 0.82, 0, 0.5, 0.08, 1.5)
    .box(M.porcelain, 0, 0.88, -0.35, 0.36, 0.05, 0.36)
    .box(M.porcelain, 0, 0.88, 0.35, 0.36, 0.05, 0.36);

  // ----- Piso 1: cowork -----
  const yL1 = LV.L[1];
  const y1 = yL1 + 0.02;
  poly(G.L1, LIN, y1, 0.32, M.wood);
  wall(G.L1, WL, lw, ln, le, ln, yL1, FH, 0.8);
  wall(G.L1, WL, lw, ls, le, ls, yL1, FH, TW, [win(X(200), 'x', 1.2), win(X(322), 'x', 1.4)], GL);
  wall(
    G.L1,
    WL,
    lw,
    ln,
    lw,
    ls,
    yL1,
    FH,
    TW,
    [160, 270, 385].map((py) => win(Z(py), 'z')),
    GL
  );
  // two double doors straight onto the atrium
  wall(
    G.L1,
    WL,
    le,
    ln,
    le,
    ls,
    yL1,
    FH,
    TW,
    [
      { z: Z(150), w: 1.3, hi: 2.3, door: 'glass' },
      { z: Z(270), w: 1.3, hi: 2.3, door: 'glass' },
    ],
    GL
  );
  wall(G.L1, WL, X(270), Z(190), X(512), Z(190), yL1, FH, TI, [
    { x: X(460), w: 1.2, door: 'wood' },
  ]);
  wall(G.L1, WL, X(270), Z(78), X(270), Z(190), yL1, FH, TI);
  wall(G.L1, WL, X(371), Z(78), X(371), Z(190), yL1, FH, TI);
  for (const [px, py] of [
    [155, 267],
    [300, 267],
    [158, 398],
    [300, 398],
  ]) {
    const x = X(px);
    const z = Z(py);
    F.desk(fg.L1, x, y1, z, 2.4, 1.55, 0, M.white);
    for (const dx of [-0.6, 0.6]) {
      F.monitor(fg.L1, x + dx, y1, z - 0.3);
      F.monitor(fg.L1, x + dx, y1, z + 0.3, N);
      F.officeChair(fg.L1, x + dx, y1, z - 1.1, 0, M.blue);
      F.officeChair(fg.L1, x + dx, y1, z + 1.1, N, M.blue);
    }
  }
  F.roundTable(fg.L1, X(425), y1, Z(262), 0.7, M.white);
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + 0.78;
    F.officeChair(fg.L1, X(425) + Math.cos(a), y1, Z(262) + Math.sin(a), -a - E, M.blue);
  }
  // the two yellow phone booths
  for (const [px, py, w, d] of [
    [301, 151, 1.3, 1.8],
    [424, 338, 1.65, 1.3],
  ])
    obj(fg.L1, X(px), y1, Z(py))
      .box(M.yellow, 0, 1.1, 0, w, 2.2, d)
      .box(M.black, 0, 2.23, 0, w + 0.06, 0.06, d + 0.06);
  // meeting table (open to the room) and the closed office
  obj(fg.L1, X(175), y1, Z(135))
    .cyl(M.white, 0, 0.73, 0, 2.9, 0.04, 1.3)
    .cyl(M.black, 0, 0.36, 0, 0.12, 0.72, 0.12);
  for (const dx of [-0.8, 0, 0.8]) {
    F.officeChair(fg.L1, X(175) + dx, y1, Z(135) - 0.95, 0, M.blue);
    F.officeChair(fg.L1, X(175) + dx, y1, Z(135) + 0.95, N, M.blue);
  }
  F.officeChair(fg.L1, X(175) - 1.75, y1, Z(135), E, M.blue);
  F.officeChair(fg.L1, X(175) + 1.75, y1, Z(135), W, M.blue);
  F.table(fg.L1, X(432), y1, Z(108), 2.0, 0.9, 0, M.white);
  for (const dx of [-0.5, 0.5]) {
    F.officeChair(fg.L1, X(432) + dx, y1, Z(108) + 0.8, N, M.blue);
  }
  obj(fg.L1, 0, y1, 0)
    .box(M.white, X(500), 0.45, Z(457), 0.9, 0.9, 0.6)
    .box(M.steel, X(500), 0.91, Z(457), 0.9, 0.03, 0.6)
    .box(M.oak, X(407), 1.0, Z(435), 0.6, 2.0, 1.7);
  F.stair(fg.L1, X(330), Z(85), X(368), Z(190), yL1, LV.L[2], '-z');
  F.trackLight(fg.L1, 1.0, 10.0, Z(300), LV.L[2] - 0.32);
  F.trackLight(fg.L1, 1.0, 10.0, Z(420), LV.L[2] - 0.32);

  // ----- Piso 2: attic kitchenette under the roof -----
  const yL2 = LV.L[2];
  const y2 = yL2 + 0.02;
  poly(G.L2, LIN, y2, 0.32, M.oak);
  for (const [a, b, c, d] of [
    [lw, ln, le, ln],
    [lw, ls, le, ls],
    [lw, ln, lw, ls],
    [le, ln, le, ls],
  ])
    wall(G.L2, WL, a, b, c, d, yL2, L_EAVE - yL2, TW);
  wallLine(
    G.L2,
    WL,
    [
      [190, 78],
      [190, 238],
      [440, 238],
      [440, 78],
    ],
    yL2,
    2.2,
    TI
  );
  obj(fg.L2, 0, y2, 0)
    .box(M.white, X(210), 0.45, Z(160), 0.6, 0.9, 2.5)
    .box(M.yellow, X(210), 0.92, Z(160), 0.62, 0.04, 2.5)
    .box(M.white, X(275), 0.45, Z(220), 3.9, 0.9, 0.6)
    .box(M.yellow, X(275), 0.92, Z(220), 3.9, 0.04, 0.62);
  for (const px of [262, 320]) F.chair(fg.L2, X(px), y2, Z(196), 0, M.white);
  for (const py of [132, 182]) F.chair(fg.L2, X(238), y2, Z(py), W, M.white);

  // ----- Roof: hipped at the street end, gable against the neighbour -----
  {
    const o = 0.45;
    const e = L_EAVE;
    const r = L_RIDGE;
    const xm = LX / 2;
    const zr = LZ / 2;
    const A: Vec3 = [-o, e, 0];
    const B: Vec3 = [xm, r, 0];
    const Cc: Vec3 = [xm, r, zr];
    const D: Vec3 = [-o, e, LZ + o];
    const A2: Vec3 = [LX + o, e, 0];
    const D2: Vec3 = [LX + o, e, LZ + o];
    const tris: Vec3[][] = [
      [A, B, Cc],
      [A, Cc, D],
      [A2, Cc, B],
      [A2, D2, Cc],
      [D, Cc, D2],
    ];
    const pos: number[] = [];
    const uv: number[] = [];
    tris.forEach((t, i) =>
      t.forEach((p) => {
        pos.push(...p);
        const along = i < 4 ? Math.hypot(p[0] - xm, p[1] - r) : Math.hypot(p[2] - zr, p[1] - r);
        uv.push((i < 4 ? p[2] : p[0]) / 2, along / 2);
      })
    );
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.computeVertexNormals();
    G.Lroof.add(shadow(new THREE.Mesh(geo, M.tile)));
    const gg = new THREE.BufferGeometry();
    gg.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([0, e, 0.02, LX, e, 0.02, xm, r - 0.1, 0.02], 3)
    );
    gg.computeVertexNormals();
    G.Lroof.add(shadow(new THREE.Mesh(gg, WL)));
    obj(fg.Lroof, 0, 0, 0)
      .box(M.white, xm, e - 0.08, LZ + o - 0.05, LX + 2 * o, 0.16, 0.1)
      .box(M.white, -o + 0.05, e - 0.08, LZ / 2, 0.1, 0.16, LZ + o);
    // chimney on the street side, next to the atrium
    obj(G.Lroof, X(450), 0, Z(486))
      .box(WL, 0, 9.2, 0, 1.4, 4.4, 0.6)
      .box(M.frame, 0, 11.45, 0, 1.5, 0.1, 0.7);
    // solar panels on the east slope
    const slope = Math.atan2(r - e, xm + o);
    for (let j = 0; j < 4; j++) {
      const cx = LX - 0.9;
      const y = e + (LX + o - cx) * Math.tan(slope) + 0.1;
      obj(G.Lroof, cx, y, 1.0 + j * 1.9).box(M.panel, 0, 0, 0, 1.9, 0.04, 1.75, 0, 0, -slope);
    }
  }

  // =========================================================
  // ATRIUM — at the old building's first-floor level
  // =========================================================
  const WM = Zm.M.wall;
  const stairWell = R(598, 250, 648, 392);
  // The ground under the atrium, cut open only for the stair down to the restaurant.
  poly(G.M0, ATRIUM_FP, ATRIUM - 0.2, ATRIUM - 0.2, Zm.M.dark, [R(545, 245, 650, 395)]);
  poly(fg.M0, R(545, 245, 650, 395), 0.02, 0.1, M.concrete);
  F.stair(fg.M0, X(598), Z(250), X(648), Z(392), 0, ATRIUM, '-z', M.concrete);

  poly(G.M1, ATRIUM_FP, ATRIUM + 0.02, 0.22, M.patio, [stairWell]);
  // perimeter: neighbour wall to the north, street wall with the entrance to the south
  wallLine(
    G.M1,
    WM,
    [
      [540, 50],
      [854, 48],
      [860, 92],
      [990, 80],
    ],
    0,
    GLASS_ROOF,
    TN
  );
  wall(
    G.M1,
    WM,
    LX,
    ls,
    X(1010),
    ls,
    0,
    GLASS_ROOF,
    TN,
    [
      { x: X(766), w: 1.9, lo: ATRIUM, hi: ATRIUM + 2.6, door: 'glass' },
      ...[600, 680, 860, 940].map((px) => win(X(px), 'x', 1.3, ATRIUM + 3.0, ATRIUM + 3.9)),
    ],
    Zm.M.glass
  );
  wall(G.M1, WM, X(1010), ls, X(1048), Z(472), 0, GLASS_ROOF, TN);
  const ya = ATRIUM + 0.02;
  F.railing(fg.M1, X(598), Z(250), X(598), Z(392), ATRIUM);
  F.railing(fg.M1, X(648), Z(250), X(648), Z(392), ATRIUM);
  F.railing(fg.M1, X(598), Z(250), X(648), Z(250), ATRIUM);
  // reception desk by the entrance
  obj(fg.M1, 0, ya, 0)
    .box(M.white, X(620), 0.55, Z(394), 3.7, 1.1, 0.5)
    .box(M.oak, X(620), 1.12, Z(394), 3.8, 0.05, 0.6)
    .box(M.white, X(693), 0.55, Z(428), 0.5, 1.1, 1.8)
    .box(M.oak, X(693), 1.12, Z(428), 0.6, 0.05, 1.9);
  F.officeChair(fg.M1, X(650), ya, Z(430), N, M.blue);
  // WC block against the neighbour wall: five cabins, washbasins, one accessible WC
  wall(G.M1, WM, X(655), Z(182), X(845), Z(182), ATRIUM, 2.7, TI, [{ x: X(690), w: 0.9 }]);
  wall(G.M1, WM, X(655), Z(55), X(655), Z(182), ATRIUM, 2.7, TI);
  wall(G.M1, WM, X(845), Z(55), X(845), Z(110), ATRIUM, 2.7, TI);
  wallLine(
    G.M1,
    WM,
    [
      [845, 110],
      [925, 110],
      [925, 196],
      [845, 196],
      [845, 182],
    ],
    ATRIUM,
    2.7,
    TI
  );
  wall(
    G.M1,
    WM,
    X(655),
    Z(122),
    X(845),
    Z(122),
    ATRIUM,
    2.2,
    0.05,
    [675, 712, 748, 785, 822].map((px) => ({ x: X(px), w: 0.7 }))
  );
  for (const px of [693, 730, 767, 803])
    obj(fg.M1, X(px), ya, Z(88)).box(WM, 0, 1.1, 0, 0.05, 2.2, 1.6);
  for (const px of [675, 712, 748, 785, 822]) F.toilet(fg.M1, X(px), ya, Z(76), 0);
  F.toilet(fg.M1, X(905), ya, Z(170), N);
  obj(fg.M1, X(770), ya, Z(170))
    .box(M.white, 0, 0.82, 0, 2.2, 0.08, 0.5)
    .box(M.porcelain, -0.6, 0.88, 0, 0.36, 0.05, 0.36)
    .box(M.porcelain, 0.1, 0.88, 0, 0.36, 0.05, 0.36)
    .box(M.porcelain, 0.8, 0.88, 0, 0.36, 0.05, 0.36);
  // wooden stair up to the platform and the training rooms
  F.stair(fg.M1, X(835), Z(215), X(940), Z(275), ATRIUM, LV.R[1], '+x', M.oak);
  // planting, bistro tables and lounge chairs
  F.planter(fg.M1, X(596), ya, Z(100), 2.2, 1.6);
  F.planter(fg.M1, X(755), ya, Z(222), 2.6, 0.9);
  for (const [px, py] of [
    [705, 300],
    [770, 335],
    [705, 368],
  ]) {
    F.roundTable(fg.M1, X(px), ya, Z(py), 0.38, M.white);
    F.chair(fg.M1, X(px) + 0.62, ya, Z(py), W, M.white);
    F.chair(fg.M1, X(px) - 0.62, ya, Z(py), E, M.white);
  }
  F.chair(fg.M1, X(815), ya, Z(318), E, M.blue);
  F.chair(fg.M1, X(815), ya, Z(372), E, M.yellow);
  F.pouf(fg.M1, X(832), ya, Z(345), 0.2, M.yellow);
  F.plant(fg.M1, X(560), ya, Z(455), 1.2);
  F.plant(fg.M1, X(835), ya, Z(455), 1.2);
  for (let i = 0; i < 5; i++)
    obj(fg.M1, X(600) + i * 1.9, GLASS_ROOF - 1.3, Z(300))
      .cyl(M.leaf2, 0, 0, 0, 0.35, 0.3, 0.35)
      .cyl(M.frame, 0, 0.65, 0, 0.01, 1.0, 0.01);
  // coloured glass roof
  {
    const nx = 8;
    const nz = 5;
    const x0 = LX;
    const x1 = X(1008);
    const z0 = 0.3;
    const w = (x1 - x0) / nx;
    const d = (LZ - z0) / nz;
    const tint: Record<string, Mat> = {
      y: M.tintYellow,
      b: M.tintBlue,
      g: M.tintGreen,
      '.': M.railGlass,
    };
    const pattern = ['....y...', '.y..bb.g', 'g...y...', '..b...g.', '.y..g..y'];
    for (let i = 0; i < nx; i++)
      for (let j = 0; j < nz; j++) {
        const m = new THREE.Mesh(UNIT.box, tint[pattern[j][i]]);
        m.scale.set(w - 0.06, 0.03, d - 0.06);
        m.position.set(x0 + w * (i + 0.5), GLASS_ROOF, z0 + d * (j + 0.5));
        G.Mroof.add(m);
      }
    const fr = obj(G.Mroof, 0, 0, 0);
    for (let i = 0; i <= nx; i++)
      fr.box(M.white, x0 + w * i, GLASS_ROOF - 0.12, (z0 + LZ) / 2, 0.08, 0.22, LZ - z0);
    for (let j = 0; j <= nz; j++)
      fr.box(M.white, (x0 + x1) / 2, GLASS_ROOF - 0.12, z0 + d * j, x1 - x0, 0.22, 0.08);
  }

  // =========================================================
  // NEW BUILDING — gaming + recording, training rooms, top floor
  // =========================================================
  const WR = Zm.R.wall;
  const DR = Zm.R.dark;
  const GR = Zm.R.glass;
  const polyWalls = (
    g: G3,
    mat: Mat,
    pts: Pt[],
    y: number,
    h: number,
    t: number,
    open: Record<number, Opening[]> = {}
  ) =>
    pts.forEach(([ax, az], i) => {
      const [bx, bz] = pts[(i + 1) % pts.length];
      wall(g, mat, ax, az, bx, bz, y, h, t, open[i] ?? [], GR);
    });

  // ----- Piso 0: half-buried; its west end is the box that carries the atrium platform -----
  const r0 = PL + 0.02;
  poly(G.R0, R0_FP, r0, 0.3, M.greyFloor);
  // edge 6 is the west wall: the stair from the atrium comes down through it
  polyWalls(G.R0, WR, R0_FP, PL, FH, TN, { 6: [{ z: Z(436), w: 1.3, lo: ATRIUM - PL, hi: 3.3 }] });
  F.stair(fg.R0, X(870), Z(410), X(940), Z(462), PL, ATRIUM, '-x', M.concrete);
  // corridor along the street side
  wallLine(
    G.R0,
    WR,
    [
      [870, 400],
      [990, 400],
    ],
    PL,
    FH,
    TI
  );
  wallLine(
    G.R0,
    WR,
    [
      [1028, 402],
      [1200, 372],
      [1262, 362],
    ],
    PL,
    FH,
    TI
  );
  // zig-zag acoustic wall between the gaming room and the studio, then the studio lobby
  wallLine(
    G.R0,
    DR,
    [
      [1262, 78],
      [1300, 150],
      [1290, 215],
      [1312, 240],
      [1285, 300],
      [1270, 348],
    ],
    PL,
    FH,
    0.3
  );
  wallLine(
    G.R0,
    DR,
    [
      [1335, 320],
      [1370, 300],
      [1455, 292],
      [1485, 320],
      [1540, 320],
    ],
    PL,
    FH,
    0.3
  );
  wallLine(
    G.R0,
    DR,
    [
      [1270, 348],
      [1335, 320],
    ],
    PL,
    FH,
    TI
  );
  // green chroma-key corner
  poly(
    fg.R0,
    P([
      [934, 104],
      [1250, 82],
      [1250, 110],
      [1002, 126],
      [1012, 258],
      [952, 264],
    ]),
    r0 + 0.02,
    0.02,
    M.chroma
  );
  wallLine(
    fg.R0,
    M.chroma,
    [
      [940, 106],
      [958, 262],
    ],
    PL,
    2.6,
    0.05
  );
  wallLine(
    fg.R0,
    M.chroma,
    [
      [940, 104],
      [1250, 82],
    ],
    PL,
    2.6,
    0.05
  );
  // long table for twelve
  F.table(fg.R0, X(1118), r0, Z(176), 6.2, 1.4, -0.08, M.white);
  for (let i = 0; i < 5; i++) {
    const x = X(1020) + i * 1.2;
    const zs = -0.08 * (x - X(1118));
    F.officeChair(fg.R0, x, r0, Z(176) - 1.05 + zs, 0, M.white);
    F.officeChair(fg.R0, x, r0, Z(176) + 1.05 + zs, N, M.white);
  }
  F.officeChair(fg.R0, X(982), r0, Z(186), E, M.white);
  F.officeChair(fg.R0, X(1254), r0, Z(166), W, M.white);
  // screen partition, round table with poufs, armchairs, two simulators
  wallLine(
    fg.R0,
    M.black,
    [
      [1045, 345],
      [1050, 300],
      [1085, 270],
      [1135, 265],
    ],
    PL,
    2.0,
    0.08
  );
  F.screenWall(fg.R0, X(1066), r0, Z(286), 1.0, -0.72, 0.6, 1.4);
  F.screenWall(fg.R0, X(1110), r0, Z(269), 1.0, -0.1, 0.6, 1.4);
  F.roundTable(fg.R0, X(1103), r0, Z(322), 0.45, M.white, 0.45);
  for (const [px, py] of [
    [1155, 305],
    [1150, 338],
    [1135, 360],
    [1105, 372],
    [1080, 370],
  ])
    F.pouf(fg.R0, X(px), r0, Z(py), 0.24, M.yellow);
  for (const [px, py] of [
    [1238, 240],
    [1228, 275],
    [1215, 305],
  ])
    F.beanbag(fg.R0, X(px), r0, Z(py));
  for (const py of [318, 356]) {
    F.officeChair(fg.R0, X(930), r0, Z(py), W, M.purple);
    obj(fg.R0, X(897), r0, Z(py))
      .box(M.black, 0, 0.4, 0, 0.5, 0.8, 0.75)
      .box(M.screen, 0.1, 1.15, 0, 0.05, 0.5, 0.8);
  }
  // studio: dark wood floor, drums, corner vocal booth in glass, control desk, guitars
  poly(
    fg.R0,
    P([
      [1275, 62],
      [1528, 50],
      [1536, 318],
      [1486, 318],
      [1456, 290],
      [1370, 298],
      [1320, 322],
      [1290, 300],
      [1316, 240],
      [1296, 215],
      [1306, 150],
    ]),
    r0 + 0.02,
    0.02,
    M.woodDark
  );
  F.drums(fg.R0, X(1345), r0, Z(115));
  obj(fg.R0, X(1345), r0, Z(115)).cyl(M.rugBeige, 0, 0.03, 0, 2.6, 0.02, 2.2);
  wallLine(
    fg.R0,
    M.railGlass,
    [
      [1395, 58],
      [1425, 100],
      [1490, 140],
      [1530, 128],
    ],
    PL,
    2.6,
    0.04
  );
  for (const px of [1470, 1488, 1506])
    obj(fg.R0, X(px), r0, Z(178))
      .box(M.black, 0, 0.55, 0, 0.12, 0.9, 0.3)
      .box(M.woodDark, 0, 0.1, 0, 0.3, 0.2, 0.3);
  F.table(fg.R0, X(1412), r0, Z(326), 1.8, 0.8, 0.05, M.black, 0.8);
  obj(fg.R0, X(1412), r0, Z(326), 0.05)
    .box(M.screen, -0.45, 0.98, -0.2, 0.5, 0.32, 0.03)
    .box(M.screen, 0.45, 0.98, -0.2, 0.5, 0.32, 0.03)
    .box(M.steel, 0, 0.82, 0.1, 1.2, 0.04, 0.4);
  F.officeChair(fg.R0, X(1418), r0, Z(352), N, M.black);

  // ----- Piso 1: two training rooms; the slab also forms the platform inside the atrium -----
  const yR1 = LV.R[1];
  const ra = yR1 + 0.02;
  poly(G.R1, R1_SLAB, ra, 0.34, M.concrete);
  // edges: 0 north, 1 east, 2 street, 3 west (towards the atrium)
  polyWalls(G.R1, WR, RU_FP, yR1, FH, TN, {
    2: [fwin(0.23, 2.3), fwin(0.58, 2.3)],
    3: [{ f: 0.725, w: 1.1, hi: 2.3, door: 'glass' }],
  });
  wall(G.R1, WR, X(1264), Z(76), X(1310), Z(395), yR1, FH, TI, [{ f: 0.3, w: 1.0, door: 'wood' }]);
  wall(G.R1, WR, X(1005), Z(208), X(1266), Z(165), yR1, FH, TI, [
    { f: 0.14, w: 1.0, door: 'wood' },
  ]);
  wallLine(
    G.R1,
    WR,
    [
      [1000, 157],
      [1158, 150],
    ],
    yR1,
    FH,
    TI
  );
  F.stair(fg.R1, X(1000), Z(95), X(1150), Z(146), yR1, LV.R[2], '+x', M.oak);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 8; r++) {
      const py = 250 + r * 23.5;
      F.chair(fg.R1, X(1045 + c * 46 + (py - 250) * 0.18), ra, Z(py), E, M.white);
    }
  F.chair(fg.R1, X(1272), ra, Z(270), W, M.blue);
  F.chair(fg.R1, X(1282), ra, Z(300), W, M.blue);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 9; r++) {
      const py = 112 + r * 27;
      F.chair(fg.R1, X(1298 + c * 47 + (py - 112) * 0.15), ra, Z(py), E, M.white);
    }
  F.chair(fg.R1, X(1500), ra, Z(200), W, M.blue);
  F.chair(fg.R1, X(1510), ra, Z(228), W, M.blue);
  // platform: the gaming room's roof, with the sofa seen in the renders
  F.railing(fg.R1, X(868), Z(278), X(868), Z(405), yR1);
  F.railing(fg.R1, X(868), Z(405), X(1046), Z(405), yR1);
  F.railing(fg.R1, X(930), Z(100), X(946), Z(213), yR1);
  F.railing(fg.R1, X(868), Z(278), X(950), Z(270), yR1);
  F.sofa(fg.R1, X(935), ra, Z(345), 2.0, W, M.blue);
  F.chair(fg.R1, X(895), ra, Z(305), E, M.yellow);
  F.chair(fg.R1, X(895), ra, Z(385), E, M.yellow);
  F.plant(fg.R1, X(975), ra, Z(385), 1.3);

  // ----- Piso 2: set back from the street behind a terrace -----
  const yR2 = LV.R[2];
  const rl = yR2 + 0.02;
  poly(G.R2, RU_FP, rl, 0.34, M.greyFloor, [R(1004, 94, 1200, 146)]);
  // edges: 0 north, 1 east, 2 street, 3 glazed corner (street), 4 west
  polyWalls(G.R2, WR, R2_FP, yR2, FH, TN, {
    1: [fwin(0.5, 2.2, 0.6, 2.8)],
    2: [fwin(0.3, 2.4, 0.6, 2.8), fwin(0.72, 2.4, 0.6, 2.8)],
    3: [{ f: 0.5, w: 3.9, hi: 2.8, door: 'glass' }],
    4: [fwin(0.2, 2.4, 0.3, 2.8)],
  });
  wall(
    G.R2,
    WR,
    X(1405),
    Z(52),
    X(1408),
    Z(314),
    yR2,
    FH,
    TI,
    [{ f: 0.1, w: 0.9, door: 'glass' }],
    GR
  );
  wallLine(
    G.R2,
    WR,
    [
      [1000, 150],
      [1210, 146],
    ],
    yR2,
    FH,
    TI
  );
  for (const px of [1140, 1185, 1228, 1268, 1312, 1352])
    for (const py of [192, 228, 262, 295, 325]) {
      if (py > 372 - (px - 1044) * 0.176) continue;
      F.chair(fg.R2, X(px), rl, Z(py), W, M.white);
    }
  obj(fg.R2, 0, rl, 0)
    .box(M.white, X(1090), 0.45, Z(178), 2.7, 0.9, 0.4)
    .box(M.white, X(1043), 0.45, Z(215), 0.4, 0.9, 1.5)
    .box(M.oak, X(1322), 1.05, Z(126), 3.3, 0.05, 0.4)
    .box(M.black, X(1322), 0.52, Z(126), 3.2, 1.0, 0.06);
  obj(fg.R2, X(1478), rl, Z(190))
    .cyl(M.white, 0, 0.73, 0, 1.3, 0.04, 3.2)
    .cyl(M.black, 0, 0.36, 0, 0.12, 0.72, 0.12);
  for (const dz of [-1.05, -0.35, 0.35, 1.05]) {
    F.officeChair(fg.R2, X(1478) - 1.0, rl, Z(190) + dz, E, M.blueDark);
    F.officeChair(fg.R2, X(1478) + 1.0, rl, Z(190) + dz, W, M.blueDark);
  }
  F.railing(fg.R2, X(1554), Z(380), X(1050), Z(468), yR2);
  F.railing(fg.R2, X(1050), Z(468), X(1044), Z(378), yR2);
  for (const px of [1120, 1300, 1480]) F.plant(fg.R2, X(px), rl, Z(440 - (px - 1050) * 0.17), 1.0);

  // ----- Roof: green roof with solar panels -----
  poly(G.Rroof, R2_FP, R_ROOF, 0.35, M.slabEdge);
  poly(
    G.Rroof,
    P([
      [1004, 98],
      [1528, 54],
      [1536, 284],
      [1216, 336],
      [1052, 364],
    ]),
    R_ROOF + 0.12,
    0.12,
    M.greenRoof
  );
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 2; j++)
      obj(fg.Rroof, X(1130) + i * 3.6, R_ROOF + 0.55, Z(130) + j * 2.6 - i * 0.3, -0.08)
        .box(M.panel, 0, 0, 0, 3.0, 0.05, 1.8, -0.35, 0, 0)
        .box(M.steel, 0, -0.25, 0.5, 2.8, 0.5, 0.05);
  polyWalls(G.Rroof, WR, R2_FP, R_ROOF, 0.5, TN);

  // =========================================================
  // STREET AND NEIGHBOURS
  // =========================================================
  {
    // The street climbs along x only, so the ground is built from strips that are each
    // planar, with the buildings' footprint left out (rooms sit below street level).
    const lerp = (pts: Pt[], x: number) => {
      for (let i = 0; i < pts.length - 1; i++) {
        const [xa, za] = pts[i];
        const [xb, zb] = pts[i + 1];
        if (x <= xb) return za + ((zb - za) * (x - xa)) / (xb - xa || 1);
      }
      return pts[pts.length - 1][1];
    };
    const xEnd = X(1554);
    const north: Pt[] = [
      [0, 0],
      [X(856), 0],
      [X(862), Z(90)],
      [X(1542), Z(36)],
      [xEnd, Z(36)],
    ];
    const south: Pt[] = [
      [0, LZ],
      [X(1010), LZ],
      [xEnd, Z(380)],
    ];
    const xs = [-70, 0, 1, X(766), X(856), X(862), X(1010), xEnd, X(766) + 20, 110];
    const pos: number[] = [];
    const uv: number[] = [];
    const quad = (a: number, b: number, z1a: number, z2a: number, z1b: number, z2b: number) => {
      const ha = terrain(a) - 0.02;
      const hb = terrain(b) - 0.02;
      const v: Vec3[] = [
        [a, ha, z1a],
        [a, ha, z2a],
        [b, hb, z2b],
        [a, ha, z1a],
        [b, hb, z2b],
        [b, hb, z1b],
      ];
      v.forEach((p) => {
        pos.push(...p);
        uv.push(p[0] / 3, p[2] / 3);
      });
    };
    for (let i = 0; i < xs.length - 1; i++) {
      const a = xs[i];
      const b = xs[i + 1];
      if (b <= 0 || a >= xEnd) quad(a, b, -70, 90, -70, 90);
      else {
        quad(a, b, -70, lerp(north, a), -70, lerp(north, b));
        quad(a, b, lerp(south, a), 90, lerp(south, b), 90);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.computeVertexNormals();
    const ground = new THREE.Mesh(geo, M.cobble);
    ground.receiveShadow = true;
    root.add(ground);

    const nb = (x0: number, z0: number, x1: number, z1: number, h: number, roof = true) => {
      const y = terrain(x0);
      const hh = h + terrain(x1) - y;
      obj(G.context, (x0 + x1) / 2, y, (z0 + z1) / 2).box(
        M.neighbor,
        0,
        hh / 2,
        0,
        x1 - x0,
        hh,
        z1 - z0
      );
      if (roof)
        obj(G.context, (x0 + x1) / 2, y + hh, (z0 + z1) / 2)
          .box(M.neighborRoof, 0, 0.6, 0, x1 - x0 + 0.5, 1.2, z1 - z0 + 0.5)
          .box(M.neighborRoof, 0, 1.45, 0, (x1 - x0) * 0.6, 0.5, (z1 - z0) * 0.5);
    };
    nb(0, -12, 11.5, -0.2, 5.0);
    nb(12.5, -9, 18.6, -0.2, 3.6);
    nb(19.4, -10, 36, -0.5, 6.0);
    nb(38, -2, 48, 9, 5.0, false);
    nb(2, 34, 17, 43, 4.6);
    nb(24, 35, 40, 45, 5.0);
    for (const [x, z] of [
      [-6, 14],
      [44, 16],
      [8, -18],
    ])
      F.tree(G.context, x, terrain(x), z, 1.0);
  }

  flushInstances();

  // ---------- Lights (physically based units, hence the π) ----------
  const hemi = new THREE.HemisphereLight(0xdfeeff, 0xb7a88f, 0.55 * Math.PI);
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.2 * Math.PI);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {
    left: -36,
    right: 36,
    top: 36,
    bottom: -36,
    near: 1,
    far: 160,
  });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.target.position.copy(CENTER);
  scene.add(hemi, sun, sun.target);

  const setSun = (hour: number) => {
    // Simple solar path for Pinhel (≈40.8° N); the building's orientation is approximate.
    const t = (hour - 6) / 14;
    const az = Math.PI * (t - 0.5) * 1.15;
    const el = Math.max(0.06, Math.sin(Math.PI * t) * 1.15);
    const d = 70;
    sun.position.set(
      CENTER.x + Math.sin(az) * Math.cos(el) * d,
      CENTER.y + Math.sin(el) * d,
      CENTER.z + Math.cos(az) * Math.cos(el) * d
    );
    const warm = 1 - Math.min(1, el / 0.6);
    sun.color.setRGB(1, 0.95 - warm * 0.25, 0.86 - warm * 0.45);
    sun.intensity = (0.5 + Math.min(1, el / 0.5) * 1.5) * Math.PI;
    hemi.intensity = (0.2 + Math.min(1, el / 0.6) * 0.25) * Math.PI;
  };

  // ---------- Labels ----------
  let view: FloorView = 'ext';
  let activeRoom: string | null = null;
  let showLabels = true;
  const labelNodes = new Map<string, HTMLButtonElement>();
  for (const r of ROOMS) {
    const el = document.createElement('button');
    el.type = 'button';
    el.hidden = true;
    el.className =
      'pointer-events-auto absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-bege-dark bg-white px-2 py-1.5 text-xs font-semibold text-black shadow-md';
    const dot = document.createElement('i');
    dot.className = 'inline-block size-2 rounded-xs';
    dot.style.background = r.color;
    el.append(dot, r.name);
    el.addEventListener('click', () => onSelectRoom(r.id));
    labels.appendChild(el);
    labelNodes.set(r.id, el);
  }

  // ---------- Camera framing ----------
  /** Area of the canvas not covered by the panel: right of it on wide screens, above it on narrow ones. */
  const layout = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    const c = container.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    if (w >= NARROW) {
      const left = p.right - c.left;
      return { w, h, fullW: w + left, fullH: h, offY: 0, freeW: w - left, freeH: h };
    }
    const ph = Math.min(c.bottom - p.top + 10, h * 0.5);
    return { w, h, fullW: w, fullH: h + ph, offY: ph, freeW: w, freeH: h - ph };
  };
  const resize = () => {
    const L = layout();
    if (!L.w || !L.h) return;
    renderer.setSize(L.w, L.h, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    camera.fov = L.w < NARROW ? 50 : 38;
    // Render a crop of a wider (or taller) frame, so the model sits in the free space.
    camera.aspect = L.fullW / L.fullH;
    camera.setViewOffset(L.fullW, L.fullH, 0, L.offY, L.w, L.h);
    camera.updateProjectionMatrix();
  };
  const up = new THREE.Vector3(0, 1, 0);
  const viewCamera = (v: FloorView): [THREE.Vector3, THREE.Vector3] => {
    const conf = VIEWS[v];
    const tgt = new THREE.Vector3(...conf.target);
    const dir = new THREE.Vector3(...conf.cam).sub(tgt).normalize();
    const L = layout();
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const portrait = L.w < NARROW && v !== 'ext';
    // On tall screens look along the building, so its 36 m run uses the screen's height.
    if (portrait) dir.applyAxisAngle(up, -Math.PI / 2 + 0.25);
    const d = portrait
      ? Math.max(11 / ((t * L.freeW) / L.fullH), 17 / ((t * L.freeH) / L.fullH))
      : Math.max(
          (L.w < NARROW ? 19 : 24) / ((t * L.freeW) / L.fullH),
          14 / ((t * L.freeH) / L.fullH)
        );
    return [tgt.clone().add(dir.multiplyScalar(THREE.MathUtils.clamp(d, 22, 170))), tgt];
  };

  let fly: {
    p0: THREE.Vector3;
    t0: THREE.Vector3;
    p1: THREE.Vector3;
    t1: THREE.Vector3;
    start: number;
  } | null = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const flyTo = (pos: THREE.Vector3, target: THREE.Vector3) => {
    if (reduceMotion) {
      camera.position.copy(pos);
      controls.target.copy(target);
      return;
    }
    fly = {
      p0: camera.position.clone(),
      t0: controls.target.clone(),
      p1: pos,
      t1: target,
      start: performance.now(),
    };
  };
  const stopFly = () => {
    fly = null;
  };
  controls.addEventListener('start', stopFly);

  const applyView = (v: FloorView, animate: boolean) => {
    view = v;
    activeRoom = null;
    const conf = VIEWS[v];
    for (const k of groupKeys) if (k !== 'context') G[k].visible = conf.show.includes(k);
    (Object.keys(clipPlanes) as Zone[]).forEach((z) => (clipPlanes[z].constant = conf.cut[z]));
    resize();
    const [pos, tgt] = viewCamera(v);
    if (animate) flyTo(pos, tgt);
    else {
      camera.position.copy(pos);
      controls.target.copy(tgt);
    }
  };

  const focusRoom = (id: string) => {
    const r = ROOMS.find((x) => x.id === id);
    if (!r) return;
    if (r.floor !== view) applyView(r.floor, false);
    activeRoom = id;
    const t = new THREE.Vector3(...r.at);
    const span = Math.sqrt(r.area) * (r.floor === 'ext' ? 2.6 : 1.7) + 6;
    const dir = new THREE.Vector3(-0.45, 0.95, 0.75).normalize();
    if (container.clientWidth < NARROW) dir.applyAxisAngle(up, -Math.PI / 2 + 0.25);
    flyTo(t.clone().add(dir.multiplyScalar(span)), t);
  };

  // ---------- Loop ----------
  const tmp = new THREE.Vector3();
  const updateLabels = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    const narrow = w < NARROW;
    for (const r of ROOMS) {
      const el = labelNodes.get(r.id);
      if (!el) continue;
      const visible =
        showLabels && r.floor === view && !(narrow && activeRoom && activeRoom !== r.id);
      tmp.set(...r.at).project(camera);
      const onScreen = tmp.z <= 1 && Math.abs(tmp.x) <= 1.05 && Math.abs(tmp.y) <= 1.05;
      el.hidden = !visible || !onScreen;
      if (el.hidden) continue;
      el.style.transform = `translate(${((tmp.x + 1) / 2) * w}px, ${((1 - tmp.y) / 2) * h - 8}px) translate(-50%, -100%)`;
      el.classList.toggle('ring-2', activeRoom === r.id);
      el.classList.toggle('ring-green', activeRoom === r.id);
    }
  };
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let raf = 0;
  const tick = (now: number) => {
    if (fly) {
      const k = Math.min(1, (now - fly.start) / 1100);
      const e = ease(k);
      camera.position.lerpVectors(fly.p0, fly.p1, e);
      controls.target.lerpVectors(fly.t0, fly.t1, e);
      if (k >= 1) fly = null;
    }
    controls.update();
    renderer.render(scene, camera);
    updateLabels();
    raf = requestAnimationFrame(tick);
  };

  const ro = new ResizeObserver(resize);
  ro.observe(container);
  setSun(15);
  applyView('ext', false);
  raf = requestAnimationFrame(tick);

  return {
    setView: (v) => applyView(v, true),
    focusRoom,
    setFurniture: (on) => furnKeys.forEach((k) => (fg[k].visible = on)),
    setLabels: (on) => {
      showLabels = on;
    },
    setContext: (on) => {
      G.context.visible = on;
    },
    setSun,
    resize,
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.removeEventListener('start', stopFly);
      controls.dispose();
      labelNodes.forEach((el) => el.remove());
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh && !Object.values(UNIT).includes(o.geometry))
          o.geometry.dispose();
      });
      Object.values(UNIT).forEach((g) => g.dispose());
      [...Object.values(M), ...Object.values(Zm).flatMap((z) => Object.values(z))].forEach((m) =>
        m.dispose()
      );
      tileTex.dispose();
      cobbleTex.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
