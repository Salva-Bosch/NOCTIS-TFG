// ==============================
// MENU LATERAL · ICONO ACTIVO
// ==============================

// Seleccionamos todos los iconos del menú lateral
const sideItems = document.querySelectorAll(".side-item");

// Ruta actual de la página
const currentPath = window.location.pathname;

// Recorremos los iconos
sideItems.forEach(item => {
    const href = item.getAttribute("href");

    // Si la URL actual contiene el href del icono
    if (currentPath.includes(href)) {
        item.classList.add("active");
    }
});
