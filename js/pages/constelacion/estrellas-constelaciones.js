import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

function raDecToXYZ(raDeg, decDeg, r = 300) {
  const ra = THREE.MathUtils.degToRad(raDeg);
  const dec = THREE.MathUtils.degToRad(decDeg);

  return [
    r * Math.cos(dec) * Math.cos(ra),
    r * Math.sin(dec),
    r * Math.cos(dec) * Math.sin(ra)
  ];
}

export async function loadStars(scene) {

  /* ===== CAPA 1 — RELLENO SUAVE (FONDO) ===== */

  const bgGeometry = new THREE.BufferGeometry();
  const bgCount = 1500;

  const bgPositions = new Float32Array(bgCount * 3);

  for (let i = 0; i < bgCount * 3; i++) {
    bgPositions[i] = (Math.random() - 0.5) * 2000;
  }

  bgGeometry.setAttribute("position", new THREE.BufferAttribute(bgPositions, 3));

  const bgMaterial = new THREE.PointsMaterial({
    size: 1.2,
    transparent: true,
    opacity: 0.25
  });

  const bgStars = new THREE.Points(bgGeometry, bgMaterial);
  scene.add(bgStars);

  /* ===== CAPA 2 — ESTRELLAS REALES (CONSTELACIONES) ===== */

  const res = await fetch("/assets/data-sources/json/estrellas-constelacion.json");
  const stars = await res.json();

  const realPositions = new Float32Array(stars.length * 3);

  stars.forEach((star, i) => {
    const [x, y, z] = raDecToXYZ(star.ra, star.dec);

    realPositions[i * 3] = x;
    realPositions[i * 3 + 1] = y;
    realPositions[i * 3 + 2] = z;
  });

  const realGeometry = new THREE.BufferGeometry();
  realGeometry.setAttribute("position", new THREE.BufferAttribute(realPositions, 3));

  const realMaterial = new THREE.PointsMaterial({
    size: 6
  });

  const realStars = new THREE.Points(realGeometry, realMaterial);
  scene.add(realStars);

  /* ===== CAPA 3 — REFUERZO VISUAL EN CONSTELACIONES ===== */
  /* Añade pequeñas nubes alrededor de estrellas reales */

  const haloGeometry = new THREE.BufferGeometry();
  const haloCountPerStar = 12;

  const haloPositions = new Float32Array(stars.length * haloCountPerStar * 3);

  let ptr = 0;

  stars.forEach(star => {

    const [cx, cy, cz] = raDecToXYZ(star.ra, star.dec);

    for (let i = 0; i < haloCountPerStar; i++) {

      haloPositions[ptr++] = cx + (Math.random() - 0.5) * 8;
      haloPositions[ptr++] = cy + (Math.random() - 0.5) * 8;
      haloPositions[ptr++] = cz + (Math.random() - 0.5) * 8;
    }
  });

  haloGeometry.setAttribute("position", new THREE.BufferAttribute(haloPositions, 3));

  const haloMaterial = new THREE.PointsMaterial({
    size: 1.8,
    transparent: true,
    opacity: 0.35
  });

  const haloStars = new THREE.Points(haloGeometry, haloMaterial);
  scene.add(haloStars);

  console.log("Stars:", stars.length);
}
