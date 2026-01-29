/* LÓGICA DEL SISTEMA SOLAR 3D */
import * as THREE from "three";

// Control de tiempo
import * as timeEngine from "../core/timeEngine.js";

import { createRenderer } from "../core/three/renderer.js";
import { createScene } from "../core/three/scene.js";
import { createCamera } from "../core/three/camera.js";
// import { startLoop } from "../core/three/loop.js";
import { ORBITS } from "../core/data/orbits.js";
import { DISTANCE_SCALE, RADIUS_SCALE } from "../core/data/scales.js";

// Fecha inicial del sistema
const EPOCH_DATE = new Date("2026-01-01T00:00:00Z");
const DAY_MS = 1000 * 60 * 60 * 24;


// === HELPERS ===
// Órbitas coloreadas
function createOrbit(radius, color = 0xffffff) {
    const geometry = new THREE.RingGeometry(
        radius - 0.05,
        radius + 0.05,
        128
    );

    const material = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
    });

    const orbit = new THREE.Mesh(geometry, material);
    orbit.rotation.x = Math.PI / 2;
    return orbit;
}

// Nombre del astro
function createLabel(text) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 256;
    canvas.height = 64;

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "28px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text.toUpperCase(), 128, 42);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(40, 10, 1);
    return sprite;
}

// Calcula el tamaño en píxeles del astro en pantalla
function getScreenRadius(mesh, camera) {
    const vector = new THREE.Vector3();
    mesh.getWorldPosition(vector);

    const distance = camera.position.distanceTo(vector);
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const screenHeight = window.innerHeight;

    mesh.geometry.computeBoundingSphere();
    const radius = mesh.geometry.boundingSphere.radius;

    return (radius / distance) * (screenHeight / (2 * Math.tan(vFOV / 2)));
}

const LABEL_THRESHOLD_PX = 12;

/* === CONFIGURACIÓN INICIAL === */
const canvas = document.getElementById("solarCanvas");

const renderer = createRenderer(canvas);
const scene = createScene();

const { camera, controls } = createCamera(renderer);

// INIT DEL MOTOR DE TIEMPO (una sola vez)
timeEngine.init();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ====== SOL Y LUCES ====== */
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffaa00,
    emissiveIntensity: 1
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const sunLight = new THREE.PointLight(0xffffff, 2, 300);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambientLight);

/* ===== ÓRBITAS ===== */
const earthOrbitRadius = ORBITS.earth.distance_km * DISTANCE_SCALE;
const earthOrbit = createOrbit(earthOrbitRadius, 0x3b82f6);
scene.add(earthOrbit);

const marsOrbitRadius = ORBITS.mars.distance_km * DISTANCE_SCALE;
const marsOrbit = createOrbit(marsOrbitRadius, 0xef4444);
scene.add(marsOrbit);

/* ===== TIERRA ===== */
const earthGroup = new THREE.Group();
scene.add(earthGroup);

const earthRadius = ORBITS.earth.radius_km * RADIUS_SCALE;
const earthGeometry = new THREE.SphereGeometry(earthRadius, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x2a6bd4 });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earthGroup.add(earth);

const earthLabel = createLabel("Tierra");
earthLabel.position.y = earthRadius * 2.5;
earth.add(earthLabel);

/* ===== LUNA ===== */
const moonGroup = new THREE.Group();
earthGroup.add(moonGroup);

const moonRadius = ORBITS.moon.radius_km * RADIUS_SCALE;
const moonGeometry = new THREE.SphereGeometry(moonRadius, 24, 24);
const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xbfbfbf });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moonGroup.add(moon);

moon.position.x = ORBITS.moon.distance_km * DISTANCE_SCALE;

/* ===== ANIMACIÓN ===== */
let earthAngle = 0;
let moonAngle = 0;

function animate() {

    // ACTUALIZAR MOTOR DE TIEMPO (cada frame)
    timeEngine.update();

    const now = timeEngine.getCurrentDate();
    const daysElapsed = (now - EPOCH_DATE) / DAY_MS;


    // Órbita Tierra
    const earthAngle =
        (daysElapsed / ORBITS.earth.period_days) * Math.PI * 2;

    const earthDistance =
        ORBITS.earth.distance_km * DISTANCE_SCALE;

    earthGroup.position.x = Math.cos(earthAngle) * earthDistance;
    earthGroup.position.z = Math.sin(earthAngle) * earthDistance;

    earthGroup.position.x = Math.cos(earthAngle) * earthDistance;
    earthGroup.position.z = Math.sin(earthAngle) * earthDistance;

    // Órbita Luna
    const moonAngle =
        (daysElapsed / ORBITS.moon.period_days) * Math.PI * 2;

    moon.position.x =
        Math.cos(moonAngle) * ORBITS.moon.distance_km * DISTANCE_SCALE;
    moon.position.z =
        Math.sin(moonAngle) * ORBITS.moon.distance_km * DISTANCE_SCALE;


    const earthScreenRadius = getScreenRadius(earth, camera);
    earthLabel.visible = earthScreenRadius < LABEL_THRESHOLD_PX;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
