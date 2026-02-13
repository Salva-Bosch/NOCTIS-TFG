/* CONVERSOR DE UNIDADES (Métrico / Imperial) */
import { getSettings } from "./settingsManager.js";

const KM_TO_MILES = 0.621371;

/**
 * Convierte una distancia en KM a Millas si el ajuste es imperial.
 * @param {number} km - Valor en kilómetros.
 * @returns {string} - Valor formateado con su unidad.
 */
export function formatDistance(km) {
    const settings = getSettings();
    const isImperial = settings.distance === "mi";

    if (isImperial) {
        const miles = km * KM_TO_MILES;
        return `${formatNumber(miles)} mi`;
    }
    return `${formatNumber(km)} km`;
}

/**
 * Convierte una temperatura en Celsius a Fahrenheit si el ajuste es imperial.
 * @param {number} celsius - Valor en Celsius.
 * @returns {string} - Valor formateado con su unidad.
 */
export function formatTemp(celsius) {
    const settings = getSettings();
    const isImperial = settings.temp === "f";

    if (isImperial) {
        const fahrenheit = (celsius * 9 / 5) + 32;
        return `${Math.round(fahrenheit)} °F`;
    }
    return `${Math.round(celsius)} °C`;
}

/**
 * Helper para formatear números con separador de miles.
 */
function formatNumber(num) {
    return num.toLocaleString('es-ES', { maximumFractionDigits: 1 });
}

/**
 * Escanea el DOM buscando elementos con el atributo data-unit="km" o data-unit="c"
 * y actualiza su contenido basándose en el valor de data-value.
 */
export function updatePageUnits() {
    const elements = document.querySelectorAll('[data-unit]');
    elements.forEach(el => {
        const value = parseFloat(el.getAttribute('data-value'));
        const unit = el.getAttribute('data-unit');

        if (unit === 'km') {
            el.textContent = formatDistance(value);
        } else if (unit === 'c') {
            el.textContent = formatTemp(value);
        }
    });
}
