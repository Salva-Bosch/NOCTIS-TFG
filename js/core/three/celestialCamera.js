/* CÁMARA CELESTE — Vista de planetario estilo Star Walk 2
   El observador está fijo en el centro, arrastra para mirar en cualquier dirección.
   NO puede mirar debajo del horizonte. */

import * as THREE from "three";

export function createCelestialCamera(renderer) {
    const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        5000
    );

    // Cámara fija en el origen (centro de la esfera celeste)
    camera.position.set(0, 0, 0);

    // Dirección de la vista en coordenadas esféricas
    // azimuth: 0 = norte (+Z), gira en sentido horario
    // altitude: 0 = horizonte, π/2 = cénit
    let azimuth = Math.PI;        // Mirando hacia el sur inicialmente
    let altitude = Math.PI / 4;   // 45° sobre el horizonte

    // Targets para damping suave
    let targetAz = azimuth;
    let targetAlt = altitude;

    const DRAG_SPEED = 0.003;
    const DAMPING = 0.12;
    const MIN_ALT = 0.02;                   // Justo sobre el horizonte
    const MAX_ALT = Math.PI / 2 - 0.02;     // Casi el cénit

    // --- Estado de arrastre ---
    let isDragging = false;
    let prevX = 0, prevY = 0;

    const el = renderer.domElement;

    // --- Mouse ---
    el.addEventListener("mousedown", (e) => {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
        controls._dispatch("start");
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;

        targetAz -= dx * DRAG_SPEED;
        targetAlt = Math.max(MIN_ALT, Math.min(MAX_ALT, targetAlt + dy * DRAG_SPEED));

        prevX = e.clientX;
        prevY = e.clientY;
    });

    window.addEventListener("mouseup", () => { isDragging = false; });

    // --- Touch ---
    el.addEventListener("touchstart", (e) => {
        if (e.touches.length !== 1) return;
        isDragging = true;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
        controls._dispatch("start");
    }, { passive: true });

    el.addEventListener("touchmove", (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        const dx = e.touches[0].clientX - prevX;
        const dy = e.touches[0].clientY - prevY;

        targetAz -= dx * DRAG_SPEED;
        targetAlt = Math.max(MIN_ALT, Math.min(MAX_ALT, targetAlt + dy * DRAG_SPEED));

        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
    }, { passive: false });

    window.addEventListener("touchend", () => { isDragging = false; });

    // --- Zoom por FOV ---
    const MIN_FOV = 20;
    const MAX_FOV = 120;

    el.addEventListener("wheel", (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 3 : -3;
        camera.fov = Math.max(MIN_FOV, Math.min(MAX_FOV, camera.fov + delta));
        camera.updateProjectionMatrix();
    }, { passive: false });

    // --- Objeto controls compatible ---
    const lookTarget = new THREE.Vector3();

    const controls = {
        /** Llamar cada frame para actualizar la cámara */
        update() {
            // Damping suave
            azimuth += (targetAz - azimuth) * DAMPING;
            altitude += (targetAlt - altitude) * DAMPING;

            // Convertir esféricas → cartesiano para lookAt
            const x = Math.cos(altitude) * Math.sin(azimuth);
            const y = Math.sin(altitude);
            const z = -Math.cos(altitude) * Math.cos(azimuth);

            lookTarget.set(x * 100, y * 100, z * 100);
            camera.lookAt(lookTarget);

            // Forzar cámara en el origen
            camera.position.set(0, 0, 0);
        },

        /** Punto al que mira la cámara (para compatibilidad con focus) */
        target: lookTarget,

        /**
         * Apuntar la cámara hacia una posición 3D.
         * Permite mirar debajo del horizonte si la constelación está oculta.
         * @param {THREE.Vector3} worldPos
         * @param {boolean} allowBelowHorizon - si true, permite mirar debajo del horizonte
         */
        lookAt(worldPos, allowBelowHorizon = false) {
            const dir = worldPos.clone().normalize();
            const minAlt = allowBelowHorizon ? -Math.PI / 6 : MIN_ALT;  // -30° o 0°
            targetAlt = Math.max(minAlt, Math.min(MAX_ALT, Math.asin(dir.y)));
            targetAz = Math.atan2(dir.x, -dir.z);
        },

        /** Obtener la altitud actual (para saber si está cerca del horizonte) */
        getAltitude() { return altitude; },

        /** Obtener el azimuth actual */
        getAzimuth() { return azimuth; },

        /** Apuntar directamente al norte */
        lookAtNorth() {
            targetAz = 0; // El Norte en este sistema es 0 (o 2*Math.PI)
            // Mantener la altitud actual si es razonable
            if (targetAlt < 0.2) targetAlt = 0.2;
        },

        // --- Sistema de eventos ---
        _listeners: {},
        addEventListener(event, fn) {
            if (!this._listeners[event]) this._listeners[event] = [];
            this._listeners[event].push(fn);
        },
        _dispatch(event) {
            (this._listeners[event] || []).forEach(fn => fn());
        }
    };

    return { camera, controls };
}
