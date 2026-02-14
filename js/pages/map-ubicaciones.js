import { loadSideNav } from "../core/loadSideNav.js";
import { requireSession } from "../guards/sessionGuard.js";

// Firebase
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
    center: [30.0, 0.0], // Centro mundial
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
   DATOS DE UBICACIONES - 20 MEJORES DEL MUNDO
   ============================================ */

const locations = [
    // BORTLE 1 - EXCEPCIONAL
    {
        id: 1,
        name: "Observatorio del Teide",
        coords: [28.3009, -16.5098],
        region: "Tenerife, Islas Canarias, España",
        bortle: 1,
        type: "Observatorio",
        certification: "Reserva Starlight",
        description: "Uno de los mejores observatorios del mundo. Cielo excepcionalmente oscuro con más de 300 noches despejadas al año.",
        features: [
            "Cielo Clase 1 (Bortle)",
            "Baja humedad atmosférica",
            "Altitud: 2.390 metros",
            "Instalaciones profesionales",
            "Visitas guiadas disponibles"
        ],
        quality: "Excepcional"
    },
    {
        id: 2,
        name: "Observatorio del Roque de los Muchachos",
        coords: [28.7569, -17.8850],
        region: "La Palma, Islas Canarias, España",
        bortle: 1,
        type: "Observatorio",
        certification: "Reserva Starlight",
        description: "Instalación astronómica de referencia mundial. Ley de protección del cielo desde 1988.",
        features: [
            "Cielo Clase 1 (Bortle)",
            "Protección lumínica legal",
            "Altitud: 2.396 metros",
            "Seeing excepcional",
            "Telescopios de clase mundial"
        ],
        quality: "Excepcional"
    },
    {
        id: 3,
        name: "Observatorio Paranal",
        coords: [-24.6272, -70.4040],
        region: "Desierto de Atacama, Chile",
        bortle: 1,
        type: "Observatorio",
        certification: "ESO",
        description: "Hogar del Very Large Telescope (VLT). Uno de los cielos más oscuros y secos del planeta.",
        features: [
            "Cielo Clase 1 (Bortle)",
            "Humedad extremadamente baja",
            "Altitud: 2.635 metros",
            "Más de 330 noches despejadas/año",
            "Instalación ESO"
        ],
        quality: "Excepcional"
    },
    {
        id: 4,
        name: "Observatorio de Mauna Kea",
        coords: [19.8207, -155.4681],
        region: "Hawái, Estados Unidos",
        bortle: 1,
        type: "Observatorio",
        certification: null,
        description: "El observatorio más alto del mundo. Atmósfera excepcionalmente estable.",
        features: [
            "Cielo Clase 1 (Bortle)",
            "Altitud: 4.205 metros",
            "Atmósfera estable",
            "13 telescopios internacionales",
            "Seeing de 0.5 arcsec"
        ],
        quality: "Excepcional"
    },
    {
        id: 5,
        name: "NamibRand Nature Reserve",
        coords: [-25.0833, 16.2000],
        region: "Namibia",
        bortle: 1,
        type: "Reserva Dark Sky",
        certification: "International Dark Sky Reserve",
        description: "Primera Reserva Internacional de Cielo Oscuro de África. Cielos prístinos.",
        features: [
            "Cielo Clase 1 (Bortle)",
            "Certificación Dark Sky 2012",
            "Desierto del Namib",
            "Ausencia total de contaminación",
            "Safari nocturno disponible"
        ],
        quality: "Excepcional"
    },
    {
        id: 6,
        name: "Aoraki Mackenzie",
        coords: [-43.9859, 170.4714],
        region: "Isla Sur, Nueva Zelanda",
        bortle: 1,
        type: "Reserva Dark Sky",
        certification: "International Dark Sky Reserve",
        description: "Mayor Reserva de Cielo Oscuro certificada del mundo. Hemisferio sur excepcional.",
        features: [
            "Cielo Clase 1 (Bortle)",
            "Reserva más grande del mundo",
            "Hemisferio sur privilegiado",
            "Vía Láctea espectacular",
            "Turismo astronómico desarrollado"
        ],
        quality: "Excepcional"
    },

    // BORTLE 2 - EXCELENTE
    {
        id: 7,
        name: "Parque Nacional de Monfragüe",
        coords: [39.8578, -6.0483],
        region: "Cáceres, Extremadura, España",
        bortle: 2,
        type: "Reserva Starlight",
        certification: "Destino Turístico Starlight",
        description: "Primera Reserva Starlight de Extremadura. Cielos oscuros certificados.",
        features: [
            "Cielo Clase 2 (Bortle)",
            "Certificación Starlight 2016",
            "Turismo astronómico activo",
            "Observaciones guiadas",
            "Biodiversidad única"
        ],
        quality: "Excelente"
    },
    {
        id: 8,
        name: "Cherry Springs State Park",
        coords: [41.6628, -77.8236],
        region: "Pensilvania, Estados Unidos",
        bortle: 2,
        type: "Parque Dark Sky",
        certification: "International Dark Sky Park",
        description: "Uno de los mejores lugares de la costa este de EE.UU. para observación.",
        features: [
            "Cielo Clase 2 (Bortle)",
            "Gold-tier Dark Sky Park",
            "Campo de observación público",
            "Eventos astronómicos regulares",
            "Fácil acceso"
        ],
        quality: "Excelente"
    },
    {
        id: 9,
        name: "Parque Nacional Jasper",
        coords: [52.8734, -117.9543],
        region: "Alberta, Canadá",
        bortle: 2,
        type: "Reserva Dark Sky",
        certification: "Dark Sky Preserve",
        description: "Segunda reserva de cielo oscuro más grande del mundo. Montañas Rocosas.",
        features: [
            "Cielo Clase 2 (Bortle)",
            "11.000 km² protegidos",
            "Festival anual de astronomía",
            "Paisajes de montaña",
            "Auroras boreales"
        ],
        quality: "Excelente"
    },
    {
        id: 10,
        name: "Montsec - Centre d'Observació",
        coords: [42.0472, 0.7311],
        region: "Lleida, Cataluña, España",
        bortle: 2,
        type: "Observatorio Público",
        certification: "Reserva Starlight",
        description: "Primera Reserva Starlight de Cataluña con planetario.",
        features: [
            "Cielo Clase 2 (Bortle)",
            "Planetario digital",
            "Observatorio público",
            "Actividades educativas",
            "Certificación Starlight 2013"
        ],
        quality: "Excelente"
    },
    {
        id: 11,
        name: "Parque Nacional de Cabañeros",
        coords: [39.3711, -4.4586],
        region: "Ciudad Real, Castilla-La Mancha, España",
        bortle: 2,
        type: "Reserva Starlight",
        certification: "Reserva Starlight",
        description: "Uno de los mejores espacios naturales de España para observación.",
        features: [
            "Cielo Clase 2 (Bortle)",
            "Certificación Starlight",
            "Naturaleza virgen",
            "Observaciones guiadas",
            "Bajo impacto lumínico"
        ],
        quality: "Excelente"
    },
    {
        id: 12,
        name: "Westhavelland Nature Park",
        coords: [52.7000, 12.4500],
        region: "Brandeburgo, Alemania",
        bortle: 2,
        type: "Parque Dark Sky",
        certification: "International Dark Sky Reserve",
        description: "Primera Reserva de Cielo Oscuro de Alemania. Protección activa.",
        features: [
            "Cielo Clase 2 (Bortle)",
            "Reserva desde 2014",
            "Protección lumínica estricta",
            "Eventos astronómicos",
            "Fácil acceso desde Berlín"
        ],
        quality: "Excelente"
    },
    {
        id: 13,
        name: "Pic du Midi",
        coords: [42.9364, 0.1414],
        region: "Pirineos, Francia",
        bortle: 2,
        type: "Observatorio",
        certification: null,
        description: "Observatorio en alta montaña con hotel astronómico.",
        features: [
            "Cielo Clase 2 (Bortle)",
            "Altitud: 2.877 metros",
            "Hotel con cúpula",
            "Experiencia nocturna única",
            "Telescopios históricos"
        ],
        quality: "Excelente"
    },
    {
        id: 14,
        name: "Brecon Beacons",
        coords: [51.8833, -3.4333],
        region: "Gales, Reino Unido",
        bortle: 2,
        type: "Parque Dark Sky",
        certification: "International Dark Sky Reserve",
        description: "Primera Reserva de Cielo Oscuro de Gales.",
        features: [
            "Cielo Clase 2 (Bortle)",
            "Reserva desde 2013",
            "Eventos astronómicos anuales",
            "Paisajes de montaña",
            "Red de observatorios públicos"
        ],
        quality: "Excelente"
    },

    // BORTLE 3 - MUY BUENO
    {
        id: 15,
        name: "Sierra de Gredos",
        coords: [40.2983, -5.2858],
        region: "Ávila, Castilla y León, España",
        bortle: 3,
        type: "Parque Natural",
        certification: null,
        description: "Excelentes condiciones en el centro peninsular. Acceso fácil desde Madrid.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Baja contaminación lumínica",
            "Altitud media: 1.500 metros",
            "Acceso relativamente fácil",
            "Rutas de senderismo nocturno"
        ],
        quality: "Muy Bueno"
    },
    {
        id: 16,
        name: "Parque Nacional de los Glaciares",
        coords: [48.7596, -113.7870],
        region: "Montana, Estados Unidos",
        bortle: 3,
        type: "Parque Nacional",
        certification: null,
        description: "Parque de montaña con excelentes condiciones para observación.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Parque Nacional",
            "Montañas Rocosas",
            "Baja densidad poblacional",
            "Vida silvestre nocturna"
        ],
        quality: "Muy Bueno"
    },
    {
        id: 17,
        name: "Parque Nacional Sierra de Grazalema",
        coords: [36.7594, -5.3983],
        region: "Cádiz, Andalucía, España",
        bortle: 3,
        type: "Parque Natural",
        certification: "Reserva de la Biosfera",
        description: "Excelentes condiciones en Andalucía con cielos oscuros.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Reserva de la Biosfera",
            "Clima mediterráneo",
            "Baja contaminación lumínica",
            "Observatorios amateur activos"
        ],
        quality: "Muy Bueno"
    },
    {
        id: 18,
        name: "Parque Nacional de Yellowstone",
        coords: [44.4280, -110.5885],
        region: "Wyoming, Estados Unidos",
        bortle: 3,
        type: "Parque Nacional",
        certification: null,
        description: "Primer parque nacional del mundo con cielos relativamente oscuros.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Parque Nacional histórico",
            "Geotermia nocturna",
            "Alta altitud",
            "Programas ranger-led"
        ],
        quality: "Muy Bueno"
    },
    {
        id: 19,
        name: "Picos de Europa",
        coords: [43.1956, -4.8514],
        region: "Cantabria/Asturias/León, España",
        bortle: 3,
        type: "Parque Nacional",
        certification: "Reserva de la Biosfera",
        description: "Alta montaña con cielos oscuros en el norte de España.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Parque Nacional",
            "Alta montaña",
            "Clima atlántico",
            "Mirador de estrellas"
        ],
        quality: "Muy Bueno"
    },
    {
        id: 20,
        name: "Parque Nacional de Snowdonia",
        coords: [53.0686, -3.9287],
        region: "Gales, Reino Unido",
        bortle: 3,
        type: "Parque Nacional",
        certification: null,
        description: "Montañas galesas con buenas condiciones para observación.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Parque Nacional",
            "Montañas de Gales",
            "Red de observatorios",
            "Eventos astronómicos"
        ],
        quality: "Muy Bueno"
    }
    , {
        id: 21,
        name: "Sierra de Guadarrama",
        coords: [40.7831, -4.0139],
        region: "Madrid/Segovia, España",
        bortle: 4,
        type: "Parque Nacional",
        certification: null,
        description: "Muy accesible desde Madrid. Popular entre astrónomos amateur por su proximidad.",
        features: [
            "Cielo Clase 4 (Bortle)",
            "1 hora desde Madrid",
            "Puerto de Navacerrada popular",
            "Grupos de observación activos",
            "Bueno para iniciación"
        ],
        quality: "Bueno"
    },
    {
        id: 22,
        name: "Montseny",
        coords: [41.7667, 2.4500],
        region: "Barcelona/Girona, España",
        bortle: 4,
        type: "Parque Natural",
        certification: "Reserva de la Biosfera",
        description: "Accesible desde Barcelona. Zona protegida con cielos aceptables.",
        features: [
            "Cielo Clase 4 (Bortle)",
            "1 hora desde Barcelona",
            "Reserva de la Biosfera",
            "Refugios de montaña",
            "Observaciones organizadas"
        ],
        quality: "Bueno"
    },
    {
        id: 23,
        name: "Parque Natural de las Bardenas Reales",
        coords: [42.1333, -1.5167],
        region: "Navarra, España",
        bortle: 3,
        type: "Parque Natural",
        certification: "Reserva de la Biosfera",
        description: "Desierto semiárido con cielos oscuros. Paisaje único y accesible.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Paisaje desértico",
            "Poca población cercana",
            "Acceso en coche",
            "Observaciones desde parking"
        ],
        quality: "Muy Bueno"
    },
    {
        id: 24,
        name: "Els Ports",
        coords: [40.7000, 0.2667],
        region: "Tarragona/Castellón, España",
        bortle: 3,
        type: "Parque Natural",
        certification: null,
        description: "Zona montañosa entre Cataluña y Comunidad Valenciana con buenos cielos.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Baja densidad poblacional",
            "Miradores naturales",
            "Acceso por carretera",
            "Pueblo astronómico La Sénia"
        ],
        quality: "Muy Bueno"
    },
    {
        id: 25,
        name: "Sierra de la Demanda",
        coords: [42.2167, -3.1167],
        region: "Burgos/La Rioja, España",
        bortle: 3,
        type: "Zona Rural",
        certification: null,
        description: "Zona tranquila con cielos oscuros entre Burgos y Logroño.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Pueblos con encanto",
            "Poco turismo nocturno",
            "Carreteras accesibles",
            "Ideal fines de semana"
        ],
        quality: "Muy Bueno"
    },
    {
        id: 26,
        name: "Parque Natural de Cazorla",
        coords: [37.9167, -2.9167],
        region: "Jaén, Andalucía, España",
        bortle: 3,
        type: "Parque Natural",
        certification: "Reserva de la Biosfera",
        description: "Mayor espacio protegido de España. Buenos cielos en zona rural.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Mayor parque natural de España",
            "Zonas de acampada",
            "Miradores panorámicos",
            "Turismo astronómico en desarrollo"
        ],
        quality: "Muy Bueno"
    },
    {
        id: 27,
        name: "Sierra de Aracena",
        coords: [37.8833, -6.5500],
        region: "Huelva, Andalucía, España",
        bortle: 4,
        type: "Parque Natural",
        certification: null,
        description: "Accesible desde Sevilla. Cielos razonables para observación amateur.",
        features: [
            "Cielo Clase 4 (Bortle)",
            "1.5 horas desde Sevilla",
            "Pueblos con gastronomía",
            "Rutas de senderismo",
            "Grupos locales de astronomía"
        ],
        quality: "Bueno"
    },
    {
        id: 28,
        name: "Parque Natural del Maestrazgo",
        coords: [40.5833, -0.4167],
        region: "Teruel, Aragón, España",
        bortle: 2,
        type: "Parque Natural",
        certification: null,
        description: "Zona despoblada con excelentes cielos en el interior de Aragón.",
        features: [
            "Cielo Clase 2 (Bortle)",
            "Muy baja densidad de población",
            "Pueblos medievales",
            "Acceso por carretera",
            "Ideal para escapadas"
        ],
        quality: "Excelente"
    },
    {
        id: 29,
        name: "Laguna de Gallocanta",
        coords: [40.9833, -1.5000],
        region: "Zaragoza/Teruel, España",
        bortle: 3,
        type: "Reserva Natural",
        certification: null,
        description: "Mayor laguna natural de España. Horizonte despejado ideal para observación.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Horizonte completamente despejado",
            "Observatorios amateur",
            "Aves migratorias",
            "Parking habilitado"
        ],
        quality: "Muy Bueno"
    },
    {
        id: 30,
        name: "Parque Natural de Somiedo",
        coords: [43.0833, -6.2500],
        region: "Asturias, España",
        bortle: 3,
        type: "Parque Natural",
        certification: "Reserva de la Biosfera",
        description: "Cielos oscuros en Asturias. Posibilidad de ver osos pardos.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Reserva de la Biosfera",
            "Fauna salvaje",
            "Valles glaciares",
            "Rutas de montaña"
        ],
        quality: "Muy Bueno"
    },

    // FRANCIA - Ubicaciones accesibles
    {
        id: 31,
        name: "Parque Nacional de los Pirineos",
        coords: [42.8667, -0.1333],
        region: "Hautes-Pyrénées, Francia",
        bortle: 2,
        type: "Parque Nacional",
        certification: null,
        description: "Zona de alta montaña con cielos excelentes en el lado francés de los Pirineos.",
        features: [
            "Cielo Clase 2 (Bortle)",
            "Alta montaña",
            "Observatorios amateur",
            "Refugios de montaña",
            "Frontera con España"
        ],
        quality: "Excelente"
    },
    {
        id: 32,
        name: "Parque Natural Regional de Causses du Quercy",
        coords: [44.6000, 1.6667],
        region: "Lot, Francia",
        bortle: 2,
        type: "Parque Natural",
        certification: "Réserve Internationale de Ciel Étoilé",
        description: "Primera Reserva de Cielo Estrellado de Francia. Accesible desde Toulouse.",
        features: [
            "Cielo Clase 2 (Bortle)",
            "Certificación internacional 2013",
            "Turismo astronómico",
            "Festivales de estrellas",
            "Alojamientos especializados"
        ],
        quality: "Excelente"
    },
    {
        id: 33,
        name: "Cévennes",
        coords: [44.3667, 3.6167],
        region: "Languedoc, Francia",
        bortle: 2,
        type: "Parque Nacional",
        certification: "Réserve Internationale de Ciel Étoilé",
        description: "Reserva de Cielo Oscuro con programa educativo extenso.",
        features: [
            "Cielo Clase 2 (Bortle)",
            "Parque Nacional UNESCO",
            "Programa educativo",
            "Albergues astronómicos",
            "Eventos regulares"
        ],
        quality: "Excelente"
    },
    {
        id: 34,
        name: "Alpes del Sur",
        coords: [44.2833, 6.6333],
        region: "Alpes-de-Haute-Provence, Francia",
        bortle: 3,
        type: "Zona de Montaña",
        certification: null,
        description: "Alta montaña accesible con buenos cielos. Popular entre astrónomos franceses.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Altitud elevada",
            "Observatorio de Haute-Provence cerca",
            "Estaciones de esquí (fuera temporada)",
            "Clima seco mediterráneo"
        ],
        quality: "Muy Bueno"
    },
    {
        id: 35,
        name: "Millevaches en Limousin",
        coords: [45.6500, 1.9667],
        region: "Corrèze, Francia",
        bortle: 3,
        type: "Parque Natural Regional",
        certification: null,
        description: "Meseta rural con poca población. Buenos cielos en el centro de Francia.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Región poco poblada",
            "Lagos y bosques",
            "Turismo rural",
            "Grupos de astronomía locales"
        ],
        quality: "Muy Bueno"
    },

    // ANDORRA
    {
        id: 36,
        name: "Estany de Juclà",
        coords: [42.5667, 1.5333],
        region: "Andorra",
        bortle: 3,
        type: "Zona de Montaña",
        certification: null,
        description: "Lago de alta montaña en Andorra. Acceso por sendero.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Altitud: 2.310 metros",
            "Lagos de montaña",
            "Rutas de trekking",
            "Ideal verano"
        ],
        quality: "Muy Bueno"
    },
    {
        id: 37,
        name: "Vall de Sorteny",
        coords: [42.5833, 1.5167],
        region: "Andorra",
        bortle: 3,
        type: "Parque Natural",
        certification: null,
        description: "Valle protegido en Andorra con buenos cielos y fácil acceso.",
        features: [
            "Cielo Clase 3 (Bortle)",
            "Parque Natural",
            "Centro de interpretación",
            "Parking habilitado",
            "Rutas señalizadas"
        ],
        quality: "Muy Bueno"
    }
];

/* ============================================
   LÓGICA DE COLORES - ACTUALIZADA
   ============================================ */

function getBortleColor(bortle) {
    const colors = {
        1: '#b07cff',  // Excepcional – morado brillante
        2: '#7aa2ff', // Excelente – azul claro
        3: '#4dd4ac',  // Muy bueno – verde-cyan
        4: '#6fdc8c',  // Bueno – verde suave
        5: '#a8e063',  // Moderado – verde amarillento
        6: '#ffd166',  // Suburbano brillante – amarillo
        7: '#f4a261',  // Transición urbana – naranja
        8: '#e76f51',  // Ciudad – naranja rojizo
        9: '#ffffff'   // Centro urbano – blanco/gris muy claro
    };
    return colors[bortle] || '#8b9cff';
}

function createMarkerIcon(bortle) {
    const color = getBortleColor(bortle);

    // Mapeo de Bortle a nombre de archivo
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
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                filter: drop-shadow(0 3px 10px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 12px ${color}40);
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                <img src="/assets/icons/ui/ubicaciónes/${iconName}.svg" 
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

    marker.on('click', async function () {
        await openLocationModal(location);
    });
});

console.log(`${locations.length} ubicaciones añadidas`);

/* ============================================
   MODAL LATERAL
   ============================================ */

const panel = document.getElementById('locationPanel');
const panelContent = document.getElementById('panelContent');
const panelClose = document.getElementById('panelClose');

const heartOutline = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
const heartFilled = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;

async function openLocationModal(location) {
    const isFavorited = await isFavorite(location.id);
    const color = getBortleColor(location.bortle);

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

    const favBtn = panelContent.querySelector('.btn-favorite');
    favBtn.addEventListener('click', async function () {
        await toggleFavorite(location);
        await openLocationModal(location);
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
   SISTEMA DE FAVORITOS
   ============================================ */

async function isFavorite(locationId) {
    const user = auth.currentUser;
    if (!user) return false;

    const favId = `location_${locationId}`;
    try {
        const favRef = doc(db, "users", user.uid, "favorites", favId);
        const snap = await getDoc(favRef);
        return snap.exists();
    } catch (e) {
        console.error("Error en isFavorite:", e);
        return false;
    }
}

async function toggleFavorite(location) {
    const user = auth.currentUser;
    if (!user) {
        alert("Debes iniciar sesión para guardar favoritos");
        return;
    }

    const favId = `location_${location.id}`;
    const favRef = doc(db, "users", user.uid, "favorites", favId);

    try {
        const isFav = await isFavorite(location.id);
        if (isFav) {
            await deleteDoc(favRef);
            console.log(`Eliminado de favoritos: ${location.name}`);
        } else {
            await setDoc(favRef, {
                id: favId,
                locationId: location.id,
                name: location.name,
                type: "location",
                subType: location.type,
                timestamp: serverTimestamp()
            });
            console.log(`Añadido a favoritos: ${location.name}`);
        }
    } catch (error) {
        console.error("Error al gestionar favorito:", error);
    }
}

/* ============================================
   AJUSTES FINALES
   ============================================ */

setTimeout(() => {
    map.invalidateSize();
    console.log('Mapa listo con 20 ubicaciones mundiales');

    // --- DEEP LINKING: Check URL params for focus ---
    const urlParams = new URLSearchParams(window.location.search);
    const focusId = urlParams.get('focus');
    console.log('Deep linking check:', focusId);
    if (focusId) {
        const location = locations.find(l => l.id == focusId);
        if (location) {
            console.log('Focusing on location:', location.name);
            // Centrar mapa
            map.setView(location.coords, 10);
            // Abrir modal
            openLocationModal(location);
        }
    }
}, 200);