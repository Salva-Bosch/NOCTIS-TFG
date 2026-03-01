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
    const searchableAstros = astros.map(astro => {
        const name =
            astro.displayName ||
            (astro.label?.userData?.name) ||
            astro.id.charAt(0).toUpperCase() + astro.id.slice(1);

        return {
            id: astro.id,
            name,
            type: astro.type || (astro.isMoon ? "Luna" : "Planeta"),
            icon: astro.icon || (astro.isMoon ? "🌑" : "🪐"),
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
            const icon = match.icon;

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
