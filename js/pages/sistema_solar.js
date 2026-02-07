/* LÓGICA DEL SISTEMA SOLAR 3D */
import * as THREE from "three";

// Control de tiempo
import * as timeEngine from "../core/timeEngine.js";

import { createRenderer } from "../core/three/renderer.js";
import { createScene } from "../core/three/scene.js";
import { createCamera } from "../core/three/camera.js";
import { ORBITS } from "../core/data/orbits.js";
import { DISTANCE_SCALE, RADIUS_SCALE } from "../core/data/scales.js";

const astros = [];

// Fecha inicial
const EPOCH_DATE = new Date("2026-01-01T00:00:00Z");
const DAY_MS = 1000 * 60 * 60 * 24;

// Cuando el planeta ocupa muchos píxeles, ocultamos el label
const LABEL_HIDE_PX = 2;
const MOON_LABEL_HIDE_PX = 1.5;


/* ================= PALETA DE COLORES ================= */

const PLANET_COLORS = {
    mercury: { color: 0xb5b5b5, emissive: 0x333333, orbit: 0x888888 },
    venus: { color: 0xe6c47a, emissive: 0x443311, orbit: 0xd4a855 },
    earth: { color: 0x22aaff, emissive: 0x112244, orbit: 0x00d2ff },
    mars: { color: 0xff3300, emissive: 0x441100, orbit: 0xff5500 },
    jupiter: { color: 0xd8a86a, emissive: 0x442211, orbit: 0xc49353 },
    saturn: { color: 0xe3d5a3, emissive: 0x443322, orbit: 0xc9b879 },
    uranus: { color: 0xa3e8e8, emissive: 0x224444, orbit: 0x7ad1d1 },
    neptune: { color: 0x5b7fc4, emissive: 0x112244, orbit: 0x4466aa },
    ceres: { color: 0x8b8b8b, emissive: 0x222222, orbit: 0x666666 },
    pluto: { color: 0xc9b8a0, emissive: 0x332211, orbit: 0xa89575 },
    eris: { color: 0xf0f0f0, emissive: 0x333333, orbit: 0xcccccc },
};

const MOON_COLORS = {
    moon: { color: 0xbfbfbf, emissive: 0x222222, orbit: 0xbfbfbf },
    phobos: { color: 0x8b7355, emissive: 0x221100, orbit: 0x666655 },
    deimos: { color: 0x8b7355, emissive: 0x221100, orbit: 0x666655 },
    io: { color: 0xffcc00, emissive: 0x443300, orbit: 0xccaa00 },
    europa: { color: 0xc9c9c9, emissive: 0x222222, orbit: 0xaaaaaa },
    ganymede: { color: 0x8b8b8b, emissive: 0x222222, orbit: 0x777777 },
    callisto: { color: 0x666666, emissive: 0x111111, orbit: 0x555555 },
    titan: { color: 0xffaa55, emissive: 0x331100, orbit: 0xcc8844 },
    enceladus: { color: 0xffffff, emissive: 0x333333, orbit: 0xdddddd },
    titania: { color: 0x8ba5b5, emissive: 0x223344, orbit: 0x778899 },
    oberon: { color: 0x7a8a8a, emissive: 0x223333, orbit: 0x667777 },
    triton: { color: 0xc9d9e9, emissive: 0x223344, orbit: 0xaabbcc },
    charon: { color: 0x999999, emissive: 0x222222, orbit: 0x777777 },
};

/* ================= CAMERA FOCUS STATE ================= */

const CameraState = {
    FREE: "free",
    FOCUS: "focus",
};

let cameraState = CameraState.FREE;
let focusedObject = null;

let focusTarget = new THREE.Vector3();
let focusDistance = 10;

const FOCUS_LERP = 0.08;

/* ================= RAYCASTER ================= */

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Lista clicable (la llenamos después de crear los meshes)
const clickableObjects = [];

/* ================= HELPERS ================= */

// Órbita como línea fina
function createOrbitLine(radius, color = 0xffffff, segments = 256) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.35,
        depthTest: false,
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
        depthTest: false,
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

function startFocusOn(object, distanceMultiplier = 6) {
    if (!object || !object.geometry) return;

    object.geometry.computeBoundingSphere();

    const worldPos = new THREE.Vector3();
    object.getWorldPosition(worldPos);

    focusedObject = object;
    focusTarget.copy(worldPos);

    const radius = object.geometry.boundingSphere.radius || 1;
    focusDistance = radius * distanceMultiplier;

    cameraState = CameraState.FOCUS;
}

/* ================= FACTORY FUNCTIONS ================= */

function createPlanet(id, colorConfig, parentScene) {
    const orbitData = ORBITS[id];
    if (!orbitData) {
        console.warn(`No orbit data found for planet: ${id}`);
        return null;
    }

    const orbitRadius = orbitData.distance_km * DISTANCE_SCALE;
    const planetRadius = orbitData.radius_km * RADIUS_SCALE;

    // Grupo para la inclinación orbital
    const inclinedGroup = new THREE.Group();
    if (orbitData.inclination_deg) {
        inclinedGroup.rotation.x = THREE.MathUtils.degToRad(orbitData.inclination_deg);
    }
    parentScene.add(inclinedGroup);

    // Crear órbita (dentro del grupo inclinado)
    inclinedGroup.add(createOrbitLine(orbitRadius, colorConfig.orbit));

    // Crear grupo para el planeta (animación de traslación)
    const group = new THREE.Group();
    inclinedGroup.add(group);

    // Crear mesh del planeta
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(planetRadius, 32, 32),
        new THREE.MeshStandardMaterial({
            color: colorConfig.color,
            emissive: colorConfig.emissive,
            emissiveIntensity: 0.2,
        })
    );
    group.add(mesh);

    // Crear label
    const label = createLabel(id.charAt(0).toUpperCase() + id.slice(1));
    label.scale.set(20, 5, 1);
    label.position.y = planetRadius * 10;
    mesh.add(label);

    // Configurar click en label
    label.userData.target = mesh;
    label.userData.focusDistance = 6;

    // Añadir a lista de astros
    astros.push({
        id,
        mesh,
        group,
        orbitRadius,
        period_days: orbitData.period_days,
        initial_phase: orbitData.initial_phase || 0,
        parentGroup: parentScene,
        label,
    });

    return { mesh, group, label };
}

function createMoon(id, colorConfig, parentGroup, parentPlanetId) {
    const orbitData = ORBITS[id];
    if (!orbitData) {
        console.warn(`No orbit data found for moon: ${id}`);
        return null;
    }

    // Usar RADIUS_SCALE para distancias de lunas (misma escala que los radios)
    // Esto asegura que la proporción visual Luna-Planeta sea real (tipo NASA Eyes)
    const orbitRadius = orbitData.distance_km * RADIUS_SCALE;

    // Radio de la luna en la misma escala que todos los astros
    const moonRadius = orbitData.radius_km * RADIUS_SCALE;

    // Grupo para la inclinación orbital de la luna
    const inclinedGroup = new THREE.Group();
    if (orbitData.inclination_deg) {
        inclinedGroup.rotation.x = THREE.MathUtils.degToRad(orbitData.inclination_deg);
    }
    parentGroup.add(inclinedGroup);

    // Crear pivot para la órbita
    const pivot = new THREE.Group();
    inclinedGroup.add(pivot);

    // Crear órbita
    pivot.add(createOrbitLine(orbitRadius, colorConfig.orbit, 128));

    // Crear mesh de la luna
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(moonRadius, 32, 32),
        new THREE.MeshStandardMaterial({
            color: colorConfig.color,
            emissive: colorConfig.emissive,
            emissiveIntensity: 0.35,
            roughness: 1,
            metalness: 0,
        })
    );
    // Posicionar la luna en el plano de la órbita (Y=0.01 para coincidir con createOrbitLine)
    mesh.position.set(orbitRadius, 0.01, 0);
    mesh.renderOrder = 2;
    pivot.add(mesh);

    // Asegurar que el pivot esté en el centro del planeta padre
    pivot.position.set(0, 0, 0);

    // Crear grupo para label
    const labelGroup = new THREE.Group();
    pivot.add(labelGroup);
    labelGroup.position.copy(mesh.position);

    // Crear label con escala proporcional al tamaño de la luna
    const displayName = id.charAt(0).toUpperCase() + id.slice(1);
    const label = createLabel(displayName);
    // Escalar label proporcionalmente al radio de la luna
    const labelScale = Math.max(moonRadius * 8, 0.5);
    label.scale.set(labelScale * 4, labelScale, 1);
    label.position.set(0, moonRadius * 3 + labelScale * 0.5, 0);
    labelGroup.add(label);

    // Configurar click en label
    label.userData.target = mesh;
    label.userData.focusDistance = 4;

    // Añadir a lista de astros
    astros.push({
        id,
        mesh,
        group: pivot,
        orbitRadius,
        period_days: orbitData.period_days,
        initial_phase: orbitData.initial_phase || 0,
        parentGroup,
        parentPlanetId,
        label,
        labelGroup,
        isMoon: true,
    });

    return { mesh, pivot, label, labelGroup };
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

/* ================= CAMERA UX ================= */

// Si el usuario empieza a mover la cámara, cancelamos el focus
controls.addEventListener("start", () => {
    if (cameraState === CameraState.FOCUS) {
        cameraState = CameraState.FREE;
        focusedObject = null;
    }
});

/* ================= SOL ================= */

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffaa00,
        emissiveIntensity: 1,
    })
);
scene.add(sun);

// Increased light intensity
scene.add(new THREE.PointLight(0xffffff, 5.0, 2000));
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
fillLight.position.set(1, 1, 1);
scene.add(fillLight);

clickableObjects.push(sun);

/* ================= PLANETAS ================= */

// Mercurio
const mercury = createPlanet("mercury", PLANET_COLORS.mercury, scene);
clickableObjects.push(mercury.mesh, mercury.label);

// Venus
const venus = createPlanet("venus", PLANET_COLORS.venus, scene);
clickableObjects.push(venus.mesh, venus.label);

// Tierra
const earth = createPlanet("earth", PLANET_COLORS.earth, scene);
clickableObjects.push(earth.mesh, earth.label);

// Marte
const mars = createPlanet("mars", PLANET_COLORS.mars, scene);
clickableObjects.push(mars.mesh, mars.label);

// Júpiter
const jupiter = createPlanet("jupiter", PLANET_COLORS.jupiter, scene);
clickableObjects.push(jupiter.mesh, jupiter.label);

// Saturno
const saturn = createPlanet("saturn", PLANET_COLORS.saturn, scene);
clickableObjects.push(saturn.mesh, saturn.label);

// Urano
const uranus = createPlanet("uranus", PLANET_COLORS.uranus, scene);
clickableObjects.push(uranus.mesh, uranus.label);

// Neptuno
const neptune = createPlanet("neptune", PLANET_COLORS.neptune, scene);
clickableObjects.push(neptune.mesh, neptune.label);

/* ================= PLANETAS ENANOS ================= */

// Ceres
const ceres = createPlanet("ceres", PLANET_COLORS.ceres, scene);
clickableObjects.push(ceres.mesh, ceres.label);

// Plutón
const pluto = createPlanet("pluto", PLANET_COLORS.pluto, scene);
clickableObjects.push(pluto.mesh, pluto.label);

// Eris
const eris = createPlanet("eris", PLANET_COLORS.eris, scene);
clickableObjects.push(eris.mesh, eris.label);

/* ================= LUNAS ================= */

// Luna (Tierra)
const moon = createMoon("moon", MOON_COLORS.moon, earth.group, "earth");
clickableObjects.push(moon.mesh, moon.label);

// Phobos y Deimos (Marte)
const phobos = createMoon("phobos", MOON_COLORS.phobos, mars.group, "mars");
clickableObjects.push(phobos.mesh, phobos.label);

const deimos = createMoon("deimos", MOON_COLORS.deimos, mars.group, "mars");
clickableObjects.push(deimos.mesh, deimos.label);

// Lunas de Júpiter (Galileanas)
const io = createMoon("io", MOON_COLORS.io, jupiter.group, "jupiter");
clickableObjects.push(io.mesh, io.label);

const europa = createMoon("europa", MOON_COLORS.europa, jupiter.group, "jupiter");
clickableObjects.push(europa.mesh, europa.label);

const ganymede = createMoon("ganymede", MOON_COLORS.ganymede, jupiter.group, "jupiter");
clickableObjects.push(ganymede.mesh, ganymede.label);

const callisto = createMoon("callisto", MOON_COLORS.callisto, jupiter.group, "jupiter");
clickableObjects.push(callisto.mesh, callisto.label);

// Lunas de Saturno
const titan = createMoon("titan", MOON_COLORS.titan, saturn.group, "saturn");
clickableObjects.push(titan.mesh, titan.label);

const enceladus = createMoon("enceladus", MOON_COLORS.enceladus, saturn.group, "saturn");
clickableObjects.push(enceladus.mesh, enceladus.label);

// Lunas de Urano
const titania = createMoon("titania", MOON_COLORS.titania, uranus.group, "uranus");
clickableObjects.push(titania.mesh, titania.label);

const oberon = createMoon("oberon", MOON_COLORS.oberon, uranus.group, "uranus");
clickableObjects.push(oberon.mesh, oberon.label);

// Luna de Neptuno
const triton = createMoon("triton", MOON_COLORS.triton, neptune.group, "neptune");
clickableObjects.push(triton.mesh, triton.label);

// Luna de Plutón
const charon = createMoon("charon", MOON_COLORS.charon, pluto.group, "pluto");
clickableObjects.push(charon.mesh, charon.label);

/* ================= CLICK HANDLERS ================= */

window.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(clickableObjects, false);
    if (intersects.length === 0) return;

    const clicked = intersects[0].object;

    // Lógica para el Sol
    if (clicked === sun) {
        startFocusOn(sun, 10);
        return;
    }

    // Lógica para labels y meshes (userData)
    if (clicked.userData.target) {
        startFocusOn(clicked.userData.target, clicked.userData.focusDistance || 6);
        return;
    }

    // Buscar en astros
    const astro = astros.find(a => a.mesh === clicked);
    if (astro) {
        startFocusOn(astro.mesh, astro.isMoon ? 4 : 6);
    }
});

window.addEventListener("dblclick", () => {
    startFocusOn(sun, 10);
});

/* ================= ANIMACIÓN ================= */

function animate() {
    timeEngine.update();

    const now = timeEngine.getCurrentDate();
    const daysElapsed = (now - EPOCH_DATE) / DAY_MS;

    // Actualizar posiciones de todos los astros
    for (const astro of astros) {
        // ÁNGULO = fase_inicial - (días * velocidad_angular)
        // Usamos resta para que el movimiento sea antihorario visto desde el norte
        const angle =
            (astro.initial_phase || 0) -
            (daysElapsed / astro.period_days) * Math.PI * 2;

        if (astro.isMoon) {
            // Las lunas rotan su pivot
            astro.group.rotation.y = angle;
        } else {
            // Los planetas se posicionan en su órbita
            astro.group.position.set(
                Math.cos(angle) * astro.orbitRadius,
                0,
                Math.sin(angle) * astro.orbitRadius
            );
        }

        // Actualizar visibilidad del label basado en distancia
        const px = getScreenRadius(astro.mesh, camera);
        const threshold = astro.isMoon ? MOON_LABEL_HIDE_PX : LABEL_HIDE_PX;
        astro.label.visible = px < threshold;

        // Billboard para labels
        astro.label.quaternion.copy(camera.quaternion);
    }

    /* ================= CAMERA FOCUS UPDATE ================= */

    if (cameraState === CameraState.FOCUS && focusedObject) {
        focusedObject.getWorldPosition(focusTarget);

        controls.target.lerp(focusTarget, FOCUS_LERP);

        const dir = new THREE.Vector3()
            .subVectors(camera.position, controls.target)
            .normalize();

        const desiredPos = new THREE.Vector3()
            .copy(focusTarget)
            .add(dir.multiplyScalar(focusDistance));

        camera.position.lerp(desiredPos, FOCUS_LERP);

        if (camera.position.distanceTo(desiredPos) < 0.05) {
            cameraState = CameraState.FREE;
            focusedObject = null;
        }
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
