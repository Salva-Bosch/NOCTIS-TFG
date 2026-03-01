/* MOTOR DE ASTRONOMÍA POSICIONAL
   Conversiones de coordenadas ecuatoriales (RA/Dec) a horizontales (Alt/Az)
   y a cartesianas 3D para la esfera celeste. */

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;
const HOURS_TO_RAD = Math.PI / 12;  // 1h RA = 15° = π/12 rad

/**
 * Calcula el Día Juliano a partir de un Date.
 */
export function julianDay(date) {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth() + 1;
    const d = date.getUTCDate()
        + date.getUTCHours() / 24
        + date.getUTCMinutes() / 1440
        + date.getUTCSeconds() / 86400;

    let Y = y, M = m;
    if (M <= 2) { Y -= 1; M += 12; }

    const A = Math.floor(Y / 100);
    const B = 2 - A + Math.floor(A / 4);

    return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5;
}

/**
 * Tiempo Sidéreo en Greenwich (GMST) en horas.
 */
export function greenwichMeanSiderealTime(date) {
    const JD = julianDay(date);
    const T = (JD - 2451545.0) / 36525.0;

    // Expresión IAU para GMST en segundos
    let gmst = 280.46061837
        + 360.98564736629 * (JD - 2451545.0)
        + 0.000387933 * T * T
        - T * T * T / 38710000.0;

    // Normalizar a 0–360°
    gmst = ((gmst % 360) + 360) % 360;

    // Devolver en horas (0–24)
    return gmst / 15.0;
}

/**
 * Tiempo Sidéreo Local en horas.
 * @param {number} lonDeg - Longitud del observador en grados (positivo = este)
 * @param {Date} date
 */
export function localSiderealTime(lonDeg, date) {
    const gmst = greenwichMeanSiderealTime(date);
    let lst = gmst + lonDeg / 15.0;
    return ((lst % 24) + 24) % 24;  // Normalizar a 0–24h
}

/**
 * Convierte coordenadas ecuatoriales (RA/Dec) a horizontales (Alt/Az).
 * @param {number} raHours - Ascensión recta en horas
 * @param {number} decDeg  - Declinación en grados
 * @param {number} latDeg  - Latitud del observador en grados
 * @param {number} lonDeg  - Longitud del observador en grados (positivo = este)
 * @param {Date}   date    - Fecha y hora
 * @returns {{ alt: number, az: number }} - Altitud y azimut en grados
 */
export function equatorialToHorizontal(raHours, decDeg, latDeg, lonDeg, date) {
    const lst = localSiderealTime(lonDeg, date);

    // Ángulo horario en grados
    let ha = (lst - raHours) * 15.0;  // horas → grados
    ha = ((ha % 360) + 360) % 360;

    const haRad = ha * DEG;
    const decRad = decDeg * DEG;
    const latRad = latDeg * DEG;

    // Altitud
    const sinAlt = Math.sin(decRad) * Math.sin(latRad)
        + Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
    const alt = Math.asin(sinAlt) * RAD;

    // Azimut
    const cosAz = (Math.sin(decRad) - Math.sin(alt * DEG) * Math.sin(latRad))
        / (Math.cos(alt * DEG) * Math.cos(latRad));
    let az = Math.acos(Math.max(-1, Math.min(1, cosAz))) * RAD;

    if (Math.sin(haRad) > 0) az = 360 - az;

    return { alt, az };
}

/**
 * Convierte coordenadas ecuatoriales a cartesianas 3D en la esfera celeste.
 * El eje Y apunta al polo norte celeste, X/Z forman el plano ecuatorial.
 * @param {number} raHours - Ascensión recta en horas
 * @param {number} decDeg  - Declinación en grados
 * @param {number} radius  - Radio de la esfera
 */
export function equatorialToCartesian(raHours, decDeg, radius = 1000) {
    const raRad = raHours * HOURS_TO_RAD;
    const decRad = decDeg * DEG;

    const x = radius * Math.cos(decRad) * Math.cos(raRad);
    const y = radius * Math.sin(decRad);
    const z = -radius * Math.cos(decRad) * Math.sin(raRad);

    return { x, y, z };
}

/**
 * Convierte coordenadas horizontales (Alt/Az) a cartesianas 3D.
 * Norte = -Z, Este = +X, Cénit = +Y.
 * @param {number} altDeg  - Altitud en grados
 * @param {number} azDeg   - Azimut en grados (0=Norte, 90=Este)
 * @param {number} radius  - Radio de la esfera
 */
export function horizontalToCartesian(altDeg, azDeg, radius = 1000) {
    const altRad = altDeg * DEG;
    const azRad = azDeg * DEG;

    const x = radius * Math.cos(altRad) * Math.sin(azRad);
    const y = radius * Math.sin(altRad);
    const z = -radius * Math.cos(altRad) * Math.cos(azRad);

    return { x, y, z };
}

/**
 * Devuelve el ángulo de rotación de la esfera celeste para una fecha y longitud.
 * Se usa para rotar el grupo de estrellas en la escena 3D.
 * @param {number} lonDeg - Longitud del observador en grados
 * @param {Date}   date
 * @returns {number} Ángulo en radianes
 */
export function getSiderealRotation(lonDeg, date) {
    const lst = localSiderealTime(lonDeg, date);
    return lst * HOURS_TO_RAD;  // Convertir horas a radianes
}

/**
 * Devuelve la inclinación del plano del horizonte según la latitud.
 * Se usa para inclinar la esfera celeste respecto al observador.
 * @param {number} latDeg - Latitud del observador en grados
 * @returns {number} Ángulo en radianes
 */
export function getLatitudeInclination(latDeg) {
    // El polo celeste está a (90 - lat) grados del cénit
    return (90 - latDeg) * DEG;
}
