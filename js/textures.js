import * as THREE from '../vendor/three/three.module.js';

// Seeded procedural textures: repeatable, local, and no imported image assets.
function makeTexture(name, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  let seed = 231;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  draw(ctx, random);
  const texture = new THREE.CanvasTexture(canvas);
  texture.name = name;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export const oakTexture = makeTexture('Oak grain', (ctx, random) => {
  ctx.fillStyle = '#b78755'; ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 1800; i++) {
    ctx.strokeStyle = `rgba(70,37,14,${random() * 0.16})`;
    const y = random() * 512; ctx.beginPath(); ctx.moveTo(0, y);
    ctx.bezierCurveTo(150, y + random() * 14, 360, y - random() * 10, 512, y);
    ctx.stroke();
  }
  ctx.strokeStyle = '#825b38'; ctx.lineWidth = 2;
  for (let y = 0; y < 512; y += 128) {ctx.strokeRect(0, y, 512, 128);}
});
oakTexture.repeat.set(3, 3);
export const plasterTexture = makeTexture('Lime plaster', (ctx, random) => {
  ctx.fillStyle = '#eee6ce'; ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 28000; i++) {
    ctx.fillStyle = `rgba(85,76,58,${random() * 0.09})`;
    ctx.fillRect(random() * 512, random() * 512, 2, 2);
  }
});
export const weaveTexture = makeTexture('Woven canvas', (ctx) => {
  ctx.fillStyle = '#efe0be'; ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 512; i += 4) {
    ctx.fillStyle = '#d6c7aa'; ctx.fillRect(i, 0, 1, 512);
    ctx.fillStyle = '#fff0d2'; ctx.fillRect(0, i, 512, 1);
  }
});
weaveTexture.repeat.set(3, 3);
