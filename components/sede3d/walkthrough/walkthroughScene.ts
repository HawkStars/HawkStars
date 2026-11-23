import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import type { TrainingRoomSign } from './trainingRoomSigns';

/**
 * First-person walkthrough of the architect's Revit model (public/models/sede-revit.glb, built
 * by revit_glb.py in the Blender project folder).
 *
 * The GLB carries everything the walk needs as glTF extras:
 *   - every node: `grupo` (edificio | porta | mobiliario | envolvente | terreno) and `piso`;
 *   - room floors: `sala`, the room name shown on screen;
 *   - empties `spot:<id>` (`visita: 'spot'`, `dir`) for the floor buttons and
 *     `sign:<roomId>` (`visita: 'sign'`, `normal`) for the training-room panels.
 *
 * The walker is a capsule 1.75 m tall that collides with walls, windows, railings and
 * neighbouring buildings, climbs steps up to 35 cm, falls with gravity and cannot push its head
 * through a ceiling. Doors and furniture are not solid, so every doorway is open and rooms stay
 * walkable. Import dynamically: three.js must never run on the server.
 */
export type SpotId = 'entrada' | 'piso0' | 'piso1' | 'formacao' | 'piso2';

export type WalkthroughScene = {
  goTo: (id: SpotId) => void;
  /** Mouse look with pointer lock. Must be called from a click handler. */
  lock: () => void;
  /** Joystick input from the UI, x to the right and y forwards, each in −1…1. */
  setJoystick: (x: number, y: number) => void;
  /** Feet position in the model (metres above the 623.50 m datum in y). */
  getPosition: () => { x: number; y: number; z: number };
  dispose: () => void;
};

type Options = {
  container: HTMLElement;
  url: string;
  signs: TrainingRoomSign[];
  onProgress: (fraction: number) => void;
  onLoad: () => void;
  onError: () => void;
  onRoom: (room: string | null) => void;
  onLockChange: (locked: boolean) => void;
};

type Extras = {
  grupo?: string;
  sala?: string;
  visita?: 'spot' | 'sign';
  id?: string;
  dir?: [number, number, number];
  normal?: [number, number, number];
};

const SKY = 0xe6eef0;
const EYE = 1.62;
const HEIGHT = 1.75;
const RADIUS = 0.25;
const STEP = 0.35;
const WALK = 1.6;
const RUN = 3.4;
const GRAVITY = 9.8;
const LOOK = 0.0022;
const DRAG_LOOK = 0.005;

/** Groups the walker passes through. */
const PASSABLE_GROUPS = new Set(['porta', 'mobiliario']);
/** Surroundings materials that are not solid: overhead wires, lamp heads, tree crowns. */
const PASSABLE_SURROUNDINGS = new Set(['preto', 'lanterna', 'vidro_lanterna', 'copa', 'sebe']);

const extrasOf = (o: THREE.Object3D) => o.userData as Extras;

/** The group a node belongs to, from the glTF extras on it or on an ancestor. */
const groupOf = (o: THREE.Object3D): string | undefined => {
  for (let n: THREE.Object3D | null = o; n; n = n.parent) {
    if (extrasOf(n).grupo) return extrasOf(n).grupo;
  }
  return undefined;
};

const isSolid = (mesh: THREE.Mesh, grupo: string | undefined) => {
  if (grupo && PASSABLE_GROUPS.has(grupo)) return false;
  const name = ([] as THREE.Material[]).concat(mesh.material)[0]?.name ?? '';
  return !(grupo === 'envolvente' && PASSABLE_SURROUNDINGS.has(name));
};

const yawFor = (dir: THREE.Vector3) => Math.atan2(-dir.x, -dir.z);

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
  g.fillStyle = '#0a7558'; // brand green
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
    new THREE.MeshStandardMaterial({ color: 0x0a7558, roughness: 0.5 })
  );
  const group = new THREE.Group();
  group.add(panel, back);
  Promise.all(sign.logos.map((l) => loadImage(l.logo.url))).then((images) => {
    texture.image = drawSign(sign, images);
    texture.needsUpdate = true;
  });
  return group;
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

  // ---------- walker state ----------
  const feet = new THREE.Vector3();
  let yaw = 0;
  let pitch = 0;
  let vy = 0;
  let ready = false;
  let currentRoom: string | null = null;
  const octree = new Octree();
  const capsule = new Capsule();
  const keys = new Set<string>();
  const joystick = new THREE.Vector2();
  const spots = new Map<string, { feet: THREE.Vector3; yaw: number }>();
  const roomFloors: THREE.Object3D[] = [];

  const setCapsule = (p: THREE.Vector3) => {
    capsule.start.set(p.x, p.y + STEP + RADIUS, p.z);
    capsule.end.set(p.x, p.y + HEIGHT - RADIUS, p.z);
    capsule.radius = RADIUS;
  };

  // Downward ray against both faces of every triangle (the terrain's winding is not reliable).
  const ray = new THREE.Ray();
  const DOWN = new THREE.Vector3(0, -1, 0);
  const hitPoint = new THREE.Vector3();
  const rayTris: THREE.Triangle[] = [];
  const floorBelow = (origin: THREE.Vector3, maxDrop: number) => {
    ray.set(origin, DOWN);
    rayTris.length = 0;
    octree.getRayTriangles(ray, rayTris);
    let best = Infinity;
    for (const t of rayTris) {
      if (ray.intersectTriangle(t.a, t.b, t.c, false, hitPoint)) {
        const d = origin.y - hitPoint.y;
        if (d >= 0 && d < best) best = d;
      }
    }
    return best <= maxDrop ? origin.y - best : null;
  };

  const roomRay = new THREE.Raycaster(undefined, DOWN, 0, 2);
  const roomBelow = () => {
    roomRay.ray.origin.set(feet.x, feet.y + 0.5, feet.z);
    const hit = roomRay.intersectObjects(roomFloors, false)[0];
    return hit ? (groupSala(hit.object) ?? null) : null;
  };
  const groupSala = (o: THREE.Object3D): string | undefined => {
    for (let n: THREE.Object3D | null = o; n; n = n.parent)
      if (extrasOf(n).sala) return extrasOf(n).sala;
    return undefined;
  };

  const goTo = (id: SpotId) => {
    const spot = spots.get(id);
    if (!spot || !ready) return;
    feet.copy(spot.feet);
    const floor = floorBelow(feet.clone().add(new THREE.Vector3(0, 0.6, 0)), 6);
    if (floor !== null) feet.y = floor;
    yaw = spot.yaw;
    pitch = 0;
    vy = 0;
  };

  // ---------- loading ----------
  let disposed = false;
  new GLTFLoader().load(
    url,
    (gltf) => {
      if (disposed) return;
      const root = gltf.scene;
      scene.add(root);
      root.updateMatrixWorld(true);
      const building = new THREE.Box3();
      const v = new THREE.Vector3();
      const anchors: { id: string; center: THREE.Vector3; normal: THREE.Vector3 }[] = [];
      root.traverse((o) => {
        const extras = extrasOf(o);
        if (extras.visita === 'spot' && extras.id && extras.dir) {
          spots.set(extras.id, {
            feet: o.getWorldPosition(new THREE.Vector3()),
            yaw: yawFor(new THREE.Vector3(...extras.dir)),
          });
        }
        if (extras.visita === 'sign' && extras.id && extras.normal) {
          anchors.push({
            id: extras.id,
            center: o.getWorldPosition(new THREE.Vector3()),
            normal: new THREE.Vector3(...extras.normal),
          });
        }
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const grupo = groupOf(mesh);
        if (groupSala(mesh)) roomFloors.push(mesh);
        const transparent = ([] as THREE.Material[])
          .concat(mesh.material)
          .some((m) => m.transparent);
        mesh.castShadow = !transparent;
        mesh.receiveShadow = true;
        if (grupo === 'edificio') building.expandByObject(mesh);
        if (!isSolid(mesh, grupo)) return;
        // the mesh's triangles, in world space, go into the collision octree
        const pos = mesh.geometry.attributes.position;
        const index = mesh.geometry.index;
        const count = index ? index.count : pos.count;
        const vertex = (i: number) =>
          v
            .fromBufferAttribute(pos, index ? index.getX(i) : i)
            .applyMatrix4(mesh.matrixWorld)
            .clone();
        for (let i = 0; i < count; i += 3) {
          octree.addTriangle(new THREE.Triangle(vertex(i), vertex(i + 1), vertex(i + 2)));
        }
      });
      octree.build();

      const center = building.getCenter(new THREE.Vector3());
      sun.position.copy(center).add(new THREE.Vector3(-60, 80, 40));
      sun.target.position.copy(center);

      for (const anchor of anchors) {
        const sign = signs.find((s) => s.roomId === anchor.id);
        if (!sign) continue;
        const panel = makeSign(sign, renderer);
        panel.position.copy(anchor.center);
        panel.lookAt(anchor.center.clone().add(anchor.normal));
        scene.add(panel);
      }

      ready = true;
      goTo('entrada');
      onLoad();
    },
    (e) => {
      if (e.total) onProgress(e.loaded / e.total);
    },
    () => {
      if (!disposed) onError();
    }
  );

  // ---------- input ----------
  const canvas = renderer.domElement;
  const onKey = (down: boolean) => (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (down) keys.add(e.code);
    else keys.delete(e.code);
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
  // drag to look (touch, or mouse without pointer lock)
  const drags = new Map<number, { x: number; y: number }>();
  const onPointerDown = (e: PointerEvent) => {
    if (document.pointerLockElement === canvas) return;
    drags.set(e.pointerId, { x: e.clientX, y: e.clientY });
    canvas.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent) => {
    const last = drags.get(e.pointerId);
    if (!last) return;
    yaw += (e.clientX - last.x) * DRAG_LOOK;
    pitch += (e.clientY - last.y) * DRAG_LOOK;
    clampPitch();
    drags.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };
  const onPointerUp = (e: PointerEvent) => {
    drags.delete(e.pointerId);
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
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);

  // ---------- movement ----------
  const prev = new THREE.Vector3();
  const move = new THREE.Vector3();
  const probe = new THREE.Vector3();

  const step = (dt: number) => {
    const f =
      (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) -
      (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) +
      joystick.y;
    const r =
      (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) -
      (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) +
      joystick.x;
    const speed = keys.has('ShiftLeft') || keys.has('ShiftRight') ? RUN : WALK;
    move.set(r * Math.cos(yaw) - f * Math.sin(yaw), 0, -r * Math.sin(yaw) - f * Math.cos(yaw));
    if (move.lengthSq() > 1) move.normalize();
    move.multiplyScalar(speed * dt);

    // horizontal move, then push out of walls (horizontally only)
    prev.copy(feet);
    feet.add(move);
    for (let i = 0; i < 3; i++) {
      setCapsule(feet);
      const hit = octree.capsuleIntersect(capsule);
      if (!hit) break;
      if (hit.normal.y < -0.6) {
        feet.copy(prev); // ceiling
        break;
      }
      const h = Math.hypot(hit.normal.x, hit.normal.z);
      if (h < 0.2) break;
      feet.x += (hit.normal.x / h) * hit.depth;
      feet.z += (hit.normal.z / h) * hit.depth;
    }

    // floor: step up onto anything lower than STEP, otherwise fall
    probe.set(feet.x, feet.y + STEP + 0.3, feet.z);
    const floor = floorBelow(probe, 80);
    if (floor !== null && floor > feet.y + STEP + 0.01) {
      feet.x = prev.x; // too high to step onto
      feet.z = prev.z;
    } else if (floor !== null && floor >= feet.y - 0.02) {
      feet.y += (floor - feet.y) * Math.min(1, dt * 18);
      vy = 0;
    } else {
      const target = floor ?? feet.y - 1;
      if (vy === 0 && feet.y - target < 0.4) {
        feet.y = target; // walking down stairs
      } else {
        vy -= GRAVITY * dt;
        feet.y = Math.max(target, feet.y + vy * dt);
        if (feet.y === target) vy = 0;
      }
    }
    // a head that would end up inside a slab after stepping up is not allowed
    setCapsule(feet);
    const after = octree.capsuleIntersect(capsule);
    if (after && after.normal.y < -0.6) feet.copy(prev);
  };

  const clock = new THREE.Clock();
  let roomTimer = 0;
  renderer.setAnimationLoop(() => {
    // Fixed 20 ms sub-steps: the same walking speed on slow devices, and never more than one
    // capsule radius per step (no tunnelling through thin walls).
    const dt = Math.min(0.25, clock.getDelta());
    if (ready) {
      const n = Math.max(1, Math.ceil(dt / 0.02));
      for (let i = 0; i < n; i++) step(dt / n);
      roomTimer += dt;
      if (roomTimer > 0.25) {
        roomTimer = 0;
        const room = roomBelow();
        if (room !== currentRoom) {
          currentRoom = room;
          onRoom(room);
        }
      }
    }
    camera.position.set(feet.x, feet.y + EYE, feet.z);
    camera.rotation.set(pitch, yaw, 0);
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
    lock: () => {
      canvas.requestPointerLock();
    },
    setJoystick: (x, y) => {
      joystick.set(x, y);
    },
    getPosition: () => ({ x: feet.x, y: feet.y, z: feet.z }),
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
        mesh.geometry.dispose();
        ([] as THREE.Material[]).concat(mesh.material).forEach((m) => {
          (m as THREE.MeshStandardMaterial).map?.dispose();
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
