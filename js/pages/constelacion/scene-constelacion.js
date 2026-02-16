import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

export function initScene(canvas) {

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );

  camera.position.z = 800;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  return { scene, camera, renderer };
}

export function animate(scene, camera, renderer) {
  function loop() {
    requestAnimationFrame(loop);
    renderer.render(scene, camera);
  }
  loop();
}
