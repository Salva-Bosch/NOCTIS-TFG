import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

function raDecToXYZ(raDeg, decDeg, r = 300) {
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
  stars.forEach(star => {
    starMap.set(star.id, raDecToXYZ(star.ra, star.dec));
  });

  /* MATERIAL MUY VISIBLE */
  const material = new THREE.LineBasicMaterial({
    color: 0x00ffff,      // cian brillante (mucho más visible)
    transparent: true,
    opacity: 1
  });

  constellations.forEach(constellation => {

    constellation.connections.forEach(([idA, idB]) => {

      const a = starMap.get(idA);
      const b = starMap.get(idB);

      if (!a || !b) return;

      const points = [];

      /* subdividir línea → sensación de grosor */
      const segments = 12;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        points.push(new THREE.Vector3().lerpVectors(a, b, t));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const line = new THREE.Line(geometry, material);
      scene.add(line);
    });

  });

  console.log("CONSTELACIONES CARGADAS");
}
