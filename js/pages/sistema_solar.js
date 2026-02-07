/* LÓGICA DE LA BARRA DE BÚSQUEDA DE ASTROS */

export function initSearchBar(astros, onFocusCallback) {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const searchContainer = document.querySelector(".search-bar-container");

    if (!searchInput || !searchResults) {
        console.warn("Search bar elements not found in DOM");
        return;
    }

    // Indexar astros para búsqueda rápida
    // Mapeamos a un formato simple: { id, name, type (planeta/luna), originalObject }
    const searchableAstros = astros.map(astro => {
        let name = astro.id;
        // Intentar obtener nombre legible del label si existe, si no, capitalizar ID
        if (astro.label && astro.label.userData && astro.label.userData.name) {
            name = astro.label.userData.name;
        } else {
            // Fallback: usar el texto del canvas (si fuera accesible) o el ID traducido
            // Como no tenemos acceso fácil al texto del sprite, usaremos una lógica simple basada en el ID
            // Idealmente pasaríamos el nombre traducido en el objeto astro desde sistema_solar.js
            name = astro.displayName || (astro.id.charAt(0).toUpperCase() + astro.id.slice(1));
        }

        return {
            id: astro.id,
            name: name,
            type: astro.isMoon ? "Luna" : "Planeta", // Simplificación
            data: astro
        };
    });

    // Evento Input
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();

        if (query.length === 0) {
            hideResults();
            return;
        }

        const matches = searchableAstros.filter(item =>
            item.name.toLowerCase().includes(query)
        );

        renderResults(matches);
    });

    // Evento Focus (mostrar resultados si hay texto)
    searchInput.addEventListener("focus", () => {
        if (searchInput.value.trim().length > 0) {
            searchResults.classList.add("is-visible");
        }
        searchContainer.classList.add("is-active");
    });

    // Evento Blur tardío (para permitir click en resultados)
    searchInput.addEventListener("blur", () => {
        setTimeout(() => {
            hideResults();
            searchContainer.classList.remove("is-active");
        }, 200);
    });

    function renderResults(matches) {
        searchResults.innerHTML = "";

        if (matches.length === 0) {
            const noRes = document.createElement("div");
            noRes.className = "search-result-item no-results";
            noRes.textContent = "No se encontraron astros";
            searchResults.appendChild(noRes);
            showResults();
            return;
        }

        matches.forEach(match => {
            const item = document.createElement("div");
            item.className = "search-result-item";

            // Icono según tipo (puedes mejorar esto con iconos reales)
            const icon = match.type === "Luna" ? "🌑" : "🪐";

            item.innerHTML = `
                <span class="search-item-icon">${icon}</span>
                <div class="search-item-info">
                    <span class="search-item-name">${match.name}</span>
                    <span class="search-item-type">${match.type}</span>
                </div>
            `;

            item.addEventListener("click", () => {
                searchInput.value = match.name;
                onFocusCallback(match.data); // Llamar al callback de foco
                hideResults();
            });

            searchResults.appendChild(item);
        });

        showResults();
    }

    function showResults() {
        searchResults.classList.add("is-visible");
    }

    function hideResults() {
        searchResults.classList.remove("is-visible");
    }
}
