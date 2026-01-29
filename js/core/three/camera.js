import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function createCamera(renderer) {
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        10000 // esto crea una vista más global
    );

    const controls = new OrbitControls(camera, renderer.domElement);

    // Vista inicial
    camera.position.set(1200, 600, 1200);

    // Empieza alejado mirando al sol
    controls.target.set(0, 0, 0);
    controls.update();

    // Suavidad
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // ZOOM
    controls.zoomSpeed = 10;
    controls.minDistance = 10;
    controls.maxDistance = 20000;

    return { camera, controls };
}
