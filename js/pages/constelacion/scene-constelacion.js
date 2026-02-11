import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

export function initScene(canvas) {

  console.log("INIT SCENE OK");

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // 🔥 CUBO GARANTIZADO VISIBLE
  const geometry = new THREE.BoxGeometry(100, 100, 100);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.set(0, 0, -300);

  scene.add(cube);

  return { scene, camera, renderer };
}

export function animate(scene, camera, renderer) {

  console.log("ANIMATE OK");

  function loop() {
    requestAnimationFrame(loop);

    renderer.render(scene, camera);
  }

  loop();
}
