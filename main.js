import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

/* ==========================
   ESTADOS
========================== */
const STATES = {
  INTRO: "intro",
  ENTRADA: "entrada",
  EXPLORACION: "exploracion",
};

let currentState = STATES.INTRO;

/* ==========================
   CONFIG
========================== */
const CONFIG = {
  galaxy: {
    count: 8000,
    radius: 6,
    branches: 4,
    spin: 1.5,
    size: 0.03,
    insideColor: "#00ff88",
    outsideColor: "#ffffff",
  },
  text: {
    canvasWidth: 1024,
    canvasHeight: 256,
    fontSize: 72,
    scale: 4,
    floatAmplitude: 0.05,
    floatSpeed: 0.001,
  },
  photos: {
    scale: 1.5,
    floatAmplitude: 0.05,
    floatSpeed: 0.001,
  },
};

/* ==========================
   DATOS
========================== */
const mensajes = [
  "Te amo ❤️",
  "Eres mi universo",
  "Siempre contigo",
  "Mi persona favorita",
  "Gracias por existir",
];

const fotos = ["./img/1.png", "./img/2.png"];

/* ==========================
   ESCENA
========================== */
const canvas = document.getElementById("galaxy");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* ==========================
   GALAXIA
========================== */
function crearGalaxia() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(CONFIG.galaxy.count * 3);
  const colors = new Float32Array(CONFIG.galaxy.count * 3);

  const inside = new THREE.Color(CONFIG.galaxy.insideColor);
  const outside = new THREE.Color(CONFIG.galaxy.outsideColor);

  for (let i = 0; i < CONFIG.galaxy.count; i++) {
    const i3 = i * 3;
    const r = Math.random() * CONFIG.galaxy.radius;
    const angle =
      ((i % CONFIG.galaxy.branches) / CONFIG.galaxy.branches) * Math.PI * 2;
    const spin = r * CONFIG.galaxy.spin;

    positions[i3] = Math.cos(angle + spin) * r;
    positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
    positions[i3 + 2] = Math.sin(angle + spin) * r;

    const color = inside.clone().lerp(outside, r / CONFIG.galaxy.radius);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: CONFIG.galaxy.size,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}

const galaxy = crearGalaxia();

/* ==========================
   TEXTOS
========================== */
const textos = [];

function crearTexto(mensaje) {
  const c = document.createElement("canvas");
  c.width = CONFIG.text.canvasWidth;
  c.height = CONFIG.text.canvasHeight;

  const ctx = c.getContext("2d");
  ctx.fillStyle = "white";
  ctx.font = `${CONFIG.text.fontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(mensaje, c.width / 2, c.height / 2);

  const texture = new THREE.CanvasTexture(c);

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, transparent: true })
  );

  const scale = (window.innerWidth / 1920) * CONFIG.text.scale;
  sprite.scale.set(scale * 1.6, scale * 0.6, 1);

  const angle = Math.random() * Math.PI * 2;
  const radius = 2 + Math.random() * 3;
  const baseY = (Math.random() - 0.5) * 2;

  sprite.userData = { angle, radius, baseY };

  sprite.position.set(
    Math.cos(angle) * radius,
    baseY,
    Math.sin(angle) * radius
  );

  sprite.visible = false;
  textos.push(sprite);
  scene.add(sprite);
}

mensajes.forEach(crearTexto);

/* ==========================
   FOTOS
========================== */
const spritesFotos = [];
const loader = new THREE.TextureLoader();

fotos.forEach((ruta) => {
  loader.load(ruta, (texture) => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: texture, transparent: true })
    );

    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 3;
    const baseY = (Math.random() - 0.5) * 2;

    sprite.userData = { angle, radius, baseY };
    sprite.scale.set(CONFIG.photos.scale, CONFIG.photos.scale, 1);

    sprite.position.set(
      Math.cos(angle) * radius,
      baseY,
      Math.sin(angle) * radius
    );

    sprite.visible = false;
    spritesFotos.push(sprite);
    scene.add(sprite);
  });
});

/* ==========================
   INTRO
========================== */
function crearTextoIntro(texto) {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 384;

  const ctx = c.getContext("2d");
  ctx.fillStyle = "white";
  ctx.font = "96px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(texto, c.width / 2, c.height / 2);

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(c),
      transparent: true,
      opacity: 0,
    })
  );

  const scale = window.innerWidth / 1920;
  sprite.scale.set(5 * scale, 1 * scale, 1);
  sprite.position.set(0, 0, -2);
  scene.add(sprite);
  return sprite;
}

const introTexts = [
  "Sony Computer Entertainment presents",
  "A Universal Studios Production",
];
let introIndex = 0;
let introStart = Date.now();
let introSprite = crearTextoIntro(introTexts[introIndex]);

let entradaStart = 0;

/* ==========================
   INPUT MOUSE / TOUCH
========================== */
let lastX = null;
let lastY = null;
let deltaX = 0;
let deltaY = 0;

function updateInput(x, y) {
  if (currentState !== STATES.EXPLORACION) return;
  if (lastX === null) {
    lastX = x;
    lastY = y;
    return;
  }
  deltaX += (x - lastX) * 0.002;
  deltaY += (y - lastY) * 0.002;
  lastX = x;
  lastY = y;
}

window.addEventListener("mousemove", e => updateInput(e.clientX, e.clientY));
window.addEventListener("mouseleave", () => { lastX = lastY = null; });
window.addEventListener("touchmove", e => {
  if (e.touches.length) {
    updateInput(e.touches[0].clientX, e.touches[0].clientY);
  }
});

/* ==========================
   ANIMACIÓN
========================== */
let orbit = 0;

function animate() {
  requestAnimationFrame(animate);
  const now = Date.now();

  /* INTRO */
  if (currentState === STATES.INTRO) {
    const t = now - introStart;

    if (t < 1000) introSprite.material.opacity = t / 1000;
    else if (t < 2500) introSprite.material.opacity = 1;
    else if (t < 3500)
      introSprite.material.opacity = 1 - (t - 2500) / 1000;
    else {
      scene.remove(introSprite);
      introIndex++;
      if (introIndex < introTexts.length) {
        introSprite = crearTextoIntro(introTexts[introIndex]);
        introStart = now;
      } else {
        currentState = STATES.ENTRADA;
        entradaStart = now;
      }
    }

    renderer.render(scene, camera);
    return;
  }

  /* ENTRADA */
  if (currentState === STATES.ENTRADA) {
    const p = Math.min((now - entradaStart) / 3000, 1);
    galaxy.material.opacity = p;
    const eased = 1 - Math.pow(1 - p, 3);
    camera.position.z = 12 - eased * 4;


    if (p === 1) {
      textos.forEach(t => t.visible = true);
      spritesFotos.forEach(f => f.visible = true);
      currentState = STATES.EXPLORACION;
    }
  }

  /* EXPLORACIÓN */
  if (currentState === STATES.EXPLORACION) {
    orbit += deltaX;
    deltaX *= 0.85;
    deltaY *= 0.85;

    // GALAXIA: base lenta y profunda
    galaxy.rotation.y = -orbit * 0.25;
    galaxy.rotation.x = Math.sin(orbit * 0.2) * 0.03;
    // CÁMARA: izquierda / derecha + arriba / abajo
    camera.position.x = Math.sin(orbit) * 10;
    camera.position.z = Math.cos(orbit) * 10;
    camera.position.y = THREE.MathUtils.clamp(
    camera.position.y + deltaY * 2,
      -4,
      4
    );
    textos.forEach((t, i) => {
      const a = t.userData.angle + orbit;
      t.position.x = Math.cos(a) * t.userData.radius;
      t.position.z = Math.sin(a) * t.userData.radius;
      t.position.y =
        t.userData.baseY +
        Math.sin(now * CONFIG.text.floatSpeed + i) *
          CONFIG.text.floatAmplitude;
    });

    spritesFotos.forEach((s, i) => {
      const a = s.userData.angle + orbit * 0.7;
      s.position.x = Math.cos(a) * s.userData.radius;
      s.position.z = Math.sin(a) * s.userData.radius;
      s.position.y =
        s.userData.baseY +
        Math.sin(now * CONFIG.photos.floatSpeed + i) *
          CONFIG.photos.floatAmplitude;
    });

    galaxy.rotation.y += 0.0002;
  }

  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}

animate();

/* ==========================
   RESIZE
========================== */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
