import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

let stars;

export function initScene(canvas) {

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );

  camera.position.z = 1000;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  /* ===== ESTRELLAS ===== */

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 2000;

  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 4000;
  }

  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const starMaterial = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: true
  });

  stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  return { scene, camera, renderer };
}

export function animate(scene, camera, renderer) {

  function loop() {
    requestAnimationFrame(loop);

    if (stars) {
      stars.rotation.y += 0.0005;
    }

    renderer.render(scene, camera);
  }

  loop();
}
