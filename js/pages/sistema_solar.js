/* LÓGICA DEL SISTEMA SOLAR 3D */
import * as THREE from "three";

// Control de tiempo
import * as timeEngine from "../core/timeEngine.js";

import { createRenderer } from "../core/three/renderer.js";
import { createScene } from "../core/three/scene.js";
import { createCamera } from "../core/three/camera.js";
import { ORBITS } from "../core/data/orbits.js";
import { DISTANCE_SCALE, RADIUS_SCALE } from "../core/data/scales.js";

// Fecha inicial
const EPOCH_DATE = new Date("2026-01-01T00:00:00Z");
const DAY_MS = 1000 * 60 * 60 * 24;

// Cuando el planeta ocupa muchos píxeles, ocultamos el label
const EARTH_LABEL_HIDE_PX = 2;
const MOON_LABEL_HIDE_PX = 1.5;

/* ================= HELPERS ================= */

function createOrbit(radius, color = 0xffffff) {
    const geometry = new THREE.RingGeometry(radius - 0.05, radius + 0.05, 128);
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

// Órbita como línea fina
function createOrbitLine(radius, color = 0xffffff, segments = 256) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        points.push(
            new THREE.Vector3(
                Math.cos(a) * radius,
                0,
                Math.sin(a) * radius
            )
        );
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.35,
        depthTest: false
    });

    const line = new THREE.LineLoop(geometry, material);
    line.position.y = 0.01; // evita z-fighting
    line.renderOrder = 1;
    return line;
}

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
        transparent: true,
        depthTest: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(40, 10, 1);
    sprite.renderOrder = 999;
    return sprite;
}

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

/* ================= INIT ================= */

const canvas = document.getElementById("solarCanvas");
const renderer = createRenderer(canvas);
const scene = createScene();
const { camera, controls } = createCamera(renderer);

timeEngine.init();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ================= SOL ================= */

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffaa00,
        emissiveIntensity: 1
    })
);
scene.add(sun);

scene.add(new THREE.PointLight(0xffffff, 3.2, 2000));
scene.add(new THREE.AmbientLight(0xffffff, 0.45));

const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
fillLight.position.set(1, 1, 1);
scene.add(fillLight);

/* ================= TIERRA ================= */

// Órbita de la Tierra (en unidades Three coherentes con DISTANCE_SCALE)
scene.add(
    createOrbit(ORBITS.earth.distance_km * DISTANCE_SCALE, 0x3b82f6)
);

const earthGroup = new THREE.Group();
scene.add(earthGroup);

const earthRadius = ORBITS.earth.radius_km * RADIUS_SCALE;
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(earthRadius, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x2a6bd4 })
);
earthGroup.add(earth);

const earthLabel = createLabel("Tierra");
// Label más pequeño que el de la Luna
earthLabel.scale.set(20, 5, 10);

earthLabel.position.y = earthRadius * 10;
earth.add(earthLabel);

/* ================= LUNA ================= */

// Pivot orbital: rota TODO (Luna + órbita) alrededor de la Tierra
const moonPivot = new THREE.Group();
earthGroup.add(moonPivot);

// Ajuste visual de distancia lunar (NASA-style)
const MOON_DISTANCE_VISUAL_MULTIPLIER = 5;
const moonOrbitRadius =
    ORBITS.moon.distance_km * DISTANCE_SCALE * MOON_DISTANCE_VISUAL_MULTIPLIER;

// Órbita lunar (ligada al pivot, no estática)
const moonOrbit = createOrbitLine(moonOrbitRadius, 0xbfbfbf, 256);
moonPivot.add(moonOrbit);

// Luna (escala REAL según RADIUS_SCALE)
const moonRadius = ORBITS.moon.radius_km * RADIUS_SCALE;
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(moonRadius, 64, 64),
    new THREE.MeshStandardMaterial({
        color: 0xbfbfbf,
        roughness: 1,
        metalness: 0
    })
);

// Luz de relleno suave
moon.material.emissive = new THREE.Color(0x222222);
moon.material.emissiveIntensity = 0.35;

moon.renderOrder = 2;

// 🔑 POSICIÓN LOCAL: distancia Tierra–Luna
moon.position.set(moonOrbitRadius, 0, 0);
moonPivot.add(moon);

/* ===== Label Luna ===== */

// Grupo que sigue a la Luna
const moonLabelGroup = new THREE.Group();
moonPivot.add(moonLabelGroup);

// El grupo se coloca exactamente donde está la Luna
moonLabelGroup.position.copy(moon.position);

// Label
const moonLabel = createLabel("Luna");
moonLabel.scale.set(6, 1.5, 1);
moonLabel.position.set(0, moonRadius * 6, 0);
moonLabelGroup.add(moonLabel);

/* ================= ANIMACIÓN ================= */

function animate() {
    timeEngine.update();

    const now = timeEngine.getCurrentDate();
    const daysElapsed = (now - EPOCH_DATE) / DAY_MS;

    // Tierra alrededor del Sol
    const earthAngle =
        (daysElapsed / ORBITS.earth.period_days) * Math.PI * 2;

    const earthDistance =
        ORBITS.earth.distance_km * DISTANCE_SCALE;

    earthGroup.position.set(
        Math.cos(earthAngle) * earthDistance,
        0,
        Math.sin(earthAngle) * earthDistance
    );

    // Luna alrededor de la Tierra (rotación del pivot)
    const moonAngle =
        (daysElapsed / ORBITS.moon.period_days) * Math.PI * 2;

    moonPivot.rotation.y = moonAngle;

    // Ocultar label de la Tierra al hacer zoom cercano
    const earthPx = getScreenRadius(earth, camera);
    earthLabel.visible = earthPx < EARTH_LABEL_HIDE_PX;

    // Ocultar label de la Luna al hacer zoom cercano
    const moonPx = getScreenRadius(moon, camera);
    moonLabel.visible = moonPx < MOON_LABEL_HIDE_PX;

    // Billboard: labels siempre miran a cámara
    earthLabel.quaternion.copy(camera.quaternion);
    moonLabel.quaternion.copy(camera.quaternion);

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();