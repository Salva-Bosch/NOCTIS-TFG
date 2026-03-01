/* CÁMARA CELESTE — Vista de planetario
   El observador está en el centro de la esfera celeste mirando hacia fuera. */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function createCelestialCamera(renderer) {
    const camera = new THREE.PerspectiveCamera(
        70,  // FOV inicial (campo de visión amplio para ver bastante cielo)
        window.innerWidth / window.innerHeight,
        0.1,
        5000
    );

    const controls = new OrbitControls(camera, renderer.domElement);

    // El observador está en el centro mirando hacia el cénit
    camera.position.set(0, 0.1, 0);  // Ligeramente desplazado para evitar gimbal lock

    // Target inicial: mirando al norte y ligeramente arriba
    controls.target.set(0, 200, -400);
    controls.update();

    // Suavidad
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    // --- ZOOM mediante FOV (no desplazamiento de posición) ---
    controls.enableZoom = false;  // Deshabilitamos zoom de posición
    controls.enablePan = false;   // No tiene sentido hacer pan en planetario

    // Zoom manual por FOV con rueda del ratón
    const MIN_FOV = 20;
    const MAX_FOV = 120;

    renderer.domElement.addEventListener("wheel", (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 3 : -3;
        camera.fov = Math.max(MIN_FOV, Math.min(MAX_FOV, camera.fov + delta));
        camera.updateProjectionMatrix();
    }, { passive: false });

    // Restringir la cámara para que no baje por debajo del horizonte
    // polarAngle = 0 → cénit, π/2 → horizonte, π → nadir
    controls.minPolarAngle = 0.05;           // Casi el cénit
    controls.maxPolarAngle = Math.PI / 2;    // Justo el horizonte (no puede bajar más)

    // Velocidad de rotación reducida para movimiento suave
    controls.rotateSpeed = 0.4;

    return { camera, controls };
}
