/* LÓGICA DEL SISTEMA SOLAR 3D */
import * as THREE from "three";

import { createRenderer } from "../core/three/renderer.js";
import { createScene } from "../core/three/scene.js";
import { createCamera } from "../core/three/camera.js";
import { startLoop } from "../core/three/loop.js";

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

/* ======================= */

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

startLoop(renderer, scene, camera, controls);
