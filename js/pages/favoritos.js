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

let allFavorites = [];

// Emojis por tipo (como en el buscador)
const TYPE_EMOJIS = {
    planet: "🪐",
    moon: "🌙",
    star: "☀️",
    dwarf: "☄️" // U otro para planetas enanos
};

// Mapeo de IDs a imágenes de assets
const ASTRO_IMAGES = {
    sun: "../../../assets/illustrations/planets/sol.png",
    mercury: "../../../assets/illustrations/planets/rocky/mercurio.png",
    venus: "../../../assets/illustrations/planets/rocky/venus.png",
    earth: "../../../assets/illustrations/planets/rocky/tierra.png",
    mars: "../../../assets/illustrations/planets/rocky/marte.png",
    jupiter: "../../../assets/illustrations/planets/gas/jupiter.png",
    saturn: "../../../assets/illustrations/planets/gas/saturno.png",
    uranus: "../../../assets/illustrations/planets/gas/urano.png",
    neptune: "../../../assets/illustrations/planets/gas/neptuno.png",
    moon: "../../../assets/illustrations/landing/luna.png", // Ajustar si hay una mejor
    pluto: "../../../assets/illustrations/planets/pluton.png",
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
        const typeEmoji = TYPE_EMOJIS[fav.type] || "✨";
        const imgUrl = ASTRO_IMAGES[fav.id];

        const item = document.createElement("div");
        item.className = "favorite-item";

        // Si no hay imagen, usamos el emoji del tipo en grande
        const thumbContent = imgUrl
            ? `<img src="${imgUrl}" alt="${fav.name}">`
            : `<span style="font-size: 32px;">${typeEmoji}</span>`;

        item.innerHTML = `
            <div class="favorite-thumb">
                ${thumbContent}
            </div>
            <div class="favorite-info">
                <div class="favorite-type">${typeEmoji} ${fav.type === 'star' ? 'Estrella' : (fav.type === 'moon' ? 'Luna' : 'Planeta')}</div>
                <div class="favorite-name">${fav.name}</div>
            </div>
            <div class="favorite-actions">
                <button class="btn-remove-favorite" data-id="${fav.id_db}">
                    <img src="../../../assets/icons/nav/favourites.svg" alt="Quitar">
                </button>
            </div>
        `;

        // Navegar al sistema solar y centrar el planeta (opcional, por ahora solo UI)
        item.addEventListener("click", (e) => {
            if (e.target.closest(".btn-remove-favorite")) return;
            // Podríamos redirigir con un parámetro ?focus=mars
            window.location.href = `../solar-system/sistema_solar.html?focus=${fav.id}`;
        });

        const btnRemove = item.querySelector(".btn-remove-favorite");
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
