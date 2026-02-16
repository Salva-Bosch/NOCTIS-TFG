import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

let starField;

function raDecToXYZ(raDeg, decDeg, dist) {

  const ra = THREE.MathUtils.degToRad(raDeg);
  const dec = THREE.MathUtils.degToRad(decDeg);

  const r = dist * 20;

  return [
    r * Math.cos(dec) * Math.cos(ra),
    r * Math.sin(dec),
    r * Math.cos(dec) * Math.sin(ra)
  ];
}

export async function loadStars(scene, camera) {

  const res = await fetch("/assets/data-sources/json/estrellas-constelacion.json");
  const stars = await res.json();

  const positions = new Float32Array(stars.length * 3);

  stars.forEach((star, i) => {

    const [x, y, z] = raDecToXYZ(star.ra, star.dec, star.dist);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 8,
    depthWrite: false
  });

  starField = new THREE.Points(geometry, material);
  scene.add(starField);
}

export function updateStarfield(camera) {
  if (!starField) return;
  starField.position.copy(camera.position);
}
