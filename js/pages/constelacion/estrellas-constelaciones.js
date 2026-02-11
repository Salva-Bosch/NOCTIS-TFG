import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

function raDecToXYZ(raDeg, decDeg, r = 1000) {
  const ra = THREE.MathUtils.degToRad(raDeg);
  const dec = THREE.MathUtils.degToRad(decDeg);

  const x = r * Math.cos(dec) * Math.cos(ra);
  const y = r * Math.sin(dec);
  const z = r * Math.cos(dec) * Math.sin(ra);

  return new THREE.Vector3(x, y, z);
}

function magnitudeToSize(mag) {
  return Math.max(0.5, 4 - mag);
}

export async function loadStars(scene) {

  const res = await fetch("/assets/data-sources/json/estrellas-constelacion.json");
  const stars = await res.json();

  const positions = [];
  const sizes = [];

  stars.forEach(star => {
    const pos = raDecToXYZ(star.ra, star.dec);
    positions.push(pos.x, pos.y, pos.z);
    sizes.push(magnitudeToSize(star.mag));
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 5
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);
}
