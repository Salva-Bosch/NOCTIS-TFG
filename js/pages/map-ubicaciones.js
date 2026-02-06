import { loadSideNav } from "../core/loadSideNav.js";
import { requireSession } from "../guards/sessionGuard.js";

// Cargar autenticación y navegación
await requireSession();
await loadSideNav();

console.log('✅ Session y SideNav cargados');

/* ============================================
   CONFIGURACIÓN DEL MAPA
   ============================================ */

// Crear mapa centrado en España
const map = L.map('map', {
    center: [40.4168, -3.7038], // Madrid
    zoom: 6,
    minZoom: 5,
    maxZoom: 18,
    zoomControl: true,
    attributionControl: true
});

console.log('✅ Mapa creado');

// Límites del mundo
const worldBounds = L.latLngBounds(
    L.latLng(-85, -180),
    L.latLng(85, 180)
);
map.setMaxBounds(worldBounds);
map.on('drag', function() {
    map.panInsideBounds(worldBounds, { animate: false });
});

/* ============================================
   CAPAS DEL MAPA
   ============================================ */

// CAPA BASE: Mapa oscuro suave
const darkBase = L.tileLayer(
    'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    {
        attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a> © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="http://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 20,
        noWrap: true
    }
);

// CAPA ALTERNATIVA: Vista Satélite
const satelliteView = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        attribution: 'Esri, Maxar, Earthstar Geographics',
        maxZoom: 18,
        noWrap: true
    }
);

// Añadir capa base por defecto
darkBase.addTo(map);

console.log('✅ Tiles añadidos');

// Control de capas
const baseMaps = {
    "Mapa Oscuro": darkBase,
    "Vista Satélite": satelliteView
};

L.control.layers(baseMaps, null, {
    position: 'topright',
    collapsed: true
}).addTo(map);

/* ============================================
   UBICACIONES ASTRONÓMICAS EN ESPAÑA
   ============================================ */

// Icono personalizado para ubicaciones
const starIcon = L.divIcon({
    className: 'custom-star-icon',
    html: `
        <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #7aa2ff 0%, #b07cff 100%);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(122, 162, 255, 0.5);
            font-size: 20px;
            backdrop-filter: blur(8px);
        ">⭐</div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

// Lista de ubicaciones
const locations = [
    {
        name: "Observatorio del Teide",
        coords: [28.3009, -16.5098],
        type: "Observatorio",
        description: "Uno de los observatorios más importantes del mundo. Cielos excepcionalmente limpios.",
        features: ["Certificación Starlight", "Baja humedad", "Visitas guiadas"]
    },
    {
        name: "Observatorio del Roque de los Muchachos",
        coords: [28.7569, -17.8850],
        type: "Observatorio",
        description: "Instalación astronómica de referencia mundial en La Palma.",
        features: ["Cielo protegido", "Instalaciones profesionales", "Altitud óptima"]
    },
    {
        name: "Parque Nacional de Monfragüe",
        coords: [39.8578, -6.0483],
        type: "Reserva Starlight",
        description: "Reserva y Destino Turístico Starlight en Extremadura.",
        features: ["Certificación Starlight", "Actividades nocturnas", "Fauna nocturna"]
    },
    {
        name: "Sierra de Gredos",
        coords: [40.2983, -5.2858],
        type: "Parque Natural",
        description: "Excelentes condiciones para observación en el centro peninsular.",
        features: ["Baja contaminación lumínica", "Fácil acceso", "Rutas nocturnas"]
    },
    {
        name: "Montsec - Centre d'Observació de l'Univers",
        coords: [42.0472, 0.7311],
        type: "Observatorio",
        description: "Reserva Starlight en Lleida con planetario y observatorio público.",
        features: ["Planetario", "Actividades educativas", "Cielo protegido"]
    },
    {
        name: "Parque Nacional de Cabañeros",
        coords: [39.3711, -4.4586],
        type: "Reserva Starlight",
        description: "Reserva Starlight en Castilla-La Mancha.",
        features: ["Certificación Starlight", "Naturaleza virgen", "Observaciones guiadas"]
    },
    {
        name: "Sierra de Albarracín",
        coords: [40.4081, -1.4397],
        type: "Reserva Starlight",
        description: "Destino Turístico Starlight en Teruel.",
        features: ["Pueblo medieval", "Cielos oscuros", "Turismo astronómico"]
    },
    {
        name: "Parque Natural de la Sierra de Grazalema",
        coords: [36.7594, -5.3983],
        type: "Parque Natural",
        description: "Excelentes condiciones en Andalucía con baja contaminación.",
        features: ["Reserva de la Biosfera", "Cielos limpios", "Clima mediterráneo"]
    },
    {
        name: "Alto Tajo",
        coords: [40.7083, -2.0486],
        type: "Reserva Starlight",
        description: "Parque Natural en Guadalajara con certificación Starlight.",
        features: ["Certificación Starlight", "Paisajes espectaculares", "Observaciones públicas"]
    },
    {
        name: "Picos de Europa",
        coords: [43.1956, -4.8514],
        type: "Parque Natural",
        description: "Zona de baja contaminación lumínica en el norte de España.",
        features: ["Alta montaña", "Cielos despejados", "Parque Nacional"]
    }
];

// Añadir marcadores al mapa
locations.forEach(location => {
    const popupContent = `
        <div class="popup-noctis">
            <h3>${location.name}</h3>
            <span class="popup-type">${location.type}</span>
            <p>${location.description}</p>
            <div class="popup-features">
                ${location.features.map(feature => `
                    <div class="popup-feature">${feature}</div>
                `).join('')}
            </div>
        </div>
    `;

    L.marker(location.coords, { icon: starIcon })
        .addTo(map)
        .bindPopup(popupContent, {
            maxWidth: 300,
            className: 'noctis-popup'
        });
});

console.log('✅ Ubicaciones añadidas al mapa');

/* ============================================
   MODAL DE INFORMACIÓN
   ============================================ */

const infoBtn = document.getElementById('infoBtn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeModal');

if (infoBtn && modal && closeBtn) {
    // Abrir modal
    infoBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    // Cerrar modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    console.log('✅ Modal configurado');
}

/* ============================================
   AJUSTES FINALES
   ============================================ */

setTimeout(() => {
    map.invalidateSize();
    console.log('✅ Mapa redimensionado y listo');
}, 200);