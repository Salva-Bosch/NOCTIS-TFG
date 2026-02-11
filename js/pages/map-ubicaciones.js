import { loadSideNav } from "../core/loadSideNav.js";
import { requireSession } from "../guards/sessionGuard.js";
import { auth, db } from "../core/firebase.js";
import {
    doc,
    setDoc,
    deleteDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

await requireSession();
await loadSideNav();

console.log('Session y SideNav cargados');

/* ============================================
   CONFIGURACIÓN DEL MAPA
   ============================================ */

const map = L.map('map', {
    center: [30.0, 0.0],
    zoom: 3,
    minZoom: 2,
    maxZoom: 18,
    zoomControl: false,
    attributionControl: true
});

console.log('Mapa creado');

const worldBounds = L.latLngBounds(
    L.latLng(-85, -180),
    L.latLng(85, 180)
);
map.setMaxBounds(worldBounds);
map.on('drag', function () {
    map.panInsideBounds(worldBounds, { animate: false });
});

/* ============================================
   CAPA BASE
   ============================================ */

const darkBase = L.tileLayer(
    'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    {
        attribution: '© Stadia Maps © OpenStreetMap',
        maxZoom: 20,
        noWrap: true
    }
);

darkBase.addTo(map);
console.log('Mapa base añadido');

/* ============================================
   CARGAR UBICACIONES DESDE JSON
   ============================================ */

let locations = [];

try {
    const response = await fetch('../../../../data/locations.json');
    if (!response.ok) throw new Error('Error cargando ubicaciones');
    locations = await response.json();
    console.log(`${locations.length} ubicaciones cargadas desde JSON`);
} catch (error) {
    console.error('Error al cargar ubicaciones:', error);
}

/* ============================================
   LÓGICA DE COLORES
   ============================================ */

function getBortleColor(bortle) {
    const colors = {
        1: '#b07cff',
        2: '#7aa2ff',
        3: '#4dd4ac',
        4: '#6fdc8c',
        5: '#a8e063',
        6: '#ffd166',
        7: '#f4a261',
        8: '#e76f51',
        9: '#ffffff'
    };
    return colors[bortle] || '#8b9cff';
}

function createMarkerIcon(bortle) {
    const color = getBortleColor(bortle);

    const iconNames = {
        1: 'excepcional',
        2: 'excelente',
        3: 'muy-bueno',
        4: 'bueno',
        5: 'moderado',
        6: 'suburbano-brillante',
        7: 'transicion-urbana',
        8: 'ciudad',
        9: 'centro-urbano'
    };

    const iconName = iconNames[bortle] || 'bueno';

    return L.divIcon({
        className: 'custom-marker-icon',
        html: `
            <div style="
                width: 25px;
                height: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                filter: drop-shadow(0 3px 10px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 12px ${color}40);
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                <img src="../../../../assets/icons/ui/ubicaciones/${iconName}.svg"
                     alt="Marcador ${iconName}"
                     width="36"
                     height="36"
                     style="display: block;">
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
    });
}

/* ============================================
   AÑADIR MARCADORES
   ============================================ */

locations.forEach(location => {
    const marker = L.marker(location.coords, {
        icon: createMarkerIcon(location.bortle)
    }).addTo(map);

    marker.on('click', function () {
        openLocationModal(location);
    });
});

console.log(`${locations.length} marcadores añadidos al mapa`);

/* ============================================
   MODAL LATERAL
   ============================================ */

const panel = document.getElementById('locationPanel');
const panelContent = document.getElementById('panelContent');
const panelClose = document.getElementById('panelClose');

const heartOutline = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
const heartFilled = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;

async function openLocationModal(location) {
    const color = getBortleColor(location.bortle);
    const isFavorited = await isFavorite(location.id);

    panelContent.innerHTML = `
        <div class="panel-header">
            <h1 class="panel-location-name">${location.name}</h1>
            <div class="panel-region">${location.region}</div>
        </div>

        <div class="quality-indicator">
            <div class="quality-label">Calidad del Cielo</div>
            <div class="quality-badge">
                <span class="quality-dot" style="background: ${color}; color: ${color};"></span>
                <span class="quality-text">${location.quality}</span>
            </div>
            <div class="bortle-scale">
                <strong>Escala Bortle:</strong> Clase ${location.bortle} de 9
            </div>
        </div>

        <div class="panel-badges">
            <span class="badge">${location.type}</span>
            ${location.certification ? `<span class="badge certification">${location.certification}</span>` : ''}
        </div>

        <div class="panel-description">
            <p>${location.description}</p>
        </div>

        <div class="panel-features">
            <h3 class="panel-section-title">Características</h3>
            <ul class="features-list">
                ${location.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>

        <div class="panel-actions">
            <button class="btn-favorite ${isFavorited ? 'favorited' : ''}" data-location-id="${location.id}">
                <span class="heart-icon">${isFavorited ? heartFilled : heartOutline}</span>
                <span>${isFavorited ? 'Guardado en Favoritos' : 'Añadir a Favoritos'}</span>
            </button>
        </div>
    `;

    // Actualizar botón sin recargar todo el panel
    const favBtn = panelContent.querySelector('.btn-favorite');

    function updateFavBtn(favorited) {
        favBtn.className = `btn-favorite ${favorited ? 'favorited' : ''}`;
        favBtn.innerHTML = `
            <span class="heart-icon">${favorited ? heartFilled : heartOutline}</span>
            <span>${favorited ? 'Guardado en Favoritos' : 'Añadir a Favoritos'}</span>
        `;
    }

    favBtn.addEventListener('click', async function () {
        await toggleFavorite(location);
        const nowFavorited = await isFavorite(location.id);
        updateFavBtn(nowFavorited);
    });

    panel.classList.add('active');
}

function closeLocationModal() {
    panel.classList.remove('active');
}

panelClose.addEventListener('click', closeLocationModal);

map.on('click', function () {
    closeLocationModal();
});

/* ============================================
   MODAL DE INFORMACIÓN
   ============================================ */

const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const infoClose = document.getElementById('infoClose');

infoBtn.addEventListener('click', () => {
    infoModal.classList.add('active');
});

infoClose.addEventListener('click', () => {
    infoModal.classList.remove('active');
});

infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) {
        infoModal.classList.remove('active');
    }
});

/* ============================================
   SISTEMA DE FAVORITOS - FIREBASE
   ============================================ */

async function isFavorite(locationId) {
    const user = auth.currentUser;
    if (!user) return false;

    const ref = doc(db, "users", user.uid, "favorites", `map_${locationId}`);
    const snap = await getDoc(ref);
    return snap.exists();
}

async function toggleFavorite(location) {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "favorites", `map_${location.id}`);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        await deleteDoc(ref);
        console.log(`Eliminado de favoritos: ${location.name}`);
    } else {
        await setDoc(ref, {
            id: `map_${location.id}`,
            name: location.name,
            type: "location",
            region: location.region,
            bortle: location.bortle,
            quality: location.quality,
            timestamp: serverTimestamp()
        });
        console.log(`Añadido a favoritos: ${location.name}`);
    }
}

/* ============================================
   AJUSTES FINALES
   ============================================ */

setTimeout(() => {
    map.invalidateSize();
    console.log('Mapa listo con ubicaciones desde JSON');
}, 200);