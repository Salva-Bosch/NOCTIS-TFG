/* LÓGICA DE LA PÁGINA DE FAVORITOS */

import { auth, db } from "../core/firebase.js";
import {
    collection,
    query,
    onSnapshot,
    doc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const favoritesList = document.getElementById("favoritesList");
const searchInput = document.getElementById("searchFavorites");
const searchWrapper = document.querySelector(".search-wrapper");

// Activate search input when clicking anywhere on wrapper
if (searchWrapper && searchInput) {
    searchWrapper.addEventListener("click", () => {
        searchInput.focus();
    });
}

let allFavorites = [];

// Emojis por tipo (como en el buscador)
const TYPE_EMOJIS = {
    planet: "🪐",
    moon: "🌙",
    star: "☀️",
    dwarf: "☄️",
    location: "📍"
};

// Mapeo de IDs a imágenes de assets
const ASTRO_IMAGES = {
    sun: "../../../assets/illustrations/planets/sol.webp",
    mercury: "../../../assets/illustrations/planets/rocky/mercurio.webp",
    venus: "../../../assets/illustrations/planets/rocky/venus.webp",
    earth: "../../../assets/illustrations/planets/rocky/tierra.webp",
    mars: "../../../assets/illustrations/planets/rocky/marte.webp",
    jupiter: "../../../assets/illustrations/planets/gas/jupiter.webp",
    saturn: "../../../assets/illustrations/planets/gas/saturno.webp",
    uranus: "../../../assets/illustrations/planets/gas/urano.webp",
    neptune: "../../../assets/illustrations/planets/gas/neptuno.webp",
    moon: "../../../assets/illustrations/landing/luna.webp", // Ajustar si hay una mejor
    pluto: "../../../assets/illustrations/planets/pluton.webp",
    // Para lunas se podría usar un icono genérico si no hay ilustración específica
};

async function init() {
    auth.onAuthStateChanged(async (user) => {
        if (!user) return;

        const { orderBy } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        const q = query(
            collection(db, "users", user.uid, "favorites"),
            orderBy("timestamp", "desc")
        );

        onSnapshot(q, (snapshot) => {
            allFavorites = [];
            snapshot.forEach(doc => {
                allFavorites.push({ id_db: doc.id, ...doc.data() });
            });
            renderFavorites(allFavorites);
        });
    });
}

function renderFavorites(favorites) {
    if (favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="empty-state">
                <p>Aún no tienes favoritos seleccionados.</p>
            </div>
        `;
        return;
    }

    favoritesList.innerHTML = "";
    favorites.forEach(fav => {
        const isLocation = fav.type === 'location';
        const typeEmoji = isLocation ? (TYPE_EMOJIS.location) : (TYPE_EMOJIS[fav.type] || "✨");
        const imgUrl = isLocation ? null : ASTRO_IMAGES[fav.id];

        const item = document.createElement("div");
        item.className = "favorite-item";

        // Si no hay imagen, usamos el emoji del tipo en grande
        const thumbContent = imgUrl
            ? `<img src="${imgUrl}" alt="${fav.name}">`
            : `<span style="font-size: 32px;">${typeEmoji}</span>`;

        // Determinar subtítulo y tipo a mostrar
        let subTitle = "";
        let additionalInfo = "";

        if (isLocation) {
            subTitle = fav.subType || "Ubicación";

            // Add location-specific info: region and quality
            const region = fav.region || "Región desconocida";
            const quality = fav.quality || "Calidad desconocida";
            const bortleColor = fav.bortleColor || "#8b9cff";
            const bortle = fav.bortle || "?";

            additionalInfo = `
                <div class="location-details">
                    <div class="location-region">${region}</div>
                    <div class="location-quality">
                        <span class="bortle-dot" style="background: ${bortleColor}; box-shadow: 0 0 8px ${bortleColor}40;"></span>
                        <span class="quality-text">${quality}</span>
                        <span class="bortle-label">Bortle ${bortle}</span>
                    </div>
                </div>
            `;
        } else {
            subTitle = fav.type === 'star' ? 'Estrella' : (fav.type === 'moon' ? 'Luna' : 'Planeta');
        }

        item.innerHTML = `
            <div class="favorite-thumb">
                ${thumbContent}
            </div>
            <div class="favorite-info">
                <div class="favorite-type">${typeEmoji} ${subTitle}</div>
                <div class="favorite-name">${fav.name}</div>
                ${additionalInfo}
            </div>
            <div class="favorite-actions">
                <button class="btn-heart-delete" data-id="${fav.id_db}" aria-label="Eliminar de favoritos">
                    <img src="../../../assets/icons/user/favourite_red.svg" alt="Eliminar">
                </button>
            </div>
        `;

        // Navegar al sistema solar o al mapa
        item.addEventListener("click", (e) => {
            if (e.target.closest(".btn-heart-delete")) return;

            if (isLocation) {
                // fav.locationId es el ID numérico (ej: 1, 2)
                window.location.href = `../map/mapa-ubicaciones/mapa-ubicaciones.html?focus=${fav.locationId}`;
            } else {
                window.location.href = `../solar-system/sistema_solar.html?focus=${fav.id}`;
            }
        });

        const btnRemove = item.querySelector(".btn-heart-delete");
        btnRemove.addEventListener("click", async (e) => {
            e.stopPropagation();
            const user = auth.currentUser;
            if (user) {
                await deleteDoc(doc(db, "users", user.uid, "favorites", fav.id_db));
            }
        });

        favoritesList.appendChild(item);
    });
}

// Filtro de búsqueda
searchInput.addEventListener("input", (e) => {
    const text = e.target.value.toLowerCase();
    const filtered = allFavorites.filter(fav =>
        fav.name.toLowerCase().includes(text) ||
        fav.type.toLowerCase().includes(text)
    );
    renderFavorites(filtered);
});

init();
