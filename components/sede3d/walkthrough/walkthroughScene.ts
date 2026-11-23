import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { TrainingRoomSign } from './trainingRoomSigns';
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
 *     `info:<roomId>` (`visita: 'info'`, `sala`, `area`, `piso`) for the room info points, and
 *     `mapa` (`visita: 'mapa'`, `x`, `y`) with the plan axes used by the minimap.
 *
 * The walker itself (collision, stairs, gravity) lives in walker.ts. Import this module
 * dynamically: three.js must never run on the server.
 */
export type SpotId = 'entrada' | 'piso0' | 'piso1' | 'formacao' | 'piso2';

/** A room of the building, from its info point. */
export type RoomInfo = { id: string; name: string; area: number; floor: string };

/** What the visitor opened: a room's info point, or a training-room sign. */
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
  /** Open whatever is under the crosshair. */
  interact: () => void;
  dispose: () => void;
};

type Options = {
  container: HTMLElement;
  url: string;
  signs: TrainingRoomSign[];
  onProgress: (fraction: number) => void;
  onLoad: (map: WalkMap) => void;
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

// ---------- Info points ----------

const infoTexture = () => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  if (g) {
    g.fillStyle = 'rgba(255,255,255,0.95)';
    g.beginPath();
    g.arc(64, 64, 62, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = BRAND_GREEN;
    g.beginPath();
    g.arc(64, 64, 54, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#ffffff';
    g.font = '700 78px Georgia, serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('i', 64, 68);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
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
    entry.rooms.push({ id, name, d });
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
  const spots = new Map<string, { feet: THREE.Vector3; yaw: number }>();
  const rooms = new Map<string, RoomInfo & { at: THREE.Vector3 }>();
  const roomFloors: THREE.Object3D[] = [];
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

  const roomByName = (name: string) => [...rooms.values()].find((r) => r.name === name) ?? null;
  const publicRoom = ({ id, name, area, floor }: RoomInfo): RoomInfo => ({ id, name, area, floor });

  const goTo = (id: SpotId) => {
    const spot = spots.get(id);
    if (!spot || !walker) return;
    walker.place(spot.feet);
    yaw = spot.yaw;
    pitch = 0;
  };

  const goToRoom = (id: string) => {
    const room = rooms.get(id);
    if (!room || !walker) return;
    walker.place(room.at);
    pitch = 0;
  };

  // ---------- loading ----------
  let disposed = false;
  const dot = infoTexture();
  new GLTFLoader().load(
    url,
    (gltf) => {
      if (disposed) return;
      const root = gltf.scene;
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
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: dot, transparent: true, depthWrite: false })
        );
        sprite.scale.setScalar(0.3);
        sprite.position.copy(room.at);
        sprite.userData.baseY = room.at.y;
        scene.add(sprite);
        const sign = signs.find((s) =>
          anchors.some((a) => a.id === s.roomId && a.sala === room.name)
        );
        targets.push({
          object: sprite,
          label: room.name,
          open: () => ({ room: publicRoom(room), sign: sign ?? null }),
        });
      }
      for (const anchor of anchors) {
        const sign = signs.find((s) => s.roomId === anchor.id);
        if (!sign) continue;
        const panel = makeSign(sign, renderer);
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

      goTo('entrada');
      onLoad(buildMap(root, mapAxes.x, mapAxes.y, rooms));
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
    if (!target) return;
    if (document.pointerLockElement === canvas) document.exitPointerLock();
    keys.clear();
    onInteract(target.open());
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
    if (tapped) interact(tapped);
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
    const t = clock.elapsedTime;
    if (walker) {
      const forward =
        (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) -
        (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) +
        joystick.y;
      const right =
        (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) -
        (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) +
        joystick.x;
      walker.advance(dt, yaw, {
        forward,
        right,
        run: keys.has('ShiftLeft') || keys.has('ShiftRight'),
      });
      // never leave the visitor falling forever below the model
      if (walker.feet.y < lowest) goTo('entrada');
      camera.position.set(walker.feet.x, walker.feet.y + EYE, walker.feet.z);
    }
    camera.rotation.set(pitch, yaw, 0);

    for (const target of targets) {
      if ((target.object as THREE.Sprite).isSprite) {
        target.object.position.y = target.object.userData.baseY + Math.sin(t * 2) * 0.03;
        target.object.scale.setScalar(target === aimed ? 0.38 : 0.3);
      }
    }

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
        if (!mesh.isMesh && !(o as THREE.Sprite).isSprite) return;
        mesh.geometry?.dispose();
        ([] as THREE.Material[]).concat(mesh.material).forEach((m) => {
          texturesOf(m).forEach((t) => t.dispose());
          m.dispose();
        });
      });
      dot.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
