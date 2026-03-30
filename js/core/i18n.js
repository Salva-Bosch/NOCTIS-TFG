/* MOTOR DE INTERNACIONALIZACIÓN (i18n) */

const LANG_KEY = 'noctis_lang';

/**
 * Devuelve el idioma activo (localStorage o 'es' por defecto).
 */
export function getLang() {
    return localStorage.getItem(LANG_KEY) || 'es';
}

/**
 * Guarda el idioma en localStorage.
 * @param {'es'|'en'} lang
 */
export function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
}

/**
 * Carga el módulo de traducciones para el idioma activo.
 */
async function loadTranslations(lang) {
    try {
        const mod = await import(`/js/core/translations/${lang}.js`);
        return mod.default;
    } catch {
        const fallback = await import('/js/core/translations/es.js');
        return fallback.default;
    }
}

/**
 * Aplica traducciones al DOM:
 *  - data-i18n="key"           → textContent
 *  - data-i18n-html="key"      → innerHTML
 *  - data-i18n-placeholder="key" → placeholder
 *  - data-i18n-title="key"     → title attribute
 *  - data-i18n-aria="key"      → aria-label
 */
function applyTranslations(t) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (t[key] !== undefined) el.innerHTML = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) el.setAttribute('placeholder', t[key]);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (t[key] !== undefined) el.setAttribute('title', t[key]);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
    });

    // Actualizar lang del html
    document.documentElement.setAttribute('lang', getLang());
}

/**
 * Inicializa i18n: carga traducciones y aplica al DOM.
 * Llamar en cada página después de que el DOM esté listo.
 */
export async function initI18n() {
    const lang = getLang();
    const t = await loadTranslations(lang);
    applyTranslations(t);
    return t;
}

/**
 * Devuelve las traducciones cargadas sin aplicarlas al DOM.
 * Útil para JS que necesita traducir strings dinámicos.
 */
export async function getTranslations() {
    const lang = getLang();
    return await loadTranslations(lang);
}
