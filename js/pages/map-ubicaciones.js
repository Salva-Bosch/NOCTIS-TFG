import { loadSideNav } from "../core/loadSideNav.js";
import { requireSession } from "../guards/sessionGuard.js";

await requireSession();
await loadSideNav();

/* =========================
   MAPA
========================= */

// Crear mapa
const map = L.map("map").setView([20, 0], 2);

// Capa oscura (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Icono personalizado
const starIcon = L.icon({
    iconUrl: "../../../assets/icons/nav/star.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
});

/* =========================
   UBICACIONES
========================= */

const locations = [
    {
        name: "Desierto de Atacama",
        coords: [-23.021, -67.753],
        description: "Uno de los mejores cielos del mundo para la observación astronómica.",
    },
    {
        name: "Mauna Kea",
        coords: [19.8206, -155.4681],
        description: "Observatorios de referencia mundial en Hawái.",
    },
    {
        name: "Islas Canarias",
        coords: [28.2916, -16.6291],
        description: "Excelente calidad del cielo y protección lumínica.",
    },
];

/* =========================
   PINES
========================= */

locations.forEach((location) => {
    const popupContent = `
        <div class="popup">
            <div class="popup-title">${location.name}</div>
            <p>${location.description}</p>
            <button class="popup-btn" data-name="${location.name}">
                Añadir a favoritos
            </button>
        </div>
    `;

    L.marker(location.coords, { icon: starIcon })
        .addTo(map)
        .bindPopup(popupContent);
});

/* =========================
   FAVORITOS (PREPARADO)
========================= */

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("popup-btn")) {
        const placeName = e.target.dataset.name;

        let favorites = JSON.parse(localStorage.getItem("noctisFavorites")) || [];

        if (!favorites.includes(placeName)) {
            favorites.push(placeName);
            localStorage.setItem("noctisFavorites", JSON.stringify(favorites));
            alert("Añadido a favoritos");
        }
    }
});
