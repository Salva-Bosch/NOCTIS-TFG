import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

function raDecToXYZ(raDeg, decDeg, r = 1000) {
  const ra = THREE.MathUtils.degToRad(raDeg);
  const dec = THREE.MathUtils.degToRad(decDeg);

  return new THREE.Vector3(
    r * Math.cos(dec) * Math.cos(ra),
    r * Math.sin(dec),
    r * Math.cos(dec) * Math.sin(ra)
  );
}

export async function loadConstellations(scene) {

  const [starsRes, constRes] = await Promise.all([
    fetch("/assets/data-sources/json/estrellas-constelacion.json"),
    fetch("/assets/data-sources/json/constelaciones.json")
  ]);

  const stars = await starsRes.json();
  const constellations = await constRes.json();

  const starMap = new Map();
  stars.forEach(star => starMap.set(star.name, raDecToXYZ(star.ra, star.dec)));

  const material = new THREE.LineBasicMaterial({ color: 0x00aaff });

  constellations.forEach(constellation => {
    constellation.connections.forEach(([nameA, nameB]) => {
      const a = starMap.get(nameA);
      const b = starMap.get(nameB);
      if (!a || !b) return;

      const geometry = new THREE.BufferGeometry().setFromPoints([a, b]);
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    });
  });
}
