import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  FH,
  GLASS_ROOF,
  L_EAVE,
  L_RIDGE,
  LFP,
  LV,
  MFP,
  PL,
  R2FP,
  R_ROOF,
  RFP,
  ROOMS,
  RTOP,
  X,
  Z,
  rect,
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
type Zone = 'L' | 'M' | 'R';
type GroupKey =
  'L0' | 'L1' | 'L2' | 'Lroof' | 'M0' | 'M1' | 'Mroof' | 'R0' | 'R1' | 'R2' | 'Rroof' | 'context';

const SKY = 0xe6eef0;
const CENTER = new THREE.Vector3(18, 3, 5.5);
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
    cut: { L: 1e4, M: 1e4, R: 1e4 },
    cam: [-10, 22, 42],
    target: [18, 5, 5.5],
  },
  '0': {
    show: ['L0', 'M0', 'R0'],
    cut: { L: 1.7, M: PL + 1.4, R: PL + 1.7 },
    cam: [17, 40, 34],
    target: [18, 0, 5.2],
  },
  '1': {
    show: ['L0', 'L1', 'M0', 'M1', 'R0', 'R1'],
    cut: { L: LV.L[1] + 1.7, M: LV.R[1] + 1.4, R: LV.R[1] + 1.7 },
    cam: [17, 44, 34],
    target: [18, 3.5, 5.2],
  },
  '2': {
    show: ['L0', 'L1', 'L2', 'M0', 'M1', 'R0', 'R1', 'R2'],
    cut: { L: LV.L[2] + 0.45, M: LV.R[2] + 1.0, R: LV.R[2] + 1.7 },
    cam: [17, 48, 34],
    target: [18, 7, 5.2],
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

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 500);
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
  };
  const zoneMats = (zone: Zone) => ({
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
      side: THREE.DoubleSide,
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
  }, 40);

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
    neighbor: std(0xe7e2da, { roughness: 1 }),
    neighborRoof: std(0xb8775a, { roughness: 1 }),
    tile: std(0xffffff, { map: tileTex, roughness: 0.8, side: THREE.DoubleSide }),
    cobble: std(0xffffff, { map: cobbleTex, roughness: 1 }),
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
        if (o.window) box(o.a, o.b, o.lo - 0.04, o.lo, M.frame, t + 0.04);
        else {
          box(o.a, o.b, o.hi, o.hi + 0.06, M.frame, 0.1);
          box(mid - 0.02, mid + 0.02, o.lo, o.hi, M.frame, 0.08);
        }
      }
      if (o.door === 'wood') box(o.a, o.b, o.lo, o.hi, M.frame, 0.06);
      cur = o.b;
    }
    box(cur, L, 0, h);
    group.add(g);
  };
  /** A horizontal slab whose top face sits at y. */
  const poly = (group: G3, pts: Pt[], y: number, th: number, mat: Mat) => {
    const sh = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
    const geo = new THREE.ExtrudeGeometry(sh, { depth: th, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    const m = shadow(new THREE.Mesh(geo, mat));
    m.position.y = y - th;
    group.add(m);
  };

  const WL = Zm.L.wall;
  const GL = Zm.L.glass;
  const win = (at: number, axis: 'x' | 'z', w = 1.0, lo = 0.9, hi = 2.4): Opening => ({
    [axis]: at,
    w,
    lo,
    hi,
  });

  // =========================================================
  // OLD BUILDING — restaurant, cowork, attic
  // =========================================================
  poly(G.L0, LFP, 0.02, 0.2, M.wood);
  wall(G.L0, WL, 0, 0, 11.2, 0, 0, FH, TW, [win(4.2, 'x', 1.0, 1.0)], GL);
  wall(
    G.L0,
    WL,
    0,
    11.2,
    11.2,
    11.2,
    0,
    FH,
    TW,
    [win(2.0, 'x'), { x: 5.4, w: 1.2, door: 'wood' }, win(9.6, 'x')],
    GL
  );
  wall(
    G.L0,
    WL,
    0,
    0,
    0,
    11.2,
    0,
    FH,
    TW,
    [win(2.2, 'z'), { z: 5.5, w: 1.6, door: 'glass' }, win(8.0, 'z')],
    GL
  );
  wall(
    G.L0,
    WL,
    11.2,
    0,
    11.2,
    11.2,
    0,
    FH,
    TW,
    [
      { z: 5.3, w: 1.6, door: 'glass' },
      { z: 8.6, w: 1.0 },
    ],
    GL
  );
  wall(G.L0, WL, X(325), 0.9, X(325), 3.9, 0, FH, TI);
  wall(G.L0, WL, X(325), 6.6, X(325), 10.9, 0, FH, TI, [{ z: 7.0, w: 0.9 }]);
  wall(G.L0, WL, X(325), 6.6, 10.9, 6.6, 0, FH, TI);
  // restaurant
  for (const px of [112, 205, 296]) {
    F.bench(fg.L0, X(px), 0.02, 1.2, 1.8, 0.6, 0, M.green);
    F.table(fg.L0, X(px), 0.02, 2.1, 1.5, 0.8, 0, M.oak);
    F.chair(fg.L0, X(px) - 0.4, 0.02, 2.85, Math.PI, M.blueDark);
    F.chair(fg.L0, X(px) + 0.4, 0.02, 2.85, Math.PI, M.blueDark);
  }
  for (const [px, py] of [
    [152, 400],
    [249, 400],
  ]) {
    const x = X(px);
    const z = Z(py);
    F.table(fg.L0, x, 0.02, z, 1.1, 1.1, 0, M.oak);
    F.chair(fg.L0, x - 0.75, 0.02, z, Math.PI / 2, M.blueDark);
    F.chair(fg.L0, x + 0.75, 0.02, z, -Math.PI / 2, M.blueDark);
    F.chair(fg.L0, x, 0.02, z - 0.75, 0, M.blueDark);
    F.chair(fg.L0, x, 0.02, z + 0.75, Math.PI, M.blueDark);
  }
  const roundSets: [number, number, Mat][] = [
    [120, 600, M.green],
    [285, 600, M.green],
    [258, 512, M.green],
    [150, 520, M.oak],
  ];
  for (const [px, py, top] of roundSets) {
    const x = X(px);
    const z = Z(py);
    F.roundTable(fg.L0, x, 0.02, z, 0.55, top);
    for (let k = 0; k < 4; k++) {
      const a = (k * Math.PI) / 2 + 0.4;
      F.chair(
        fg.L0,
        x + Math.cos(a) * 0.9,
        0.02,
        z + Math.sin(a) * 0.9,
        -a - Math.PI / 2,
        M.blueDark
      );
    }
  }
  for (const [px, py] of [
    [110, 372],
    [195, 352],
    [180, 488],
    [205, 545],
    [255, 590],
    [275, 525],
    [120, 520],
  ])
    F.plant(fg.L0, X(px), 0.02, Z(py), 0.8);
  // kitchen
  obj(fg.L0, 0, 0.02, 0)
    .box(M.black, X(395), 0.45, 1.25, 3.0, 0.9, 0.65)
    .box(M.steel, X(395), 0.91, 1.25, 3.0, 0.03, 0.66)
    .box(M.white, X(335), 0.55, 2.6, 0.6, 1.1, 2.4)
    .box(M.oak, X(335), 1.12, 2.6, 0.75, 0.05, 2.5)
    .box(M.white, X(430), 1.0, 3.6, 0.65, 2.0, 0.65);
  // WC
  for (const py of [515, 555, 595]) F.toilet(fg.L0, X(340), 0.02, Z(py), Math.PI / 2);
  for (const py of [520, 560])
    obj(fg.L0, X(330) + 0.75, 0, Z(py) + 0.4).box(WL, 0, 1.0, 0, 1.5, 2.0, 0.05);
  obj(fg.L0, X(430), 0.02, 8.6)
    .box(M.white, 0, 0.82, 0, 0.5, 0.08, 2.2)
    .box(M.porcelain, 0, 0.88, -0.5, 0.36, 0.05, 0.36)
    .box(M.porcelain, 0, 0.88, 0.5, 0.36, 0.05, 0.36);

  // Piso 1 — cowork
  const yL1 = LV.L[1];
  poly(G.L1, LFP, yL1 + 0.02, 0.32, M.wood);
  wall(G.L1, WL, 0, 0, 11.2, 0, yL1, FH, TW, [win(2.6, 'x')], GL);
  wall(
    G.L1,
    WL,
    0,
    11.2,
    11.2,
    11.2,
    yL1,
    FH,
    TW,
    [2.0, 4.6, 7.2, 9.6].map((x) => win(x, 'x')),
    GL
  );
  wall(
    G.L1,
    WL,
    0,
    0,
    0,
    11.2,
    yL1,
    FH,
    TW,
    [4.6, 6.6, 9.2].map((z) => win(z, 'z')),
    GL
  );
  wall(
    G.L1,
    WL,
    11.2,
    0,
    11.2,
    11.2,
    yL1,
    FH,
    TW,
    [win(4.6, 'z', 1.0, 0.6, 2.6), win(9.0, 'z', 1.0, 0.6, 2.6)],
    GL
  );
  wall(G.L1, WL, 0.3, Z(392), 10.9, Z(392), yL1, FH, TI, [
    { x: 3.6, w: 0.9, door: 'wood' },
    { x: 6.0, w: 1.0 },
    { x: 8.0, w: 0.9, door: 'wood' },
  ]);
  wall(G.L1, WL, X(230), 0.3, X(230), Z(392), yL1, FH, TI);
  wall(G.L1, WL, X(320), 0.3, X(320), Z(392), yL1, FH, TI);
  const y1 = yL1 + 0.02;
  for (const [px, py] of [
    [135, 455],
    [262, 455],
    [135, 572],
    [262, 572],
  ]) {
    const x = X(px);
    const z = Z(py);
    F.desk(fg.L1, x, y1, z, 2.4, 1.4, 0, M.blue);
    for (const dx of [-0.6, 0.6]) {
      F.monitor(fg.L1, x + dx, y1, z - 0.25);
      F.monitor(fg.L1, x + dx, y1, z + 0.25, Math.PI);
      F.officeChair(fg.L1, x + dx, y1, z - 1.0, 0, dx < 0 ? M.yellow : M.blue);
      F.officeChair(fg.L1, x + dx, y1, z + 1.0, Math.PI, dx < 0 ? M.blue : M.yellow);
    }
  }
  F.roundTable(fg.L1, X(370), y1, Z(455), 0.55, M.green);
  F.table(fg.L1, X(368), y1, Z(520), 1.3, 1.0, 0, M.black);
  F.shelf(fg.L1, X(390), y1, 10.6, 2.6, 1.6);
  F.table(fg.L1, X(160), y1, Z(325), 2.6, 1.1, 0, M.blue);
  for (const dx of [-0.8, 0, 0.8]) {
    F.officeChair(fg.L1, X(160) + dx, y1, Z(325) - 0.8, 0, M.yellow);
    F.officeChair(fg.L1, X(160) + dx, y1, Z(325) + 0.8, Math.PI, M.blue);
  }
  F.table(fg.L1, X(385), y1, Z(318), 1.6, 0.8, 0, M.blue);
  F.officeChair(fg.L1, X(385), y1, Z(318) + 0.7, Math.PI, M.blue);
  F.stair(fg.L1, X(240), 0.5, X(312), 3.3, yL1, LV.L[2], '-z');
  F.trackLight(fg.L1, 1.0, 10.0, 6.0, LV.L[2] - 0.32);
  F.trackLight(fg.L1, 1.0, 10.0, 9.0, LV.L[2] - 0.32);

  // Piso 2 — attic
  const yL2 = LV.L[2];
  poly(G.L2, LFP, yL2 + 0.02, 0.32, M.oak);
  for (const [a, b, c, d] of [
    [0, 0, 11.2, 0],
    [0, 11.2, 11.2, 11.2],
    [0, 0, 0, 11.2],
    [11.2, 0, 11.2, 11.2],
  ])
    wall(G.L2, WL, a, b, c, d, yL2, L_EAVE - yL2, TW);
  const y2 = yL2 + 0.02;
  obj(fg.L2, 0, y2, 0)
    .box(M.white, 5.0, 0.45, Z(425), 4.4, 0.9, 0.62)
    .box(M.yellow, 5.0, 0.92, Z(425), 4.4, 0.04, 0.64)
    .box(M.yellow, X(160), 0.45, Z(400), 0.62, 0.9, 1.6);
  F.table(fg.L2, 5.2, y2, 6.6, 2.2, 0.9, 0, M.oak);
  for (const dx of [-0.7, 0.7]) {
    F.chair(fg.L2, 5.2 + dx, y2, 5.9, 0, M.yellow);
    F.chair(fg.L2, 5.2 + dx, y2, 7.3, Math.PI, M.blue);
  }
  F.sofa(fg.L2, 5.4, y2, 9.4, 2.2, Math.PI, M.blueDark);
  F.rug(fg.L2, 5.4, y2, 8.6, 1.5, 0.9, M.rugBeige);

  // Roof — hipped at the street end, gable against the neighbour
  {
    const o = 0.45;
    const e = L_EAVE;
    const r = L_RIDGE;
    const xm = 5.6;
    const zr = 5.6;
    const A: Vec3 = [-o, e, 0];
    const B: Vec3 = [xm, r, 0];
    const Cc: Vec3 = [xm, r, zr];
    const D: Vec3 = [-o, e, 11.2 + o];
    const A2: Vec3 = [11.2 + o, e, 0];
    const D2: Vec3 = [11.2 + o, e, 11.2 + o];
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
        uv.push(
          ...(i < 4
            ? [p[2] / 2, Math.hypot(p[0] - xm, p[1] - r) / 2]
            : [p[0] / 2, Math.hypot(p[2] - zr, p[1] - r) / 2])
        );
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
      new THREE.Float32BufferAttribute([0, e, 0.02, 11.2, e, 0.02, xm, r - 0.1, 0.02], 3)
    );
    gg.computeVertexNormals();
    G.Lroof.add(shadow(new THREE.Mesh(gg, WL)));
    obj(fg.Lroof, 0, 0, 0)
      .box(M.white, 5.6, e - 0.08, 11.2 + o - 0.05, 12.0, 0.16, 0.1)
      .box(M.white, -o + 0.05, e - 0.08, 5.6, 0.1, 0.16, 11.2 + o);
    obj(G.Lroof, 8.4, 0, 0.7)
      .box(WL, 0, 9.4, 0, 0.8, 4.2, 0.8)
      .box(M.frame, 0, 11.55, 0, 0.95, 0.1, 0.95);
    const slope = Math.atan2(r - e, xm + o);
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 3; j++) {
        const cx = 9.0 + i * 1.15;
        const y = e + (11.2 + o - cx) * Math.tan(slope) + 0.1;
        obj(G.Lroof, cx, y, 0.9 + j * 1.75).box(M.panel, 0, 0, 0, 1.05, 0.04, 1.65, 0, 0, -slope);
      }
  }

  // =========================================================
  // ATRIUM — entrance, stairs, raised platform, gallery
  // =========================================================
  const WM = Zm.M.wall;
  poly(G.M0, MFP, 0.02, 0.2, M.patio);
  wall(G.M0, WM, 11.2, 0, 19.2, 0, 0, GLASS_ROOF, TW);
  wall(G.M0, WM, 19.2, 0, 19.4, 1.3, 0, GLASS_ROOF, TN);
  wall(
    G.M0,
    WM,
    11.2,
    11.2,
    19.4,
    11.2,
    0,
    GLASS_ROOF,
    TW,
    [
      { x: X(670), w: 2.0, hi: 3.0, door: 'glass' },
      ...[12.4, 14.0, 15.6, 17.2, 18.6].map((x) => win(x, 'x', 1.1, 7.4, 8.5)),
    ],
    Zm.M.glass
  );
  poly(G.M0, rect(15.6, 2.5, 19.4, 6.4), PL, PL, M.concrete);
  F.stair(fg.M0, 15.6, 6.4, 16.8, 9.0, 0, PL, '-z');
  F.railing(fg.M0, 15.6, 2.5, 15.6, 6.4, PL);
  F.railing(fg.M0, 16.8, 6.4, 19.4, 6.4, PL);
  F.sofa(fg.M0, 18.6, PL, 4.6, 2.0, -Math.PI / 2, M.blue);
  F.chair(fg.M0, 17.0, PL, 5.4, Math.PI / 2, M.yellow);
  F.chair(fg.M0, 17.0, PL, 3.8, Math.PI / 2, M.yellow);
  F.roundTable(fg.M0, 17.8, PL, 4.6, 0.35, M.white, 0.45);
  F.plant(fg.M0, 18.9, PL, 6.0, 1.2);
  F.planter(fg.M0, 13.0, 0.02, 1.6, 3.0, 1.8);
  F.planter(fg.M0, 12.4, 0.02, 6.2, 1.6, 3.4);
  for (const [x, z] of [
    [13.8, 9.3],
    [15.0, 10.2],
    [13.6, 10.5],
  ]) {
    F.roundTable(fg.M0, x, 0.02, z, 0.38, M.white);
    F.chair(fg.M0, x + 0.6, 0.02, z, -Math.PI / 2, M.white);
    F.chair(fg.M0, x - 0.6, 0.02, z, Math.PI / 2, M.white);
  }
  F.chair(fg.M0, 17.6, 0.02, 7.6, Math.PI, M.blue);
  F.chair(fg.M0, 18.8, 0.02, 7.6, Math.PI, M.yellow);
  F.pouf(fg.M0, 18.2, 0.02, 7.3, 0.2, M.yellow);
  F.plant(fg.M0, 11.9, 0.02, 10.5, 1.3);
  F.tree(fg.M0, 13.2, 0.82, 1.6, 0.5);
  // gallery
  poly(G.M1, rect(11.6, 0.3, 19.3, 2.4), LV.R[1], 0.3, M.concrete);
  F.railing(fg.M1, 11.6, 2.4, 13.0, 2.4, LV.R[1]);
  F.railing(fg.M1, 11.6, 0.3, 11.6, 2.4, LV.R[1]);
  F.stair(fg.M1, 13.0, 2.45, 18.4, 3.4, PL, LV.R[1], '-x', M.frame);
  for (const x of [12.2, 14.2, 16.2, 18.2])
    obj(fg.M1, x, LV.R[1], 0.55).box(M.black, 0, 1.3, 0, 1.0, 0.7, 0.05);
  for (let i = 0; i < 5; i++)
    obj(fg.M1, 12.4 + i * 1.6, GLASS_ROOF - 1.3, 4.6)
      .cyl(M.leaf2, 0, 0, 0, 0.35, 0.3, 0.35)
      .cyl(M.frame, 0, 0.65, 0, 0.01, 1.0, 0.01);
  // coloured glass roof
  {
    const nx = 7;
    const nz = 6;
    const x0 = 11.2;
    const x1 = 22.4;
    const w = (x1 - x0) / nx;
    const d = 11.2 / nz;
    const tint: Record<string, Mat> = {
      y: M.tintYellow,
      b: M.tintBlue,
      g: M.tintGreen,
      '.': M.railGlass,
    };
    const pattern = ['....y..', '.y..bb.', 'g...y..', '..b...g', '.y..g..', '...y..b'];
    for (let i = 0; i < nx; i++)
      for (let j = 0; j < nz; j++) {
        const m = new THREE.Mesh(UNIT.box, tint[pattern[j][i]]);
        m.scale.set(w - 0.06, 0.03, d - 0.06);
        m.position.set(x0 + w * (i + 0.5), GLASS_ROOF, d * (j + 0.5));
        G.Mroof.add(m);
      }
    const fr = obj(G.Mroof, 0, 0, 0);
    for (let i = 0; i <= nx; i++)
      fr.box(M.white, x0 + w * i, GLASS_ROOF - 0.12, 5.6, 0.08, 0.22, 11.2);
    for (let j = 0; j <= nz; j++)
      fr.box(M.white, (x0 + x1) / 2, GLASS_ROOF - 0.12, d * j, x1 - x0, 0.22, 0.08);
  }

  // =========================================================
  // NEW BUILDING — gaming, recording, auditorium, lounge
  // =========================================================
  const WR = Zm.R.wall;
  const GR = Zm.R.glass;
  poly(G.R0, RFP, PL, PL, M.plinth);
  poly(G.R0, RFP, PL + 0.02, 0.05, M.greyFloor);
  const rWalls = (
    g: G3,
    y: number,
    open: Partial<Record<'n' | 'e' | 's' | 's2' | 'w', Opening[]>>
  ) => {
    wall(g, WR, 19.4, 1.3, 35.8, -0.3, y, FH, TN, open.n, GR);
    wall(g, WR, 35.8, -0.3, 36.2, 9.0, y, FH, TN, open.e, GR);
    wall(g, WR, 36.2, 9.0, 23.2, 11.1, y, FH, TN, open.s, GR);
    wall(g, WR, 23.2, 11.1, 19.4, 11.2, y, FH, TN, open.s2, GR);
    wall(g, WR, 19.4, 11.2, 19.4, 1.3, y, FH, TN, open.w, GR);
  };
  const fwin = (f: number, w = 1.2, lo = 0.9, hi = 2.6): Opening => ({ f, w, lo, hi });
  rWalls(G.R0, PL, {
    s: [fwin(0.2), fwin(0.62)],
    s2: [{ f: 0.5, w: 1.4, hi: 2.6, door: 'glass' }],
    w: [{ z: 4.45, w: 3.4, hi: 2.8 }],
  });
  wall(G.R0, Zm.R.dark, 29.6, 0.6, 30.0, 9.5, PL, FH, TI, [{ f: 0.62, w: 1.0, door: 'wood' }]);
  const r0 = PL + 0.02;
  poly(
    fg.R0,
    [
      [30.0, 0.6],
      [35.6, 0.0],
      [36.0, 9.0],
      [30.2, 9.6],
    ],
    r0 + 0.02,
    0.02,
    M.woodDark
  );
  poly(fg.R0, rect(X(820), Z(310), X(890), Z(460)), r0 + 0.02, 0.02, M.chroma);
  obj(fg.R0, X(822), r0, Z(385)).box(M.chroma, 0, 1.2, 0, 0.06, 2.4, 4.2);
  F.table(fg.R0, X(982), r0, Z(388), 5.6, 1.2, 0, M.oak);
  for (let i = 0; i < 5; i++) {
    const x = X(890) + 0.55 + i * 1.1;
    F.officeChair(fg.R0, x, r0, Z(388) - 0.9, 0, M.white);
    F.officeChair(fg.R0, x, r0, Z(388) + 0.9, Math.PI, M.white);
    F.monitor(fg.R0, x, r0, Z(388) - 0.2);
  }
  for (const [px, py] of [
    [1088, 435],
    [1085, 467],
    [1062, 500],
  ])
    F.beanbag(fg.R0, X(px), r0, Z(py));
  F.roundTable(fg.R0, X(970), r0, Z(512), 0.5, M.yellow, 0.45);
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    F.pouf(fg.R0, X(970) + Math.cos(a), r0, Z(512) + Math.sin(a), 0.24, M.yellow);
  }
  F.officeChair(fg.R0, X(810), r0, Z(500), Math.PI / 2, M.purple);
  F.officeChair(fg.R0, X(810), r0, Z(540), Math.PI / 2, M.purple);
  F.table(fg.R0, X(785), r0, Z(520), 0.7, 2.2, 0, M.black);
  F.monitor(fg.R0, X(778), r0, Z(500), Math.PI / 2);
  F.monitor(fg.R0, X(778), r0, Z(540), Math.PI / 2);
  F.screenWall(fg.R0, 23.5, r0, 10.4, 3.2, Math.PI + 0.16, 1.0, 1.5);
  F.drums(fg.R0, X(1205), r0, Z(345));
  F.table(fg.R0, X(1240), r0, Z(505), 2.2, 0.9, -0.15, M.black, 0.8);
  obj(fg.R0, X(1240), r0, Z(505), -0.15)
    .box(M.screen, -0.6, 0.98, -0.25, 0.55, 0.32, 0.03)
    .box(M.screen, 0.6, 0.98, -0.25, 0.55, 0.32, 0.03)
    .box(M.steel, 0, 0.82, 0.1, 1.4, 0.04, 0.45);
  F.officeChair(fg.R0, X(1240), r0, Z(505) + 0.9, Math.PI - 0.15, M.black);
  obj(fg.R0, X(1285), r0, Z(450)).box(M.black, 0, 0.75, 0, 0.5, 1.5, 1.6);
  obj(fg.R0, X(1300), r0, Z(325))
    .box(M.railGlass, -0.9, 1.25, 0.6, 0.04, 2.5, 1.6, 0, 0.4, 0)
    .box(M.railGlass, 0.3, 1.25, 1.3, 2.0, 2.5, 0.04);
  for (const x of [33.0, 33.4, 33.8])
    obj(fg.R0, x, r0, 8.2)
      .box(M.black, 0, 0.55, 0, 0.12, 0.9, 0.3)
      .box(M.woodDark, 0, 0.1, 0, 0.3, 0.2, 0.3);

  // Piso 1 — auditorium
  const yR1 = LV.R[1];
  poly(G.R1, RFP, yR1 + 0.02, 0.32, M.concrete);
  rWalls(G.R1, yR1, {
    s: [fwin(0.15, 1.2, 0.9, 2.7), fwin(0.4, 1.2, 0.9, 2.7), fwin(0.65, 1.2, 0.9, 2.7)],
    w: [{ z: 1.9, w: 1.1, hi: 2.3, door: 'glass' }],
    e: [fwin(0.5, 2.4, 0.9, 2.7)],
  });
  const ra = yR1 + 0.02;
  for (let c = 0; c < 9; c++)
    for (let r = 0; r < 9; r++) {
      const x = 24.6 + c * 0.95;
      const z = 2.4 + r * 0.82 + (c % 2) * 0.2;
      if (z > 9.4 - (x - 24) * 0.12) continue;
      F.chair(fg.R1, x, ra, z, -Math.PI / 2, (c + r) % 2 ? M.yellow : M.blue);
    }
  obj(fg.R1, 34.6, ra, 4.4).box(M.white, 0, 1.6, 0, 0.05, 1.8, 3.2);
  obj(fg.R1, 29.0, LV.R[2] - 0.5, 4.4)
    .box(M.black, 0, 0, 0, 0.45, 0.18, 0.4)
    .box(M.black, 0, 0.25, 0, 0.05, 0.4, 0.05);
  F.officeChair(fg.R1, 34.0, ra, 2.0, Math.PI / 2, M.black);
  F.stair(fg.R1, X(870), Z(300), X(1010), Z(355), yR1, LV.R[2], '+x');
  F.plant(fg.R1, 20.2, ra, 10.5, 1.1);

  // Piso 2 — lounge, meeting room, terrace
  const yR2 = LV.R[2];
  poly(G.R2, RTOP, yR2 + 0.02, 0.32, M.greyFloor);
  poly(
    G.R2,
    [
      [19.4, 1.3],
      [22.4, 1.0],
      [22.4, 11.15],
      [19.4, 11.2],
    ],
    yR2 + 0.02,
    0.32,
    M.plinth
  );
  wall(G.R2, WR, 22.4, 1.0, 35.8, -0.3, yR2, FH, TN, [fwin(0.15, 2.6, 0.6, 2.8)], GR);
  wall(G.R2, WR, 35.8, -0.3, 36.1, 6.7, yR2, FH, TN, [fwin(0.5, 3.2, 0.6, 2.8)], GR);
  wall(
    G.R2,
    WR,
    36.1,
    6.7,
    22.6,
    8.0,
    yR2,
    FH,
    TN,
    [
      { f: 0.25, w: 4.0, hi: 2.8, door: 'glass' },
      fwin(0.6, 4.0, 0.2, 2.8),
      fwin(0.88, 1.6, 0.6, 2.8),
    ],
    GR
  );
  wall(G.R2, WR, 22.6, 8.0, 22.4, 1.0, yR2, FH, TN, [fwin(0.55, 4.2, 0.4, 2.9)], GR);
  wall(
    G.R2,
    WR,
    X(1245),
    -0.05,
    X(1245) + 0.1,
    6.85,
    yR2,
    FH,
    TI,
    [{ f: 0.75, w: 1.0, door: 'glass' }],
    GR
  );
  F.railing(fg.R2, 36.2, 9.0, 23.2, 11.1, yR2);
  F.railing(fg.R2, 23.2, 11.1, 19.4, 11.2, yR2);
  F.railing(fg.R2, 19.4, 11.2, 19.4, 1.3, yR2);
  const rl = yR2 + 0.02;
  F.rug(fg.R2, X(1015), rl, Z(455), 2.6, 1.6, M.rugBlue, 0.3);
  F.rug(fg.R2, X(1110), rl, Z(445), 2.0, 1.2, M.rugBeige, -0.2);
  obj(fg.R2, X(945), rl, Z(400))
    .box(M.oak, 0, 0.22, -0.5, 2.6, 0.44, 0.7)
    .box(M.oak, -1.0, 0.22, 0.4, 0.7, 0.44, 1.6)
    .box(M.blue, -0.4, 0.55, -0.55, 0.6, 0.3, 0.3)
    .box(M.yellow, 0.4, 0.55, -0.55, 0.6, 0.3, 0.3);
  const loungeChairs: [number, number, Mat, number][] = [
    [1045, 395, M.yellow, 0.6],
    [1065, 415, M.blue, 2.4],
    [995, 440, M.yellow, 4.1],
    [1030, 495, M.blue, 1.3],
    [1065, 470, M.yellow, 5.2],
  ];
  for (const [px, py, m, ry] of loungeChairs) F.chair(fg.R2, X(px), rl, Z(py), ry, m);
  F.beanbag(fg.R2, X(1180), rl, Z(385), M.blue);
  F.beanbag(fg.R2, X(1195), rl, Z(425), M.blue);
  F.beanbag(fg.R2, X(930), rl, Z(475), M.blue);
  F.pouf(fg.R2, X(935), rl, Z(520), 0.3, M.yellow);
  obj(fg.R2, X(1165), rl, Z(337)).box(M.woodDark, 0, 1.0, 0, 3.6, 0.06, 0.3);
  F.table(fg.R2, X(1165), rl, Z(505), 1.6, 0.5, -0.1, M.oak, 0.9);
  F.stair(fg.R2, X(870), Z(300), X(1050), Z(355), yR1, yR2, '+x', M.oak, false);
  obj(fg.R2, X(1300), rl, Z(445))
    .cyl(M.white, 0, 0.73, 0, 1.2, 0.04, 3.0)
    .cyl(M.black, 0, 0.36, 0, 0.12, 0.72, 0.12);
  for (const dz of [-1.0, -0.35, 0.35, 1.0]) {
    F.officeChair(fg.R2, X(1300) - 0.95, rl, Z(445) + dz, Math.PI / 2, M.blueDark);
    F.officeChair(fg.R2, X(1300) + 0.95, rl, Z(445) + dz, -Math.PI / 2, M.blueDark);
  }
  F.screenWall(fg.R2, X(1300), rl, 0.15, 1.6, 0, 0.9, 1.4);
  for (const x of [24.5, 28.5, 32.5]) F.plant(fg.R2, x, rl, 9.6 - (x - 24) * 0.12, 1.0);

  // Roof — green roof with solar panels
  poly(G.Rroof, R2FP, R_ROOF, 0.35, M.slabEdge);
  poly(
    G.Rroof,
    [
      [22.7, 1.25],
      [35.5, 0.0],
      [35.8, 6.4],
      [22.9, 7.7],
    ],
    R_ROOF + 0.12,
    0.12,
    M.greenRoof
  );
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 2; j++)
      obj(fg.Rroof, 25.2 + i * 3.6, R_ROOF + 0.55, 2.6 + j * 2.6 - i * 0.25, -0.09)
        .box(M.panel, 0, 0, 0, 3.0, 0.05, 1.8, -0.35, 0, 0)
        .box(M.steel, 0, -0.25, 0.5, 2.8, 0.5, 0.05);
  R2FP.forEach(([ax, az], i) => {
    const [bx, bz] = R2FP[(i + 1) % R2FP.length];
    wall(G.Rroof, WR, ax, az, bx, bz, R_ROOF, 0.5, TN);
  });

  // =========================================================
  // GROUND, STREET AND NEIGHBOURS
  // =========================================================
  {
    const geo = new THREE.PlaneGeometry(140, 140, 70, 70);
    geo.rotateX(-Math.PI / 2);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) + 18;
      const t = THREE.MathUtils.clamp((x - 14) / 9, 0, 1);
      const far = THREE.MathUtils.clamp((x - 23) / 30, 0, 1) * 1.2;
      p.setY(i, t * t * (3 - 2 * t) * PL + far - 0.02);
    }
    geo.computeVertexNormals();
    const ground = new THREE.Mesh(geo, M.cobble);
    ground.position.set(18, 0, 5.5);
    ground.receiveShadow = true;
    root.add(ground);
    const nb = (x0: number, z0: number, x1: number, z1: number, h: number, roof = true) => {
      const y = THREE.MathUtils.clamp((x0 - 14) / 9, 0, 1) * PL;
      obj(G.context, (x0 + x1) / 2, y, (z0 + z1) / 2).box(
        M.neighbor,
        0,
        h / 2,
        0,
        x1 - x0,
        h,
        z1 - z0
      );
      if (roof)
        obj(G.context, (x0 + x1) / 2, y + h, (z0 + z1) / 2)
          .box(M.neighborRoof, 0, 0.6, 0, x1 - x0 + 0.5, 1.2, z1 - z0 + 0.5)
          .box(M.neighborRoof, 0, 1.45, 0, (x1 - x0) * 0.6, 0.5, (z1 - z0) * 0.5);
    };
    nb(0, -12, 12, -0.3, 7.2);
    nb(12.5, -9, 22, -0.3, 6.5);
    nb(22.5, -10, 37, -0.6, 7.0);
    nb(37.5, -2, 48, 9, 9.0, false);
    nb(2, 22, 17, 31, 4.6);
    nb(24, 23, 40, 33, 5.0);
    for (const [x, z] of [
      [-6, 14],
      [44, 15],
      [8, -18],
    ])
      F.tree(G.context, x, 0, z, 1.0);
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
    const portrait = L.freeH > L.freeW * 1.1 && v !== 'ext';
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
