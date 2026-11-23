import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Viewer for the Blender model of the headquarters (public/models/sede-blender.glb, exported by
 * exportar_glb.py). Every node carries glTF extras from Blender: `grupo` (edificio | mobiliario |
 * envolvente | terreno) and, for the building, `piso` (L0…Rroof, F) — the same groups the Blender
 * collections use, so floors and layers can be toggled here. Import dynamically: three.js must
 * never run on the server.
 */
export type BlenderView = 'ext' | '0' | '1' | '2';

export type SedeBlenderScene = {
  setView: (view: BlenderView) => void;
  setFurniture: (on: boolean) => void;
  setContext: (on: boolean) => void;
  dispose: () => void;
};

type Options = {
  container: HTMLElement;
  url: string;
  onProgress: (fraction: number) => void;
  onLoad: () => void;
  onError: () => void;
};

const SKY = 0xe6eef0;

/** Building groups shown per view; upper floors are hidden to cut the model open. */
const FLOORS: Record<BlenderView, string[] | null> = {
  ext: null,
  '0': ['L0', 'M0', 'R0', 'F'],
  '1': ['L0', 'L1', 'M0', 'M1', 'R0', 'R1', 'F'],
  '2': ['L0', 'L1', 'L2', 'M0', 'M1', 'R0', 'R1', 'R2', 'F'],
};

/** Camera offsets from the building centre (three.js axes: +x east, +y up, −z north). */
const CAMERA: Record<BlenderView, THREE.Vector3> = {
  // from the north-west, over the Largo General Castro, so the old building's corner faces the camera
  ext: new THREE.Vector3(-36, 26, -34),
  '0': new THREE.Vector3(-20, 38, -22),
  '1': new THREE.Vector3(-20, 40, -22),
  '2': new THREE.Vector3(-20, 42, -22),
};

export function createSedeBlenderScene({
  container,
  url,
  onProgress,
  onLoad,
  onError,
}: Options): SedeBlenderScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.75;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.touchAction = 'none';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(SKY);
  scene.fog = new THREE.Fog(SKY, 120, 260);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 0.45;

  const camera = new THREE.PerspectiveCamera(36, 1, 0.5, 600);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.minDistance = 4;
  controls.maxDistance = 160;

  scene.add(new THREE.HemisphereLight(0xf2f4f8, 0x8a8478, 0.6));
  const sun = new THREE.DirectionalLight(0xfff3e0, 2.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.08;
  const sc = sun.shadow.camera;
  sc.left = sc.bottom = -55;
  sc.right = sc.top = 55;
  sc.near = 1;
  sc.far = 220;
  scene.add(sun, sun.target);

  const center = new THREE.Vector3();
  const nodes: THREE.Object3D[] = [];
  let view: BlenderView = 'ext';
  let furniture = true;
  let context = true;

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
  };

  const frame = () => {
    controls.target.copy(center).add(new THREE.Vector3(0, view === 'ext' ? 4 : 2, 0));
    // portrait screens see less width: back the camera off so the whole complex still fits
    const fit = Math.min(1.9, Math.max(1, 1.2 / camera.aspect));
    camera.position.copy(controls.target).add(CAMERA[view].clone().multiplyScalar(fit));
    controls.update();
  };

  let disposed = false;
  new GLTFLoader().load(
    url,
    (gltf) => {
      if (disposed) return;
      const root = gltf.scene;
      root.traverse((o) => {
        if (o.userData.grupo) nodes.push(o);
        if ((o as THREE.Mesh).isMesh) {
          const mesh = o as THREE.Mesh;
          const transparent = ([] as THREE.Material[])
            .concat(mesh.material)
            .some((m) => m.transparent);
          mesh.castShadow = !transparent;
          mesh.receiveShadow = true;
        }
      });
      scene.add(root);
      const box = new THREE.Box3();
      for (const node of nodes) if (node.userData.grupo === 'edificio') box.expandByObject(node);
      box.getCenter(center);
      center.y = box.min.y;
      sun.position.copy(center).add(new THREE.Vector3(-60, 80, 40));
      sun.target.position.copy(center);
      frame();
      onLoad();
    },
    (e) => {
      if (e.total) onProgress(e.loaded / e.total);
    },
    () => {
      if (!disposed) onError();
    }
  );

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

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  return {
    setView: (v) => {
      view = v;
      applyVisibility();
      frame();
    },
    setFurniture: (on) => {
      furniture = on;
      applyVisibility();
    },
    setContext: (on) => {
      context = on;
      applyVisibility();
    },
    dispose: () => {
      disposed = true;
      observer.disconnect();
      renderer.setAnimationLoop(null);
      controls.dispose();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        ([] as THREE.Material[]).concat(mesh.material).forEach((m) => m.dispose());
      });
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
