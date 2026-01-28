/* LÓGICA DEL SISTEMA SOLAR 3D */
import * as THREE from "three";

import { createRenderer } from "../core/three/renderer.js";
import { createScene } from "../core/three/scene.js";
import { createCamera } from "../core/three/camera.js";
import { startLoop } from "../core/three/loop.js";
import { ORBITS } from "../core/data/orbits.js";
import { DISTANCE_SCALE, RADIUS_SCALE } from "../core/data/scales.js";

const canvas = document.getElementById("solarCanvas");

const renderer = createRenderer(canvas);
const scene = createScene();

const { camera, controls } = createCamera(renderer);

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


/* ====== SOL Y LUCES ====== */

// Sol
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffaa00,
    emissiveIntensity: 1,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Luz del sol
const sunLight = new THREE.PointLight(0xffffff, 2, 300);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Luz ambiente suave
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambientLight);


// ===== TIERRA =====
const earthGroup = new THREE.Group();
scene.add(earthGroup);

const earthRadius =
    ORBITS.earth.radius_km * RADIUS_SCALE;

const earthGeometry = new THREE.SphereGeometry(earthRadius, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x2a6bd4 });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earthGroup.add(earth);

// ===== LUNA =====
const moonGroup = new THREE.Group();
earthGroup.add(moonGroup);

const moonRadius =
    ORBITS.moon.radius_km * RADIUS_SCALE;

const moonGeometry = new THREE.SphereGeometry(moonRadius, 24, 24);
const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xbfbfbf });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moonGroup.add(moon);

// Posición inicial de la Luna (respecto a la Tierra)
moon.position.x =
    ORBITS.moon.distance_km * DISTANCE_SCALE;


/* ======================= */

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animación orbital
let earthAngle = 0;
let moonAngle = 0;

// Animación temporal
function animate() {
    // Órbita Tierra (al Sol)
    earthAngle += 0.001 * (365.25 / ORBITS.earth.period_days);
    const earthDistance =
        ORBITS.earth.distance_km * DISTANCE_SCALE;

    earthGroup.position.x = Math.cos(earthAngle) * earthDistance;
    earthGroup.position.z = Math.sin(earthAngle) * earthDistance;

    // Órbita Luna (a la Tierra)
    moonAngle += 0.01 * (27.32 / ORBITS.moon.period_days);
    moon.position.x =
        Math.cos(moonAngle) * ORBITS.moon.distance_km * DISTANCE_SCALE;
    moon.position.z =
        Math.sin(moonAngle) * ORBITS.moon.distance_km * DISTANCE_SCALE;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();



/*startLoop(renderer, scene, camera, controls);*/
