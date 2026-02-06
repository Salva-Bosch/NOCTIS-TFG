import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function createCamera(renderer) {
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        50000
    );

    const controls = new OrbitControls(camera, renderer.domElement);

    // Con DISTANCE_SCALE = 1/1_000_000:
    // - Órbita de la Tierra ≈ 149.6 unidades
    // Por tanto, una vista inicial a ~300 es correcta.
    camera.position.set(260, 130, 260);

    // Target inicial: el Sol
    controls.target.set(0, 0, 0);
    controls.update();

    // Suavidad
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Zoom
    controls.zoomSpeed = 10;

    // Rango de distancias coherente con la escena
    controls.minDistance = 0.1;
    controls.maxDistance = 20000;

    return { camera, controls };
}