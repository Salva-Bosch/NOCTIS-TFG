import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

function raDecToXYZ(raDeg, decDeg, dist) {

  const ra = THREE.MathUtils.degToRad(raDeg);
  const dec = THREE.MathUtils.degToRad(decDeg);

  const r = dist * 20; // ESCALA VISUAL (profundidad realista)

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

  stars.forEach(star => {
    starMap.set(star.id, raDecToXYZ(star.ra, star.dec, star.dist));
  });

  const lineColor = 0x00ffff;

  const coreMaterial = new THREE.LineBasicMaterial({
    color: lineColor,
    transparent: true,
    opacity: 1,
    depthWrite: false
  });

  constellations.forEach(constellation => {

    constellation.connections.forEach(([idA, idB]) => {

      const a = starMap.get(idA);
      const b = starMap.get(idB);

      if (!a || !b) return;

      const geometry = new THREE.BufferGeometry().setFromPoints([a, b]);

      const line = new THREE.Line(geometry, coreMaterial);
      scene.add(line);
    });

  });

  console.log("CONSTELACIONES OK");
}
