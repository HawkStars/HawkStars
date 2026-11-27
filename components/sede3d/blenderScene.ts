import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ROOMS, type FloorView } from './data';

/**
 * Viewer for the Blender model of the headquarters (public/models/sede-blender.glb, exported by
 * exportar_glb.py with Draco compression). Every node carries glTF extras from Blender: `grupo`
 * (edificio | mobiliario | envolvente | terreno) and, for the building, `piso` (L0…Rroof, F), so
 * floors and layers can be toggled; room anchors carry `sala` (the id in ./data).
 *
 * Performance: frames are drawn only when something changes (camera, tween, toggles), and the
 * shadow map is rendered once and refreshed only when the visible geometry or the sun moves.
 *
 * Import dynamically: three.js must never run on the server.
 */
export type SedeBlenderScene = {
  setView: (view: FloorView) => void;
  focusRoom: (id: string | null) => void;
  setFurniture: (on: boolean) => void;
  setLabels: (on: boolean) => void;
  setContext: (on: boolean) => void;
  setSun: (hour: number) => void;
  /** Space covered by the UI panel, in CSS px; the building is framed in the rest. */
  setInsets: (insets: { left: number; bottom: number }) => void;
  resetView: () => void;
  dispose: () => void;
};

type Options = {
  container: HTMLElement;
  labels: HTMLElement;
  url: string;
  decoderPath: string;
  onProgress: (fraction: number) => void;
  onLoad: () => void;
  onError: () => void;
  onSelectRoom: (id: string) => void;
};

const SKY = 0xe6eef0;

/** Building groups shown per view; upper floors are hidden to cut the model open. */
const FLOORS: Record<FloorView, string[] | null> = {
  ext: null,
  '0': ['L0', 'M0', 'R0', 'F'],
  '1': ['L0', 'L1', 'M0', 'M1', 'R0', 'R1', 'F'],
  '2': ['L0', 'L1', 'L2', 'M0', 'M1', 'M2', 'R0', 'R1', 'R2', 'F'],
};

/** Height of the orbit target per view (metres above the old building's ground floor). */
const TARGET_Y: Record<FloorView, number> = { ext: 4, '0': 1.5, '1': 4.5, '2': 7.5 };

/** Camera direction per view (three.js axes: +x east, +y up, −z north), from the street side. */
const DIRECTION: Record<FloorView, THREE.Vector3> = {
  ext: new THREE.Vector3(-0.62, 0.45, -0.58).normalize(),
  '0': new THREE.Vector3(-0.42, 0.78, -0.46).normalize(),
  '1': new THREE.Vector3(-0.42, 0.78, -0.46).normalize(),
  '2': new THREE.Vector3(-0.42, 0.78, -0.46).normalize(),
};

const ROOM_FLOOR = new Map(ROOMS.map((r) => [r.id, r.floor]));
const ROOM_NAME = new Map(ROOMS.map((r) => [r.id, r.name]));

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export function createSedeBlenderScene({
  container,
  labels,
  url,
  decoderPath,
  onProgress,
  onLoad,
  onError,
  onSelectRoom,
}: Options): SedeBlenderScene {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
  });
  // phones have 3× screens and weak GPUs: 1.5 is sharp enough and far cheaper
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.75;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const anisotropy = Math.min(coarse ? 4 : 8, renderer.capabilities.getMaxAnisotropy());
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.touchAction = 'none';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(SKY);
  scene.fog = new THREE.Fog(SKY, 110, 240);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 0.45;

  const camera = new THREE.PerspectiveCamera(36, 1, 0.5, 500);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.minDistance = 4;
  controls.maxDistance = 140;

  scene.add(new THREE.HemisphereLight(0xf2f4f8, 0x8a8478, 0.6));
  const sun = new THREE.DirectionalLight(0xfff3e0, 2.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.06;
  const sc = sun.shadow.camera;
  sc.left = sc.bottom = -32;
  sc.right = sc.top = 32;
  sc.near = 1;
  sc.far = 260;
  scene.add(sun, sun.target);

  const center = new THREE.Vector3();
  let radius = 18;
  const nodes: THREE.Object3D[] = [];
  const anchors = new Map<string, THREE.Object3D>();
  const labelEls = new Map<string, HTMLButtonElement>();
  let view: FloorView = 'ext';
  let active: string | null = null;
  let furniture = true;
  let showLabels = true;
  let context = true;
  let hour = 15;
  let insets = { left: 0, bottom: 0 };
  let size = { w: 1, h: 1 };
  let needsRender = true;
  let loaded = false;

  const invalidate = (shadows = false) => {
    needsRender = true;
    if (shadows) renderer.shadowMap.needsUpdate = true;
  };

  // ---------- camera tween ----------
  let tween: {
    t0: number;
    fromPos: THREE.Vector3;
    fromTarget: THREE.Vector3;
    toPos: THREE.Vector3;
    toTarget: THREE.Vector3;
  } | null = null;
  const flyTo = (toTarget: THREE.Vector3, toPos: THREE.Vector3) => {
    tween = {
      t0: performance.now(),
      fromPos: camera.position.clone(),
      fromTarget: controls.target.clone(),
      toPos,
      toTarget,
    };
    invalidate();
  };
  controls.addEventListener('start', () => {
    tween = null;
  });
  controls.addEventListener('change', () => invalidate());

  /** Distance at which a sphere of radius r fits in the part of the screen not under the panel. */
  const fitDistance = (r: number) => {
    const vHalf = THREE.MathUtils.degToRad(camera.fov / 2);
    const freeH = Math.max(0.3, (size.h - insets.bottom) / size.h);
    const freeW = Math.max(0.3, (size.w - insets.left) / size.w);
    const tanV = Math.tan(vHalf) * freeH;
    const tanH = Math.tan(vHalf) * camera.aspect * freeW;
    return r / Math.min(tanV, tanH);
  };

  const viewPose = (v: FloorView) => {
    const target = center.clone().setY(TARGET_Y[v]);
    const dist = fitDistance(radius * (v === 'ext' ? 0.85 : 0.8));
    return { target, pos: target.clone().addScaledVector(DIRECTION[v], dist) };
  };

  const frame = (animate = true) => {
    const { target, pos } = viewPose(view);
    if (animate) flyTo(target, pos);
    else {
      controls.target.copy(target);
      camera.position.copy(pos);
      controls.update();
      invalidate();
    }
  };

  const focus = (id: string) => {
    const anchor = anchors.get(id);
    if (!anchor) return;
    const target = anchor.getWorldPosition(new THREE.Vector3());
    const ext = ROOM_FLOOR.get(id) === 'ext';
    if (!ext) target.y -= 0.8;
    const dir = camera.position.clone().sub(controls.target).normalize();
    // look down into the room: keep the current bearing, raise the camera if it is too flat
    if (dir.y < 0.6) dir.setY(0.6).normalize();
    flyTo(target, target.clone().addScaledVector(dir, fitDistance(ext ? 9 : 6)));
  };

  // ---------- visibility, labels, sun ----------
  const applyVisibility = () => {
    const floors = FLOORS[view];
    for (const node of nodes) {
      const { grupo, piso } = node.userData as { grupo?: string; piso?: string };
      let visible = true;
      if (grupo === 'envolvente') visible = context;
      if (grupo === 'mobiliario') visible = furniture;
      if (floors && piso && !floors.includes(piso)) visible = false;
      node.visible = visible;
    }
    invalidate(true);
  };

  const syncLabels = () => {
    for (const [id, el] of labelEls) {
      const show = showLabels && ROOM_FLOOR.get(id) === view;
      el.hidden = !show;
      el.dataset.active = String(id === active);
    }
    invalidate();
  };

  const placeLabels = () => {
    const p = new THREE.Vector3();
    for (const [id, el] of labelEls) {
      if (el.hidden) continue;
      anchors.get(id)!.getWorldPosition(p).project(camera);
      const off = p.z > 1 || Math.abs(p.x) > 1.1 || Math.abs(p.y) > 1.1;
      el.style.visibility = off ? 'hidden' : 'visible';
      el.style.transform = `translate(-50%, -50%) translate(${((p.x + 1) / 2) * size.w}px, ${((1 - p.y) / 2) * size.h}px)`;
    }
  };

  /** Rough solar path for Pinhel (41° N): east at 7h, south at ~13h30, west at 20h. */
  const placeSun = () => {
    const t = (hour - 7) / 13;
    const az = THREE.MathUtils.degToRad(90 + t * 180);
    const el = THREE.MathUtils.degToRad(8 + 60 * Math.sin(Math.PI * t));
    const dir = new THREE.Vector3(
      Math.sin(az) * Math.cos(el),
      Math.sin(el),
      -Math.cos(az) * Math.cos(el)
    );
    sun.position.copy(center).addScaledVector(dir, 120);
    sun.target.position.copy(center);
    sun.target.updateMatrixWorld();
    sun.intensity = 1.2 + 1.4 * Math.sin(Math.PI * Math.min(1, Math.max(0, t)));
    invalidate(true);
  };

  // ---------- loading ----------
  const draco = new DRACOLoader().setDecoderPath(decoderPath);
  const loader = new GLTFLoader().setDRACOLoader(draco);
  let disposed = false;
  loader.load(
    url,
    (gltf) => {
      if (disposed) return;
      const root = gltf.scene;
      root.traverse((o) => {
        if (o.userData.grupo) nodes.push(o);
        if (typeof o.userData.sala === 'string') anchors.set(o.userData.sala, o);
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          const mats = ([] as THREE.Material[]).concat(mesh.material);
          const transparent = mats.some((m) => m.transparent);
          // roofs and paving are seen at grazing angles: anisotropic filtering keeps them sharp
          for (const m of mats as THREE.MeshStandardMaterial[]) {
            for (const tex of [m.map, m.normalMap]) if (tex) tex.anisotropy = anisotropy;
          }
          // only the building casts shadows; furniture and trees are too small to matter here
          const grupo = (o.parent?.userData.grupo ?? o.userData.grupo) as string | undefined;
          mesh.castShadow = !transparent && grupo !== 'mobiliario';
          mesh.receiveShadow = true;
          mesh.matrixAutoUpdate = false;
          mesh.updateMatrix();
        }
      });
      scene.add(root);
      root.updateMatrixWorld(true);

      const box = new THREE.Box3();
      for (const node of nodes) if (node.userData.grupo === 'edificio') box.expandByObject(node);
      box.getCenter(center);
      const s = box.getSize(new THREE.Vector3());
      radius = Math.hypot(s.x, s.z) / 2;

      for (const id of anchors.keys()) {
        const el = document.createElement('button');
        el.type = 'button';
        el.tabIndex = -1;
        el.setAttribute('aria-hidden', 'true');
        el.textContent = ROOM_NAME.get(id) ?? id;
        el.className =
          'border-bege-dark data-[active=true]:border-green data-[active=true]:bg-green pointer-events-auto absolute top-0 left-0 rounded-full border bg-white/95 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-black shadow-sm data-[active=true]:text-white';
        el.addEventListener('click', () => onSelectRoom(id));
        labels.appendChild(el);
        labelEls.set(id, el);
      }

      loaded = true;
      placeSun();
      applyVisibility();
      syncLabels();
      frame(false);
      onLoad();
    },
    (e) => {
      if (e.total) onProgress(e.loaded / e.total);
    },
    () => {
      if (!disposed) onError();
    }
  );

  // ---------- size & loop ----------
  const applyViewOffset = () => {
    // shift the projection so the orbit target sits in the middle of the uncovered area
    camera.setViewOffset(size.w, size.h, -insets.left / 2, insets.bottom / 2, size.w, size.h);
    camera.updateProjectionMatrix();
  };
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    size = { w, h };
    renderer.setSize(w, h);
    camera.aspect = w / h;
    applyViewOffset();
    invalidate();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  renderer.setAnimationLoop(() => {
    if (tween) {
      const k = Math.min(1, (performance.now() - tween.t0) / 750);
      const e = easeInOut(k);
      controls.target.lerpVectors(tween.fromTarget, tween.toTarget, e);
      camera.position.lerpVectors(tween.fromPos, tween.toPos, e);
      if (k === 1) tween = null;
      needsRender = true;
    }
    // keep the orbit centre near the building, so panning cannot lose it
    const off = controls.target.clone().sub(center).setY(0);
    if (off.length() > radius * 1.5) {
      off.setLength(off.length() - radius * 1.5);
      controls.target.sub(off);
      camera.position.sub(off);
    }
    if (controls.update()) needsRender = true;
    if (!needsRender) return;
    needsRender = false;
    renderer.render(scene, camera);
    if (loaded) placeLabels();
  });

  return {
    setView: (v) => {
      view = v;
      active = null;
      applyVisibility();
      syncLabels();
      frame();
    },
    focusRoom: (id) => {
      active = id;
      syncLabels();
      if (id) focus(id);
    },
    setFurniture: (on) => {
      furniture = on;
      applyVisibility();
    },
    setLabels: (on) => {
      showLabels = on;
      syncLabels();
    },
    setContext: (on) => {
      context = on;
      applyVisibility();
    },
    setSun: (h) => {
      hour = h;
      placeSun();
    },
    setInsets: (next) => {
      if (next.left === insets.left && next.bottom === insets.bottom) return;
      insets = next;
      applyViewOffset();
      if (loaded && !active) frame();
      invalidate();
    },
    resetView: () => {
      active = null;
      syncLabels();
      frame();
    },
    dispose: () => {
      disposed = true;
      observer.disconnect();
      renderer.setAnimationLoop(null);
      controls.dispose();
      labelEls.forEach((el) => el.remove());
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        ([] as THREE.Material[]).concat(mesh.material).forEach((m) => m.dispose());
      });
      draco.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
