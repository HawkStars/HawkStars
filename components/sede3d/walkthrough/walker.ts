import * as THREE from 'three';
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

/**
 * The walker of the headquarters walkthrough, kept free of the DOM so the same physics can be
 * exercised headlessly against the model (stairs, doorways, gaps).
 *
 * A capsule 1.75 m tall collides with walls, windows, railings and neighbouring buildings, climbs
 * steps up to STEP, falls with gravity and cannot push its head through a ceiling. It stands on
 * the highest floor under its footprint (five rays, not one), so it does not drop through the
 * narrow slots Revit leaves between a stair and the slab beside it.
 */
export const EYE = 1.62;
const HEIGHT = 1.75;
const RADIUS = 0.25;
/** The Revit stairs end with a riser of up to 40 cm onto the upper slab. */
export const STEP = 0.45;
const WALK = 1.6;
const RUN = 3.4;
const GRAVITY = 9.8;
/** Footprint rays: the centre and four points this far from it. */
const FOOT = 0.18;

/** Groups the walker passes through: doors are open, furniture does not block a room. */
const PASSABLE_GROUPS = new Set(['porta', 'mobiliario']);
/** Surroundings materials that are not solid: overhead wires, lamp heads, tree crowns. */
const PASSABLE_SURROUNDINGS = new Set(['preto', 'lanterna', 'vidro_lanterna', 'copa', 'sebe']);

/** A glTF extra, looked up on the node or on its nearest ancestor that has it. */
export const extraOf = <K extends string>(o: THREE.Object3D, key: K): unknown => {
  for (let n: THREE.Object3D | null = o; n; n = n.parent) {
    if (n.userData[key] !== undefined) return n.userData[key];
  }
  return undefined;
};

export const groupOf = (o: THREE.Object3D) => extraOf(o, 'grupo') as string | undefined;

const isSolid = (mesh: THREE.Mesh) => {
  const grupo = groupOf(mesh);
  if (grupo && PASSABLE_GROUPS.has(grupo)) return false;
  const name = ([] as THREE.Material[]).concat(mesh.material)[0]?.name ?? '';
  return !(grupo === 'envolvente' && PASSABLE_SURROUNDINGS.has(name));
};

/** Collision octree of every solid mesh under root (world space; root must be up to date). */
export const buildCollision = (root: THREE.Object3D) => {
  const octree = new Octree();
  const v = new THREE.Vector3();
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || !isSolid(mesh)) return;
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
  return octree.build();
};

/** Forward and right in −1…1 (keyboard and joystick summed), whether to run, and a speed factor
 * the visitor can set (slower or faster walking). */
export type MoveInput = { forward: number; right: number; run: boolean; speed?: number };

export type Walker = ReturnType<typeof createWalker>;

export const createWalker = (octree: Octree) => {
  /** Feet position; the eye is EYE above it. */
  const feet = new THREE.Vector3();
  let vy = 0;
  const capsule = new Capsule();
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

  const probe = new THREE.Vector3();
  const OFFSETS = [
    [0, 0],
    [FOOT, 0],
    [-FOOT, 0],
    [0, FOOT],
    [0, -FOOT],
  ];
  /** The floor right under the centre of the feet (null: nothing below at all). */
  const centreFloor = () => floorBelow(probe.set(feet.x, feet.y + STEP + 0.3, feet.z), 80);
  /** The highest floor under the footprint that is low enough to stand on. */
  const support = () => {
    let best: number | null = null;
    for (const [dx, dz] of OFFSETS) {
      const y = floorBelow(probe.set(feet.x + dx, feet.y + STEP + 0.3, feet.z + dz), 80);
      if (y !== null && y <= feet.y + STEP + 0.01 && (best === null || y > best)) best = y;
    }
    return best;
  };

  /** Put the feet on the floor under p (searching from a little above it). */
  const place = (p: THREE.Vector3) => {
    feet.copy(p);
    const floor = floorBelow(probe.set(p.x, p.y + 0.6, p.z), 6);
    if (floor !== null) feet.y = floor;
    vy = 0;
  };

  const prev = new THREE.Vector3();
  const move = new THREE.Vector3();

  const step = (dt: number, yaw: number, input: MoveInput) => {
    const { forward: f, right: r } = input;
    move.set(r * Math.cos(yaw) - f * Math.sin(yaw), 0, -r * Math.sin(yaw) - f * Math.cos(yaw));
    if (move.lengthSq() > 1) move.normalize();
    move.multiplyScalar((input.run ? RUN : WALK) * (input.speed ?? 1) * dt);

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

    // a ledge higher than a step under the centre is a wall, not a floor; so is the edge of the
    // model, where nothing at all is under the footprint (a narrow gap, like the strip Revit
    // leaves without floor under every door, is bridged by the footprint's other rays)
    const centre = centreFloor();
    let floor = support();
    if ((centre !== null && centre > feet.y + STEP + 0.01) || floor === null) {
      feet.x = prev.x;
      feet.z = prev.z;
      floor = support();
    }

    // stand on the footprint's floor: step up onto it, walk down stairs, or fall
    if (floor !== null && floor >= feet.y - 0.02) {
      feet.y += (floor - feet.y) * Math.min(1, dt * 18);
      vy = 0;
    } else {
      const target = floor ?? feet.y - 1;
      if (vy === 0 && feet.y - target <= STEP) {
        feet.y = target; // walking down a step
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

  /** Fixed 20 ms sub-steps: the same walking speed on slow devices, and never more than one
   * capsule radius per step (no tunnelling through thin walls). */
  const advance = (dt: number, yaw: number, input: MoveInput) => {
    const n = Math.max(1, Math.ceil(dt / 0.02));
    for (let i = 0; i < n; i++) step(dt / n, yaw, input);
  };

  return { feet, place, advance, floorBelow };
};
