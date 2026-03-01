/* LÓGICA DEL MAPA DE ESTRELLAS — Vista de planetario interactiva */
import * as THREE from "three";
import * as timeEngine from "../core/timeEngine.js";
import { createRenderer } from "../core/three/renderer.js";
import { createCelestialCamera } from "../core/three/celestialCamera.js";
import { CONSTELLATIONS } from "../core/data/constellations.js";
import { BACKGROUND_STARS } from "../core/data/stars.js";
import {
    equatorialToCartesian,
    getSiderealRotation,
    getLatitudeInclination
} from "../core/celestial.js";
import { initSearchBar } from "../core/logica_ui/search.ui.js";
import { auth, db } from "../core/firebase.js";
import {
    doc, setDoc, deleteDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= CONSTANTES ================= */

const SPHERE_RADIUS = 1000;
const STAR_BASE_SIZE = 3.5;

// Posición del observador (default: Valencia)
let observerLat = 39.47;
let observerLon = -0.38;

// Nombres de constelaciones en español ya incluidos en los datos

/* ================= INIT ================= */

const canvas = document.getElementById("starCanvas");
const renderer = createRenderer(canvas);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020209);

const { camera, controls } = createCelestialCamera(renderer);

timeEngine.init();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ================= UI FAVORITOS ================= */

const btnToggleFavorite = document.getElementById("btnToggleFavorite");
const favoriteAstroName = document.getElementById("favoriteAstroName");
const favoriteHeartIcon = document.getElementById("favoriteHeartIcon");

let currentFocusedId = null;

async function checkIfFavorite(id) {
    const user = auth.currentUser;
    if (!user) return false;
    try {
        const favRef = doc(db, "users", user.uid, "favorites", id);
        const snap = await getDoc(favRef);
        return snap.exists();
    } catch (e) {
        console.error("Error en checkIfFavorite:", e);
        return false;
    }
}

async function toggleFavorite(id) {
    const user = auth.currentUser;
    if (!user) { alert("Debes iniciar sesión para guardar favoritos"); return; }

    const favRef = doc(db, "users", user.uid, "favorites", id);
    btnToggleFavorite.style.pointerEvents = "none";
    btnToggleFavorite.style.opacity = "0.5";

    try {
        const isFav = await checkIfFavorite(id);
        if (isFav) {
            await deleteDoc(favRef);
        } else {
            const constellation = CONSTELLATIONS.find(c => c.id === id);
            if (!constellation) return;
            await setDoc(favRef, {
                id,
                name: constellation.name,
                type: "constellation",
                timestamp: serverTimestamp()
            });
        }
    } catch (error) {
        console.error("Error al gestionar favorito:", error);
    } finally {
        btnToggleFavorite.style.pointerEvents = "auto";
        btnToggleFavorite.style.opacity = "1";
        updateFavoriteUI(id);
    }
}

async function updateFavoriteUI(id) {
    const isFav = await checkIfFavorite(id);
    if (isFav) {
        btnToggleFavorite.classList.add("is-favorite");
        favoriteHeartIcon.src = "/assets/icons/user/favourite_red.svg";
        favoriteHeartIcon.style.filter = "none";
    } else {
        btnToggleFavorite.classList.remove("is-favorite");
        favoriteHeartIcon.src = "/assets/icons/nav/favourites.svg";
        favoriteHeartIcon.style.filter = "brightness(0) saturate(100%) invert(74%) sepia(18%) saturate(1096%) hue-rotate(198deg) brightness(103%) contrast(101%)";
    }
}

btnToggleFavorite.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const heartIcon = btnToggleFavorite.querySelector('.heart-icon');
    if (heartIcon) {
        heartIcon.style.animation = 'heartBeat 0.3s ease';
        setTimeout(() => { heartIcon.style.animation = ''; }, 300);
    }

    if (currentFocusedId) {
        toggleFavorite(currentFocusedId);
    }
});

/* ================= GRUPOS DE ESCENA ================= */

// Grupo principal que rota según el tiempo sidéreo y la latitud del observador
const celestialSphere = new THREE.Group();
scene.add(celestialSphere);

// Grupo para el horizonte (NO rota con las estrellas)
const horizonGroup = new THREE.Group();
scene.add(horizonGroup);

/* ================= ESTRELLAS DE FONDO ================= */

function createBackgroundStars() {
    // Recopilar TODAS las estrellas: de constelaciones + fondo
    const allStars = [];

    // Estrellas de constelaciones
    CONSTELLATIONS.forEach(c => {
        c.stars.forEach(s => {
            allStars.push({ ra: s.ra, dec: s.dec, mag: s.mag });
        });
    });

    // Estrellas del catálogo de fondo
    BACKGROUND_STARS.forEach(s => {
        allStars.push({ ra: s.ra, dec: s.dec, mag: s.mag });
    });

    // Añadir estrellas procedurales tenues para llenar el cielo (pocas)
    const PROCEDURAL_COUNT = 800;
    for (let i = 0; i < PROCEDURAL_COUNT; i++) {
        allStars.push({
            ra: Math.random() * 24,
            dec: (Math.random() * 180 - 90),
            mag: 4.5 + Math.random() * 1.5  // mag 4.5–6.0 (tenues)
        });
    }

    const count = allStars.length;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    allStars.forEach((star, i) => {
        const pos = equatorialToCartesian(star.ra, star.dec, SPHERE_RADIUS);
        positions[i * 3] = pos.x;
        positions[i * 3 + 1] = pos.y;
        positions[i * 3 + 2] = pos.z;

        // Tamaño inversamente proporcional a la magnitud
        const brightness = Math.max(0.3, (6.5 - star.mag) / 6.5);
        sizes[i] = STAR_BASE_SIZE * brightness * brightness * 2.5;

        // Color basado en magnitud (estrellas brillantes más cálidas)
        if (star.mag < 1.0) {
            colors[i * 3] = 1.0;
            colors[i * 3 + 1] = 0.95;
            colors[i * 3 + 2] = 0.85;
        } else if (star.mag < 2.5) {
            colors[i * 3] = 0.9;
            colors[i * 3 + 1] = 0.92;
            colors[i * 3 + 2] = 1.0;
        } else {
            const b = 0.6 + brightness * 0.4;
            colors[i * 3] = b;
            colors[i * 3 + 1] = b;
            colors[i * 3 + 2] = b;
        }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: STAR_BASE_SIZE,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    celestialSphere.add(points);
}

createBackgroundStars();

/* ================= CONSTELACIONES ================= */

const constellationData = [];  // Para búsqueda y focus
const clickableObjects = [];
const LABEL_SCALE = 60;

function createConstellationLines() {
    CONSTELLATIONS.forEach(constellation => {
        const starPositions = constellation.stars.map(s =>
            equatorialToCartesian(s.ra, s.dec, SPHERE_RADIUS * 0.999)
        );

        // --- Líneas ---
        const linePositions = [];
        constellation.lines.forEach(([a, b]) => {
            const pA = starPositions[a];
            const pB = starPositions[b];
            linePositions.push(pA.x, pA.y, pA.z, pB.x, pB.y, pB.z);
        });

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute("position",
            new THREE.Float32BufferAttribute(linePositions, 3));

        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x4466aa,
            transparent: true,
            opacity: 0.35,
            depthWrite: false,
        });

        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        celestialSphere.add(lines);

        // --- Label (centrado en la constelación) ---
        const center = { x: 0, y: 0, z: 0 };
        starPositions.forEach(p => {
            center.x += p.x; center.y += p.y; center.z += p.z;
        });
        center.x /= starPositions.length;
        center.y /= starPositions.length;
        center.z /= starPositions.length;

        // Normalizar al radio de la esfera
        const len = Math.sqrt(center.x ** 2 + center.y ** 2 + center.z ** 2);
        center.x = (center.x / len) * SPHERE_RADIUS * 0.998;
        center.y = (center.y / len) * SPHERE_RADIUS * 0.998;
        center.z = (center.z / len) * SPHERE_RADIUS * 0.998;

        const label = createLabel(constellation.name);
        label.position.set(center.x, center.y, center.z);
        label.scale.set(LABEL_SCALE, LABEL_SCALE * 0.25, 1);
        celestialSphere.add(label);

        // Esfera invisible en el centro (para raycasting del label)
        const hitSphere = new THREE.Mesh(
            new THREE.SphereGeometry(25, 8, 8),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        hitSphere.position.set(center.x, center.y, center.z);
        hitSphere.userData.constellationId = constellation.id;
        celestialSphere.add(hitSphere);
        clickableObjects.push(hitSphere);

        // Esfera invisible en CADA estrella (para poder clickar en cualquier punto)
        starPositions.forEach(pos => {
            const starHit = new THREE.Mesh(
                new THREE.SphereGeometry(15, 6, 6),
                new THREE.MeshBasicMaterial({ visible: false })
            );
            starHit.position.set(pos.x, pos.y, pos.z);
            starHit.userData.constellationId = constellation.id;
            celestialSphere.add(starHit);
            clickableObjects.push(starHit);
        });

        // Guardar datos para búsqueda y focus
        constellationData.push({
            id: constellation.id,
            displayName: constellation.name,
            abbr: constellation.abbr,
            center: new THREE.Vector3(center.x, center.y, center.z),
            label,
            lines,
            hitSphere,
        });
    });
}

function createLabel(text) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 512;
    canvas.height = 128;

    ctx.fillStyle = "rgba(180, 200, 255, 0.85)";
    ctx.font = "bold 36px 'Inter', 'Lexend', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.toUpperCase(), 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
    });

    const sprite = new THREE.Sprite(material);
    sprite.renderOrder = 999;
    return sprite;
}

createConstellationLines();

/* ================= CUADRÍCULA CELESTE ================= */

function createCelestialGrid() {
    const gridGroup = new THREE.Group();
    const gridRadius = SPHERE_RADIUS * 0.997;
    const gridColor = 0x223355;
    const gridOpacity = 0.12;

    // Líneas de declinación (paralelos) cada 30°
    for (let dec = -60; dec <= 60; dec += 30) {
        const points = [];
        for (let ra = 0; ra <= 24; ra += 0.1) {
            const pos = equatorialToCartesian(ra, dec, gridRadius);
            points.push(new THREE.Vector3(pos.x, pos.y, pos.z));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: gridColor,
            transparent: true,
            opacity: gridOpacity,
            depthWrite: false,
        });
        gridGroup.add(new THREE.Line(geometry, material));
    }

    // Ecuador celeste (dec = 0) más visible
    const eqPoints = [];
    for (let ra = 0; ra <= 24; ra += 0.05) {
        const pos = equatorialToCartesian(ra, 0, gridRadius);
        eqPoints.push(new THREE.Vector3(pos.x, pos.y, pos.z));
    }
    const eqGeometry = new THREE.BufferGeometry().setFromPoints(eqPoints);
    const eqMaterial = new THREE.LineBasicMaterial({
        color: 0x3355aa,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
    });
    gridGroup.add(new THREE.Line(eqGeometry, eqMaterial));

    // Líneas de ascensión recta (meridianos) cada 2h
    for (let ra = 0; ra < 24; ra += 2) {
        const points = [];
        for (let dec = -90; dec <= 90; dec += 1) {
            const pos = equatorialToCartesian(ra, dec, gridRadius);
            points.push(new THREE.Vector3(pos.x, pos.y, pos.z));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: gridColor,
            transparent: true,
            opacity: gridOpacity,
            depthWrite: false,
        });
        gridGroup.add(new THREE.Line(geometry, material));
    }

    celestialSphere.add(gridGroup);
}

createCelestialGrid();

/* ================= HORIZONTE CON MONTAÑAS ================= */

function createHorizon() {
    // --- Disco opaco bajo el horizonte ---
    const discGeometry = new THREE.CircleGeometry(SPHERE_RADIUS * 1.2, 64);
    const discMaterial = new THREE.MeshBasicMaterial({
        color: 0x050510,
        side: THREE.DoubleSide,
        depthWrite: true,
    });
    const disc = new THREE.Mesh(discGeometry, discMaterial);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = -1;
    horizonGroup.add(disc);

    // --- Montañas geométricas (silueta low-poly) ---
    const mountainSegments = 120;
    const mountainVertices = [];
    const mountainIndices = [];

    for (let i = 0; i <= mountainSegments; i++) {
        const angle = (i / mountainSegments) * Math.PI * 2;
        const r = SPHERE_RADIUS * 0.6;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;

        // Base (a nivel del horizonte)
        mountainVertices.push(x, 0, z);

        // Pico (altura variable para parecer montañas)
        const height = 15 + Math.sin(angle * 5) * 12
            + Math.sin(angle * 13) * 8
            + Math.sin(angle * 23) * 5
            + Math.cos(angle * 7) * 10;
        mountainVertices.push(x, Math.max(5, height), z);

        // Triángulos
        if (i < mountainSegments) {
            const base = i * 2;
            mountainIndices.push(base, base + 1, base + 2);
            mountainIndices.push(base + 1, base + 3, base + 2);
        }
    }

    const mtGeometry = new THREE.BufferGeometry();
    mtGeometry.setAttribute("position",
        new THREE.Float32BufferAttribute(mountainVertices, 3));
    mtGeometry.setIndex(mountainIndices);
    mtGeometry.computeVertexNormals();

    const mtMaterial = new THREE.MeshBasicMaterial({
        color: 0x1a1a2e,
        side: THREE.DoubleSide,
    });

    const mountains = new THREE.Mesh(mtGeometry, mtMaterial);
    horizonGroup.add(mountains);
}

createHorizon();

/* ================= LUZ AMBIENTAL ================= */

scene.add(new THREE.AmbientLight(0xffffff, 0.15));

/* ================= RAYCASTER ================= */

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

/* ================= CAMERA FOCUS ================= */

function startFocusOn(constellationId, allowBelowHorizon = false) {
    const data = constellationData.find(c => c.id === constellationId);
    if (!data) return;

    // Obtenemos la posición mundial del centro de la constelación
    const worldPos = new THREE.Vector3();
    data.hitSphere.getWorldPosition(worldPos);

    // Focus: apuntamos la cámara hacia esa dirección
    controls.lookAt(worldPos, allowBelowHorizon);

    // UI de favoritos
    currentFocusedId = constellationId;
    favoriteAstroName.textContent = data.displayName;
    btnToggleFavorite.style.display = "flex";
    updateFavoriteUI(constellationId);

    // Resaltar líneas de la constelación
    constellationData.forEach(c => {
        c.lines.material.opacity = c.id === constellationId ? 0.7 : 0.2;
        c.lines.material.color.setHex(c.id === constellationId ? 0x88aaff : 0x4466aa);
    });
}

// Cancelar focus al mover la cámara
controls.addEventListener("start", () => {
    // Al arrastrar, cerramos el card de favoritos y restauramos opacidad
    if (currentFocusedId) {
        btnToggleFavorite.style.display = "none";
        currentFocusedId = null;

        constellationData.forEach(c => {
            c.lines.material.opacity = 0.35;
            c.lines.material.color.setHex(0x4466aa);
        });
    }
});

/* ================= CLICK HANDLER ================= */

window.addEventListener("click", (event) => {
    // Ignorar clicks en UI
    if (event.target.closest(".search-bar-container, .timebar, .live-btn, .favorite-card, .location-selector")) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(clickableObjects, false);
    if (intersects.length === 0) return;

    const clicked = intersects[0].object;
    if (clicked.userData.constellationId) {
        startFocusOn(clicked.userData.constellationId);
    }
});

/* ================= SELECTOR DE UBICACIÓN ================= */

const locationDisplay = document.getElementById("locationDisplay");
const locationPanel = document.getElementById("locationPanel");
const locationToggle = document.getElementById("locationToggle");
const latInput = document.getElementById("latInput");
const lonInput = document.getElementById("lonInput");
const locationApplyBtn = document.getElementById("locationApplyBtn");
const locationGeoBtn = document.getElementById("locationGeoBtn");

if (locationToggle) {
    locationToggle.addEventListener("click", () => {
        locationPanel.classList.toggle("is-visible");
    });
}

if (locationApplyBtn) {
    locationApplyBtn.addEventListener("click", () => {
        const lat = parseFloat(latInput.value);
        const lon = parseFloat(lonInput.value);
        if (!isNaN(lat) && !isNaN(lon)) {
            observerLat = lat;
            observerLon = lon;
            updateLocationDisplay();
            locationPanel.classList.remove("is-visible");
        }
    });
}

if (locationGeoBtn) {
    locationGeoBtn.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    observerLat = pos.coords.latitude;
                    observerLon = pos.coords.longitude;
                    latInput.value = observerLat.toFixed(2);
                    lonInput.value = observerLon.toFixed(2);
                    updateLocationDisplay();
                    locationPanel.classList.remove("is-visible");
                },
                () => { alert("No se pudo obtener la ubicación."); }
            );
        }
    });
}

function updateLocationDisplay() {
    if (locationDisplay) {
        const latDir = observerLat >= 0 ? "N" : "S";
        const lonDir = observerLon >= 0 ? "E" : "W";
        locationDisplay.textContent =
            `${Math.abs(observerLat).toFixed(1)}°${latDir}  ${Math.abs(observerLon).toFixed(1)}°${lonDir}`;
    }
}

updateLocationDisplay();

/* ================= ANIMACIÓN ================= */

function animate() {
    timeEngine.update();

    const now = timeEngine.getCurrentDate();

    // Rotar la esfera celeste según el tiempo sidéreo local
    const siderealAngle = getSiderealRotation(observerLon, now);
    celestialSphere.rotation.y = siderealAngle;

    // Inclinar según la latitud del observador
    const latInclination = getLatitudeInclination(observerLat);
    celestialSphere.rotation.x = latInclination;

    // La animación de focus se maneja internamente por el damping de los controles

    // Billboard para labels (siempre de frente a la cámara)
    constellationData.forEach(c => {
        c.label.quaternion.copy(camera.quaternion);
    });

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

/* ================= BARRA DE BÚSQUEDA ================= */

const searchList = constellationData.map(c => ({
    id: c.id,
    displayName: c.displayName,
    mesh: c.hitSphere,  // Para compatibilidad con search.ui.js
    isMoon: false,
    type: "Constelación",
    icon: "⭐",
}));

initSearchBar(searchList, (data) => {
    startFocusOn(data.id, true);  // true = permite mirar bajo el horizonte
});

/* ================= DEEP LINKING ================= */

const urlParams = new URLSearchParams(window.location.search);
const focusId = urlParams.get("focus");
if (focusId) {
    setTimeout(() => {
        startFocusOn(focusId, true);  // true = permite mirar bajo el horizonte
    }, 500);
}

/* ================= START ================= */

animate();
