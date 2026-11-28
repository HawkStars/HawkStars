import * as THREE from 'three';

/**
 * Naming signage for the walkthrough: a plaque by each training room's door and a sign on the
 * building's façade, each with a name and a logo. They exist to show sponsors how their name
 * would look on the rooms and the building (naming rights), so each can be redrawn on the fly
 * with a trial name and logo (see `previewNaming` in walkthroughScene).
 *
 * Canvas drawing, so the text is crisp and needs no font files in the model; the anchors come
 * from the GLB (`plaque:<roomId>`, `facade:edificio`, placed by revit_glb.py).
 */

const GREEN = '#0a7558';
const INK = '#1f3a68';
const PX = 1000; // texture pixels per metre on the plaques

/** What a board shows: its name, a line under it and a logo (any of them may be missing). */
export type BoardContent = { name: string; text: string; logo: string | null };

export const loadImage = (url: string | null | undefined) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });

/** Fit an image into a box (centred), keeping its proportions. */
const drawFitted = (
  g: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  const iw = img.naturalWidth || 300;
  const ih = img.naturalHeight || 150;
  const s = Math.min(w / iw, h / ih);
  g.drawImage(img, x + (w - iw * s) / 2, y + (h - ih * s) / 2, iw * s, ih * s);
};

/** Break text into lines that fit `width` (at most `max` lines; the last one is cut with …). */
const wrap = (g: CanvasRenderingContext2D, text: string, width: number, max: number) => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (g.measureText(next).width <= width || !line) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  if (lines.length > max) {
    lines.length = max;
    let last = lines[max - 1];
    while (last && g.measureText(`${last}…`).width > width) last = last.slice(0, -1);
    lines[max - 1] = `${last}…`;
  }
  return lines;
};

// ---------- door plaque (0.45 × 0.6 m) ----------

export const PLAQUE_W = 0.45;
export const PLAQUE_H = 0.6;

const drawPlaque = (room: string, content: BoardContent, logo: HTMLImageElement | null) => {
  const canvas = document.createElement('canvas');
  canvas.width = PLAQUE_W * PX;
  canvas.height = PLAQUE_H * PX;
  const g = canvas.getContext('2d');
  if (!g) return canvas;
  const { width: w, height: h } = canvas;
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, w, h);
  g.fillStyle = GREEN;
  g.fillRect(0, 0, w, 70);
  g.fillStyle = '#ffffff';
  g.font = '700 26px Inter, Arial, sans-serif';
  g.fillText(room.toUpperCase(), 30, 46);
  g.fillStyle = INK;
  g.font = '600 52px Oswald, "Arial Narrow", sans-serif';
  const lines = wrap(g, content.name || 'Naming disponível', w - 60, 3);
  lines.forEach((l, i) => g.fillText(l, 30, 140 + i * 58));
  if (content.text) {
    g.fillStyle = 'rgba(0,0,0,0.6)';
    g.font = '400 22px Inter, Arial, sans-serif';
    wrap(g, content.text, w - 60, 2).forEach((l, i) =>
      g.fillText(l, 30, 150 + lines.length * 58 + i * 28)
    );
  }
  if (logo) drawFitted(g, logo, 40, h - 250, w - 80, 210);
  return canvas;
};

// ---------- building sign (width × height from the anchor, 3.6 × 0.9 m by default) ----------

const drawFacade = (
  width: number,
  height: number,
  content: BoardContent,
  logo: HTMLImageElement | null
) => {
  const scale = 400; // px per metre: the sign is seen from the street
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const g = canvas.getContext('2d');
  if (!g) return canvas;
  const { width: w, height: h } = canvas;
  g.fillStyle = INK;
  g.fillRect(0, 0, w, h);
  g.fillStyle = GREEN;
  g.fillRect(0, h - 18, w, 18);
  let x = 40;
  if (logo) {
    // the logo on a white tile, so any logo reads on the dark sign
    const tile = h - 80;
    g.fillStyle = '#ffffff';
    g.fillRect(x, 31, tile, tile);
    drawFitted(g, logo, x + 14, 45, tile - 28, tile - 28);
    x += tile + 40;
  }
  g.fillStyle = '#ffffff';
  // the name on one line: shrink the type until it fits (a long name is only cut as a last resort)
  const full = content.name || 'O seu nome aqui';
  const room = w - x - 40;
  let size = 120;
  g.font = `600 ${size}px Oswald, "Arial Narrow", sans-serif`;
  while (size > 56 && g.measureText(full).width > room) {
    size -= 4;
    g.font = `600 ${size}px Oswald, "Arial Narrow", sans-serif`;
  }
  const name = wrap(g, full, room, 1)[0] ?? '';
  g.fillText(name, x, content.text ? 175 : 220);
  if (content.text) {
    g.fillStyle = 'rgba(255,255,255,0.75)';
    g.font = '400 44px Inter, Arial, sans-serif';
    g.fillText(wrap(g, content.text, w - x - 40, 1)[0] ?? '', x + 4, 255);
  }
  return canvas;
};

// ---------- the meshes ----------

export type Board = {
  object: THREE.Object3D;
  /** Draw this content (the logo is loaded first; a newer call wins). */
  show: (content: BoardContent) => void;
};

const boardMesh = (
  w: number,
  h: number,
  draw: (content: BoardContent, logo: HTMLImageElement | null) => HTMLCanvasElement,
  renderer: THREE.WebGLRenderer,
  frame: string
) => {
  const material = new THREE.MeshStandardMaterial({ roughness: 0.55 });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  face.position.z = 0.012;
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.04, h + 0.04, 0.02),
    new THREE.MeshStandardMaterial({ color: frame, roughness: 0.5 })
  );
  const group = new THREE.Group();
  group.add(face, back);
  let request = 0;
  const show = (content: BoardContent) => {
    const mine = ++request;
    loadImage(content.logo).then((logo) => {
      if (mine !== request) return;
      // a new texture per drawing: WebGL2 sizes a texture's storage once
      material.map?.dispose();
      const texture = new THREE.CanvasTexture(draw(content, logo));
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      material.map = texture;
      material.needsUpdate = true;
    });
  };
  return { group, show };
};

/** A door plaque: on the wall beside the door, or on a stand when there is no wall there. */
export const makePlaque = (
  room: string,
  renderer: THREE.WebGLRenderer,
  standing: boolean
): Board => {
  const { group, show } = boardMesh(
    PLAQUE_W,
    PLAQUE_H,
    (c, logo) => drawPlaque(room, c, logo),
    renderer,
    GREEN
  );
  if (!standing) return { object: group, show };
  // a post and a base, the plaque at eye level on top (the anchor is on the floor)
  const metal = new THREE.MeshStandardMaterial({
    color: '#2a2d31',
    roughness: 0.4,
    metalness: 0.6,
  });
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 12), metal);
  post.position.set(0, 0.6, -0.03);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.03, 24), metal);
  base.position.set(0, 0.015, -0.03);
  group.position.y = 1.45;
  const stand = new THREE.Group();
  stand.add(post, base, group);
  return { object: stand, show };
};

/** The building's sign, on the façade. */
export const makeFacadeSign = (
  width: number,
  height: number,
  renderer: THREE.WebGLRenderer
): Board => {
  const { group, show } = boardMesh(
    width,
    height,
    (c, logo) => drawFacade(width, height, c, logo),
    renderer,
    INK
  );
  return { object: group, show };
};
