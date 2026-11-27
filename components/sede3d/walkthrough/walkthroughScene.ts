import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { BuildingSign, TrainingRoomSign } from './trainingRoomSigns';
import { makeFacadeSign, makePlaque, type Board, type BoardContent } from './namingSigns';
import { buildCollision, createWalker, extraOf, EYE, groupOf } from './walker';

/**
 * First-person walkthrough of the architect's Revit model (public/models/sede-revit.glb, built
 * by revit_glb.py in the Blender project folder).
 *
 * The GLB carries everything the walk needs as glTF extras:
 *   - every node: `grupo` (edificio | porta | mobiliario | envolvente | terreno) and `piso`;
 *   - room floors: `sala`, the room name shown on screen;
 *   - empties `spot:<id>` (`visita: 'spot'`, `dir`) for the floor buttons,
 *     `sign:<roomId>` (`visita: 'sign'`, `sala`, `normal`) for the training-room panels,
 *     `plaque:<roomId>` (`visita: 'plaque'`, `sala`, `normal`, `standing`) for the naming
 *     plaques by the training rooms' doors (on the wall, or on a stand at its foot),
 *     `facade:edificio` (`visita: 'facade'`, `normal`, `width`, `height`) for the building's sign,
 *     `info:<roomId>` (`visita: 'info'`, `sala`, `area`, `piso`) for the room info points, and
 *     `mapa` (`visita: 'mapa'`, `x`, `y`) with the plan axes used by the minimap.
 *
 * The walker itself (collision, stairs, gravity) lives in walker.ts. Import this module
 * dynamically: three.js must never run on the server.
 */
export type SpotId = 'entrada' | 'piso0' | 'piso1' | 'formacao' | 'piso2';

/** A room of the building, from its info point. */
export type RoomInfo = {
  id: string;
  name: string;
  area: number;
  floor: string;
  /** The training-room sign in this room, if any (TrainingRoomSign.roomId). */
  signId: string | null;
};

/** What the visitor opened: a training-room sign, and the room it is in. */
export type Interaction = { room: RoomInfo; sign: TrainingRoomSign | null };

/** Plan of one floor for the minimap, in SVG units (metres, y down). */
export type FloorPlan = {
  floor: string;
  rooms: { id: string | null; name: string; d: string }[];
  /** Walls and glass cut 1.2 m above the floor, as one stroked path. */
  walls: string;
};
export type WalkMap = { floors: FloorPlan[]; viewBox: [number, number, number, number] };
/** Where the visitor is on the plan, facing `heading` (radians, clockwise from plan up). */
export type Pose = { x: number; y: number; heading: number; floor: string | null };

export type WalkthroughScene = {
  goTo: (id: SpotId) => void;
  goToRoom: (id: string) => void;
  /** Mouse look with pointer lock. Must be called from a click handler. */
  lock: () => void;
  /** Joystick input from the UI, x to the right and y forwards, each in −1…1. */
  setJoystick: (x: number, y: number) => void;
  /** Open the sign under the crosshair. */
  interact: () => void;
  /** Show or hide the door leaves (every doorway can be walked through either way). */
  setDoorsVisible: (visible: boolean) => void;
  /** On-screen movement buttons: forward (−1…1) and turn (−1…1, positive to the left). */
  setControls: (forward: number, turn: number) => void;
  /** Walking speed factor (1 is normal). */
  setSpeed: (factor: number) => void;
  /**
   * Naming trial: show a name and a logo (any URL, e.g. an object URL of a local file) where a
   * sponsor's would go. For a training room, the logo is painted on the room's front wall
   * (`width` metres wide, the room's sign hidden meanwhile) and the door plaque shows the name
   * and logo; for the building, the façade sign does. `null` puts everything back.
   */
  previewNaming: (trial: NamingTrial | null) => void;
  /**
   * Stand where a naming trial shows: in front of a training room's front wall (`'sala'`) or of
   * its door plaque (`'porta'`); across the street from the façade sign for the building.
   */
  viewSign: (target: NamingTarget, where?: 'sala' | 'porta') => void;
  dispose: () => void;
};

export type NamingTarget = TrainingRoomSign['roomId'] | 'edificio';
export type NamingTrial = { target: NamingTarget; url: string | null; name: string; width: number };

type Options = {
  container: HTMLElement;
  url: string;
  signs: TrainingRoomSign[];
  /** The façade sign's default content (the training centre's name today). */
  building: BuildingSign;
  onProgress: (fraction: number) => void;
  onLoad: (map: WalkMap, rooms: RoomInfo[]) => void;
  onError: () => void;
  onRoom: (room: string | null) => void;
  onLockChange: (locked: boolean) => void;
  /** The label of what the crosshair is on (null: nothing to open). */
  onAim: (label: string | null) => void;
  onInteract: (what: Interaction) => void;
  onPose: (pose: Pose) => void;
};

type Vec3 = [number, number, number];

const SKY = 0xe6eef0;
const LOOK = 0.0022;
/** Turning with the arrow keys or the on-screen buttons, in radians per second. */
const TURN = 1.6;
const DRAG_LOOK = 0.005;
const AIM_RANGE = 9;
const MAP_CUT = 1.2;
const BRAND_GREEN = '#0a7558';

const yawFor = (dir: THREE.Vector3) => Math.atan2(-dir.x, -dir.z);
const salaOf = (o: THREE.Object3D) => extraOf(o, 'sala') as string | undefined;
const pisoOf = (o: THREE.Object3D) => extraOf(o, 'piso') as string | undefined;
/** Every texture a material uses (colour, normal, roughness…). */
const texturesOf = (m: THREE.Material) =>
  Object.values(m).filter(
    (v): v is THREE.Texture => (v as THREE.Texture | null)?.isTexture === true
  );
const materialName = (mesh: THREE.Mesh) =>
  ([] as THREE.Material[]).concat(mesh.material)[0]?.name ?? '';

// ---------- Training room signs ----------

/** Canvas layout units (metres at PX pixels per metre); the panel is drawn at PANEL_W wide. */
const SIGN_W = 3.0;
const SIGN_H = 1.3;
const PANEL_W = 2.6;
const PANEL_H = (PANEL_W * SIGN_H) / SIGN_W;
const PX = 400; // texture pixels per metre

const drawSign = (sign: TrainingRoomSign, images: (HTMLImageElement | null)[]) => {
  const canvas = document.createElement('canvas');
  canvas.width = SIGN_W * PX;
  canvas.height = SIGN_H * PX;
  const g = canvas.getContext('2d');
  if (!g) return canvas;
  const { width: w, height: h } = canvas;
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, w, h);
  g.fillStyle = BRAND_GREEN;
  g.fillRect(0, 0, w, 26);
  g.fillStyle = '#1f3a68'; // ink
  g.font = '600 96px Oswald, "Arial Narrow", sans-serif';
  g.fillText(sign.name, 64, 170);
  g.fillStyle = 'rgba(0,0,0,0.6)';
  g.font = '400 40px Inter, Arial, sans-serif';
  g.fillText(sign.text, 68, 236);
  // logos, each fitted into a box on the bottom row
  const boxH = 170;
  const boxW = 400;
  let x = 64;
  images.forEach((img) => {
    if (!img) return;
    const iw = img.naturalWidth || 300;
    const ih = img.naturalHeight || 150;
    const s = Math.min(boxW / iw, boxH / ih);
    g.drawImage(img, x, h - 64 - ih * s, iw * s, ih * s);
    x += iw * s + 60;
  });
  return canvas;
};

const loadImage = (url: string | null | undefined) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });

const makeSign = (sign: TrainingRoomSign, renderer: THREE.WebGLRenderer) => {
  const texture = new THREE.CanvasTexture(drawSign(sign, []));
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(PANEL_W, PANEL_H),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.6 })
  );
  panel.position.z = 0.012;
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(PANEL_W + 0.08, PANEL_H + 0.08, 0.02),
    new THREE.MeshStandardMaterial({ color: BRAND_GREEN, roughness: 0.5 })
  );
  const group = new THREE.Group();
  group.add(panel, back);
  Promise.all(sign.logos.map((l) => loadImage(l.logo.url))).then((images) => {
    texture.image = drawSign(sign, images);
    texture.needsUpdate = true;
  });
  return group;
};

// ---------- Minimap ----------

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Plans of every floor: room floors (their upward faces) and a horizontal cut of the walls. */
const buildMap = (
  root: THREE.Object3D,
  axisX: THREE.Vector3,
  axisY: THREE.Vector3,
  rooms: Map<string, RoomInfo>
): WalkMap => {
  const plan = (p: THREE.Vector3): [number, number] => [r2(p.dot(axisX)), r2(-p.dot(axisY))];
  const bounds = new THREE.Box2();
  const floorMeshes: THREE.Mesh[] = [];
  const wallMeshes: THREE.Mesh[] = [];
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    if (salaOf(mesh)) floorMeshes.push(mesh);
    else if (
      groupOf(mesh) === 'edificio' &&
      ['parede', 'madeira', 'vidro'].includes(materialName(mesh))
    )
      wallMeshes.push(mesh);
  });

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const n = new THREE.Vector3();
  const edge = new THREE.Vector3();
  const triangles = (
    mesh: THREE.Mesh,
    each: (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => void
  ) => {
    const pos = mesh.geometry.attributes.position;
    const index = mesh.geometry.index;
    const count = index ? index.count : pos.count;
    const at = (v: THREE.Vector3, i: number) =>
      v.fromBufferAttribute(pos, index ? index.getX(i) : i).applyMatrix4(mesh.matrixWorld);
    for (let i = 0; i < count; i += 3) each(at(a, i), at(b, i + 1), at(c, i + 2));
  };

  // room floors, grouped by floor; each floor's cut height is 1.2 m above its highest room
  const byFloor = new Map<string, { rooms: FloorPlan['rooms']; top: number }>();
  for (const mesh of floorMeshes) {
    const floor = pisoOf(mesh) ?? '?';
    const name = salaOf(mesh) ?? '';
    const box = new THREE.Box3().setFromObject(mesh);
    let d = '';
    triangles(mesh, (p, q, r) => {
      n.subVectors(q, p).cross(edge.subVectors(r, p));
      if (n.y <= 0 || n.y < 0.9 * n.length() || p.y < box.max.y - 0.05) return;
      const pts = [p, q, r].map(plan);
      pts.forEach(([x, y]) => bounds.expandByPoint(new THREE.Vector2(x, y)));
      d += `M${pts[0]}L${pts[1]}L${pts[2]}Z`;
    });
    const entry = byFloor.get(floor) ?? { rooms: [], top: -Infinity };
    const id = [...rooms.values()].find((r) => r.name === name)?.id ?? null;
    // a slab's second material (its sides) has no top face: nothing to draw
    if (d) entry.rooms.push({ id, name, d });
    entry.top = Math.max(entry.top, box.max.y);
    byFloor.set(floor, entry);
  }

  const floors: FloorPlan[] = [...byFloor.entries()]
    .sort(([x], [y]) => x.localeCompare(y))
    .map(([floor, { rooms: floorRooms, top }]) => {
      const h = top + MAP_CUT;
      let walls = '';
      const cut: [number, number][] = [];
      for (const mesh of wallMeshes) {
        triangles(mesh, (p, q, r) => {
          cut.length = 0;
          for (const [u, v] of [
            [p, q],
            [q, r],
            [r, p],
          ] as const) {
            if (u.y < h !== v.y < h) cut.push(plan(u.clone().lerp(v, (h - u.y) / (v.y - u.y))));
          }
          if (cut.length === 2) walls += `M${cut[0]}L${cut[1]}`;
        });
      }
      return { floor, rooms: floorRooms, walls };
    });

  const pad = 1.5;
  return {
    floors,
    viewBox: [
      r2(bounds.min.x - pad),
      r2(bounds.min.y - pad),
      r2(bounds.max.x - bounds.min.x + 2 * pad),
      r2(bounds.max.y - bounds.min.y + 2 * pad),
    ],
  };
};

export function createWalkthroughScene({
  container,
  url,
  signs,
  building: buildingSign,
  onProgress,
  onLoad,
  onError,
  onRoom,
  onLockChange,
  onAim,
  onInteract,
  onPose,
}: Options): WalkthroughScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.touchAction = 'none';
  container.appendChild(renderer.domElement);
  const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(SKY);
  scene.fog = new THREE.Fog(SKY, 60, 160);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;
  // Interiors get no direct sun, so the environment is what lights them.
  scene.environmentIntensity = 0.75;

  const camera = new THREE.PerspectiveCamera(70, 1, 0.05, 400);
  camera.rotation.order = 'YXZ';

  scene.add(new THREE.HemisphereLight(0xf2f4f8, 0x8a8478, 0.7));
  const sun = new THREE.DirectionalLight(0xfff3e0, 2.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.08;
  Object.assign(sun.shadow.camera, {
    left: -40,
    right: 40,
    top: 40,
    bottom: -40,
    near: 1,
    far: 200,
  });
  scene.add(sun, sun.target);

  // ---------- state ----------
  let walker: ReturnType<typeof createWalker> | null = null;
  let octree: ReturnType<typeof buildCollision> | null = null;
  let yaw = 0;
  let pitch = 0;
  let currentRoom: string | null = null;
  let currentFloor: string | null = null;
  const keys = new Set<string>();
  const joystick = new THREE.Vector2();
  const controls = { forward: 0, turn: 0 };
  let speed = 1;
  // click (or tap) on a floor to walk there
  let target: THREE.Vector3 | null = null;
  let targetBest = Infinity;
  let targetStuck = 0;
  const marker = new THREE.Mesh(
    new THREE.RingGeometry(0.16, 0.24, 40),
    new THREE.MeshBasicMaterial({
      color: BRAND_GREEN,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    })
  );
  marker.rotation.x = -Math.PI / 2;
  marker.visible = false;
  scene.add(marker);
  const stopWalking = () => {
    target = null;
    marker.visible = false;
  };
  const spots = new Map<string, { feet: THREE.Vector3; yaw: number }>();
  const rooms = new Map<string, RoomInfo & { at: THREE.Vector3 }>();
  const roomFloors: THREE.Object3D[] = [];
  const doors: THREE.Object3D[] = [];
  let doorsVisible = true;
  /** Things the crosshair can open. */
  const targets: { object: THREE.Object3D; label: string; open: () => Interaction }[] = [];
  const mapAxes = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 0, -1) };
  let lowest = -20;

  const floorRay = new THREE.Raycaster(undefined, new THREE.Vector3(0, -1, 0), 0, 2);
  const floorUnderfoot = () => {
    if (!walker) return null;
    const { feet } = walker;
    floorRay.ray.origin.set(feet.x, feet.y + 0.5, feet.z);
    return floorRay.intersectObjects(roomFloors, false)[0]?.object ?? null;
  };

  // signs by room id, with what the logo preview needs
  const signWalls = new Map<
    string,
    { panel: THREE.Object3D; center: THREE.Vector3; normal: THREE.Vector3; maxWidth: number }
  >();
  const logoMaterial = new THREE.MeshStandardMaterial({
    transparent: true,
    roughness: 0.7,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  });
  const logoDecal = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), logoMaterial);
  logoDecal.visible = false;
  scene.add(logoDecal);
  let logoRequest = 0;
  let modelRoot: THREE.Object3D | null = null;
  // naming boards, with what they show by default
  const plaques = new Map<
    string,
    { board: Board; content: BoardContent; at: THREE.Vector3; normal: THREE.Vector3 }
  >();
  let facade: {
    board: Board;
    content: BoardContent;
    center: THREE.Vector3;
    normal: THREE.Vector3;
  } | null = null;
  const boardAnchors: {
    kind: 'plaque' | 'facade';
    id: string;
    sala: string;
    at: THREE.Vector3;
    normal: THREE.Vector3;
    standing: boolean;
    width: number;
    height: number;
  }[] = [];

  const roomByName = (name: string) => [...rooms.values()].find((r) => r.name === name) ?? null;
  const publicRoom = ({ id, name, area, floor, signId }: RoomInfo): RoomInfo => ({
    id,
    name,
    area,
    floor,
    signId,
  });

  const goTo = (id: SpotId) => {
    const spot = spots.get(id);
    if (!spot || !walker) return;
    stopWalking();
    walker.place(spot.feet);
    yaw = spot.yaw;
    pitch = 0;
  };

  const goToRoom = (id: string) => {
    const room = rooms.get(id);
    if (!room || !walker) return;
    stopWalking();
    walker.place(room.at);
    pitch = 0;
  };

  // ---------- loading ----------
  let disposed = false;
  new GLTFLoader().load(
    url,
    (gltf) => {
      if (disposed) return;
      const root = gltf.scene;
      modelRoot = root;
      scene.add(root);
      root.updateMatrixWorld(true);
      const building = new THREE.Box3();
      const anchors: {
        sala: string;
        id: string;
        center: THREE.Vector3;
        normal: THREE.Vector3;
        /** Clear width of the wall there, in metres (the panel shrinks to fit). */
        width: number;
      }[] = [];
      root.traverse((o) => {
        const extras = o.userData;
        if (extras.visita === 'spot') {
          spots.set(extras.id, {
            feet: o.getWorldPosition(new THREE.Vector3()),
            yaw: yawFor(new THREE.Vector3(...(extras.dir as Vec3))),
          });
        }
        if (extras.visita === 'plaque' || extras.visita === 'facade') {
          boardAnchors.push({
            kind: extras.visita,
            id: extras.id,
            sala: extras.sala ?? '',
            at: o.getWorldPosition(new THREE.Vector3()),
            normal: new THREE.Vector3(...(extras.normal as Vec3)).normalize(),
            standing: extras.standing === true,
            width: typeof extras.width === 'number' ? extras.width : 3.6,
            height: typeof extras.height === 'number' ? extras.height : 0.9,
          });
        }
        if (extras.visita === 'sign') {
          anchors.push({
            id: extras.id,
            sala: extras.sala,
            center: o.getWorldPosition(new THREE.Vector3()),
            normal: new THREE.Vector3(...(extras.normal as Vec3)),
            width: typeof extras.width === 'number' ? extras.width : PANEL_W,
          });
        }
        if (extras.visita === 'info') {
          rooms.set(extras.id, {
            id: extras.id,
            name: extras.sala,
            area: extras.area,
            floor: extras.piso,
            signId: null,
            at: o.getWorldPosition(new THREE.Vector3()),
          });
        }
        if (extras.visita === 'mapa') {
          mapAxes.x.set(...(extras.x as Vec3));
          mapAxes.y.set(...(extras.y as Vec3));
        }
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        if (salaOf(mesh)) roomFloors.push(mesh);
        if (groupOf(mesh) === 'porta') {
          doors.push(mesh);
          mesh.visible = doorsVisible;
        }
        const materials = ([] as THREE.Material[]).concat(mesh.material);
        const transparent = materials.some((m) => m.transparent);
        // floors are seen at grazing angles: keep their textures sharp
        materials.forEach((m) => texturesOf(m).forEach((t) => (t.anisotropy = maxAnisotropy)));
        mesh.castShadow = !transparent;
        mesh.receiveShadow = true;
        if (groupOf(mesh) === 'edificio') building.expandByObject(mesh);
      });
      octree = buildCollision(root);
      walker = createWalker(octree);
      lowest = octree.box ? octree.box.min.y - 5 : -20;

      const center = building.getCenter(new THREE.Vector3());
      sun.position.copy(center).add(new THREE.Vector3(-60, 80, 40));
      sun.target.position.copy(center);

      for (const room of rooms.values()) {
        room.signId = anchors.find((a) => a.sala === room.name)?.id ?? null;
      }
      for (const anchor of anchors) {
        const sign = signs.find((s) => s.roomId === anchor.id);
        if (!sign) continue;
        const panel = makeSign(sign, renderer);
        signWalls.set(anchor.id, {
          panel,
          center: anchor.center.clone(),
          normal: anchor.normal.clone().normalize(),
          maxWidth: anchor.width,
        });
        panel.position.copy(anchor.center);
        panel.scale.setScalar(Math.min(1, anchor.width / PANEL_W));
        panel.lookAt(anchor.center.clone().add(anchor.normal));
        scene.add(panel);
        const room = roomByName(anchor.sala);
        if (room)
          targets.push({
            object: panel,
            label: sign.name,
            open: () => ({ room: publicRoom(room), sign }),
          });
      }

      // naming: a plaque by each training room's door, the sign on the façade
      for (const a of boardAnchors) {
        if (a.kind === 'plaque') {
          const sign = signs.find((x) => x.roomId === a.id);
          const content: BoardContent = {
            name: sign?.name ?? '',
            text: '',
            logo: sign?.logos[0]?.logo.url ?? null,
          };
          const board = makePlaque(a.sala, renderer, a.standing);
          board.object.position.copy(a.at);
          board.object.lookAt(a.at.clone().add(a.normal.clone().setY(0)));
          scene.add(board.object);
          board.show(content);
          plaques.set(a.id, { board, content, at: a.at.clone(), normal: a.normal.clone() });
        } else {
          const content: BoardContent = {
            name: buildingSign.name,
            text: buildingSign.text,
            logo: buildingSign.logo?.logo.url ?? null,
          };
          const board = makeFacadeSign(a.width, a.height, renderer);
          board.object.position.copy(a.at);
          board.object.lookAt(a.at.clone().add(a.normal));
          scene.add(board.object);
          board.show(content);
          facade = { board, content, center: a.at.clone(), normal: a.normal.clone() };
        }
      }

      goTo('entrada');
      onLoad(buildMap(root, mapAxes.x, mapAxes.y, rooms), [...rooms.values()].map(publicRoom));
    },
    (e) => {
      if (e.total) onProgress(e.loaded / e.total);
    },
    () => {
      if (!disposed) onError();
    }
  );

  // ---------- aiming ----------
  const aimRay = new THREE.Raycaster();
  aimRay.far = AIM_RANGE;
  const CENTRE = new THREE.Vector2();
  let aimed: (typeof targets)[number] | null = null;
  /** The target along a ray from the camera through ndc, unless a wall is in front of it. */
  const pick = (ndc: THREE.Vector2) => {
    aimRay.setFromCamera(ndc, camera);
    const hit = aimRay.intersectObjects(
      targets.map((t) => t.object),
      true
    )[0];
    if (!hit || !octree) return null;
    const wall = octree.rayIntersect(aimRay.ray);
    if (wall && wall.distance < hit.distance - 0.05) return null;
    return targets.find((t) => t.object === hit.object || t.object === hit.object.parent) ?? null;
  };
  const interact = (target = aimed) => {
    if (target) onInteract(target.open());
  };

  // ---------- input ----------
  const canvas = renderer.domElement;
  const onKey = (down: boolean) => (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (down) keys.add(e.code);
    else keys.delete(e.code);
    if (down && e.code === 'KeyE') interact();
    if (down && e.code.startsWith('Arrow')) e.preventDefault();
    if (down && /^(Key[WASD]|Arrow)/.test(e.code)) stopWalking();
  };
  const onKeyDown = onKey(true);
  const onKeyUp = onKey(false);
  const clampPitch = () => {
    pitch = Math.max(-1.4, Math.min(1.4, pitch));
  };
  const onMouseMove = (e: MouseEvent) => {
    if (document.pointerLockElement !== canvas) return;
    yaw -= e.movementX * LOOK;
    pitch -= e.movementY * LOOK;
    clampPitch();
  };
  const onMouseDown = () => {
    if (document.pointerLockElement === canvas) interact();
  };
  // drag to look (touch, or mouse without pointer lock); a short tap opens what is under it
  const drags = new Map<number, { x: number; y: number; x0: number; y0: number; t: number }>();
  const onPointerDown = (e: PointerEvent) => {
    if (document.pointerLockElement === canvas) return;
    drags.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY,
      x0: e.clientX,
      y0: e.clientY,
      t: e.timeStamp,
    });
    canvas.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent) => {
    const last = drags.get(e.pointerId);
    if (!last) return;
    yaw += (e.clientX - last.x) * DRAG_LOOK;
    pitch += (e.clientY - last.y) * DRAG_LOOK;
    clampPitch();
    last.x = e.clientX;
    last.y = e.clientY;
  };
  const onPointerUp = (e: PointerEvent) => {
    const d = drags.get(e.pointerId);
    drags.delete(e.pointerId);
    if (!d || e.type === 'pointercancel') return;
    if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) > 8 || e.timeStamp - d.t > 350) return;
    const r = canvas.getBoundingClientRect();
    const tapped = pick(
      new THREE.Vector2(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1
      )
    );
    if (tapped) {
      interact(tapped);
      return;
    }
    walkTowards(aimRay.ray);
  };
  const triNormal = new THREE.Vector3();
  /** Walk to the floor point under the ray (stopping half a metre short of a wall). */
  const walkTowards = (r: THREE.Ray) => {
    if (!octree || !walker) return;
    const hit = octree.rayIntersect(r);
    if (!hit || hit.distance > 40) return;
    hit.triangle.getNormal(triNormal);
    const p = hit.position.clone();
    if (Math.abs(triNormal.y) < 0.7) p.addScaledVector(r.direction, -0.5);
    const floor = walker.floorBelow(p.clone().setY(p.y + 0.5), 3);
    if (floor === null) return;
    target = new THREE.Vector3(p.x, floor, p.z);
    targetBest = Infinity;
    targetStuck = 0;
    marker.position.set(p.x, floor + 0.03, p.z);
    marker.visible = true;
  };
  const onLock = () => {
    keys.clear();
    onLockChange(document.pointerLockElement === canvas);
  };
  const onBlur = () => keys.clear();
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('pointerlockchange', onLock);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);

  // ---------- loop ----------
  const clock = new THREE.Clock();
  let slow = 0;
  let lastAimLabel: string | null = null;
  renderer.setAnimationLoop(() => {
    const dt = Math.min(0.25, clock.getDelta());
    if (walker) {
      // arrows: up and down walk, left and right turn (no mouse needed); A and D step sideways
      const turn =
        (keys.has('ArrowLeft') ? 1 : 0) - (keys.has('ArrowRight') ? 1 : 0) + controls.turn;
      let forward =
        (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) -
        (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) +
        joystick.y +
        controls.forward;
      const right = (keys.has('KeyD') ? 1 : 0) - (keys.has('KeyA') ? 1 : 0) + joystick.x;
      yaw += turn * TURN * dt;
      if (target && (forward || right || turn)) stopWalking();
      if (target) {
        // walk to the clicked spot, turning towards it on the way
        const dx = target.x - walker.feet.x;
        const dz = target.z - walker.feet.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.3) {
          stopWalking();
        } else {
          let diff = Math.atan2(-dx, -dz) - yaw;
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          yaw += Math.sign(diff) * Math.min(Math.abs(diff), TURN * 1.5 * dt);
          forward = Math.abs(diff) < 0.5 ? Math.min(1, dist) : 0;
          if (dist < targetBest - 0.02) {
            targetBest = dist;
            targetStuck = 0;
          } else if ((targetStuck += dt) > 1.5) {
            stopWalking(); // blocked (a wall, a railing): stop rather than push
          }
        }
      }
      walker.advance(dt, yaw, {
        forward,
        right,
        run: keys.has('ShiftLeft') || keys.has('ShiftRight'),
        speed,
      });
      // never leave the visitor falling forever below the model
      if (walker.feet.y < lowest) goTo('entrada');
      camera.position.set(walker.feet.x, walker.feet.y + EYE, walker.feet.z);
    }
    camera.rotation.set(pitch, yaw, 0);

    slow += dt;
    if (walker && slow > 0.1) {
      slow = 0;
      aimed = pick(CENTRE);
      const label = aimed?.label ?? null;
      if (label !== lastAimLabel) {
        lastAimLabel = label;
        onAim(label);
      }
      const floorMesh = floorUnderfoot();
      const room = floorMesh ? (salaOf(floorMesh) ?? null) : null;
      if (room !== currentRoom) {
        currentRoom = room;
        onRoom(room);
      }
      if (floorMesh) currentFloor = pisoOf(floorMesh) ?? currentFloor;
      const { feet } = walker;
      // heading on the plan: 0 is plan up (+y), clockwise positive
      const look = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
      onPose({
        x: r2(feet.dot(mapAxes.x)),
        y: r2(-feet.dot(mapAxes.y)),
        heading: Math.atan2(look.dot(mapAxes.x), look.dot(mapAxes.y)),
        floor: currentFloor,
      });
    }
    renderer.render(scene, camera);
  });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  return {
    goTo,
    goToRoom,
    lock: () => {
      canvas.requestPointerLock();
    },
    setJoystick: (x, y) => {
      joystick.set(x, y);
    },
    interact: () => interact(),
    setControls: (forward, turn) => {
      controls.forward = forward;
      controls.turn = turn;
      if (forward || turn) stopWalking();
    },
    setSpeed: (factor) => {
      speed = factor;
    },
    previewNaming: (trial) => {
      const request = ++logoRequest;
      // back to the defaults first
      signWalls.forEach((w) => (w.panel.visible = true));
      logoDecal.visible = false;
      plaques.forEach((p) => p.board.show(p.content));
      facade?.board.show(facade.content);
      if (!trial) return;
      if (trial.target === 'edificio') {
        if (facade)
          facade.board.show({
            name: trial.name || facade.content.name,
            text: trial.name ? '' : facade.content.text,
            logo: trial.url ?? facade.content.logo,
          });
        return;
      }
      const plaque = plaques.get(trial.target);
      plaque?.board.show({
        name: trial.name || plaque.content.name,
        text: '',
        logo: trial.url ?? plaque.content.logo,
      });
      const wall = signWalls.get(trial.target);
      if (!wall || !trial.url) return;
      loadImage(trial.url).then((img) => {
        if (!img || request !== logoRequest || disposed) return;
        const aspect = (img.naturalHeight || 1) / (img.naturalWidth || 1);
        // fit the wall: no wider than its clear width, no taller than 2.2 m
        const w = Math.min(trial.width, wall.maxWidth, 2.2 / aspect);
        // a new texture per image: WebGL2 storage is sized once, so swapping the image of an
        // existing texture for one of another size does not show
        logoMaterial.map?.dispose();
        const texture = new THREE.Texture(img);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.needsUpdate = true;
        logoMaterial.map = texture;
        logoMaterial.needsUpdate = true;
        logoDecal.scale.set(w, w * aspect, 1);
        logoDecal.position.copy(wall.center).addScaledVector(wall.normal, 0.01);
        logoDecal.lookAt(wall.center.clone().add(wall.normal));
        logoDecal.visible = true;
        wall.panel.visible = false;
      });
    },
    viewSign: (target, where = 'sala') => {
      if (!walker) return;
      stopWalking();
      if (target !== 'edificio' && where === 'porta') {
        const plaque = plaques.get(target);
        if (!plaque) return;
        const flat = plaque.normal.clone().setY(0).normalize();
        // back from the plaque as far as the corridor allows (up to 2.2 m)
        const eyeAt = plaque.at.clone().setY(plaque.at.y + 0.05);
        const ahead = new THREE.Raycaster(eyeAt.clone().addScaledVector(flat, 0.05), flat, 0, 2.6);
        const free = modelRoot ? ahead.intersectObject(modelRoot, true)[0]?.distance : undefined;
        const back = Math.max(0.9, Math.min(2.2, (free ?? 2.6) - 0.4));
        walker.place(
          plaque.at
            .clone()
            .setY(plaque.at.y + 0.2)
            .addScaledVector(flat, back)
        );
        yaw = yawFor(flat.clone().negate());
        pitch = -0.1;
        return;
      }
      if (target === 'edificio') {
        if (!facade) return;
        // on the street below the sign, as far back as the houses across the travessa allow,
        // looking up at it
        const flat = facade.normal.clone().setY(0).normalize();
        const ahead = new THREE.Raycaster(
          facade.center.clone().addScaledVector(flat, 0.3),
          flat,
          0,
          14
        );
        const across = modelRoot ? ahead.intersectObject(modelRoot, true)[0]?.distance : undefined;
        const back = Math.max(3, Math.min(12, (across ?? 14) - 1.0));
        const p = facade.center.clone().addScaledVector(flat, back);
        const street = walker.floorBelow(p, 30);
        if (street !== null) p.y = street;
        walker.place(p);
        yaw = yawFor(flat.clone().negate());
        pitch = Math.atan2(facade.center.y - (walker.feet.y + EYE), back);
        return;
      }
      const wall = signWalls.get(target);
      if (!wall) return;
      const flat = wall.normal.clone().setY(0).normalize();
      walker.place(wall.center.clone().addScaledVector(flat, 4.5));
      yaw = yawFor(flat.clone().negate());
      pitch = 0;
    },
    setDoorsVisible: (visible) => {
      doorsVisible = visible;
      doors.forEach((d) => (d.visible = visible));
    },
    dispose: () => {
      disposed = true;
      observer.disconnect();
      renderer.setAnimationLoop(null);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerlockchange', onLock);
      if (document.pointerLockElement === canvas) document.exitPointerLock();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        ([] as THREE.Material[]).concat(mesh.material).forEach((m) => {
          texturesOf(m).forEach((t) => t.dispose());
          m.dispose();
        });
      });
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
