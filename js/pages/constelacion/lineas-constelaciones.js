import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

export async function loadConstellations(scene) {
  const res = await fetch("data/constellations.json");
  const constellations = await res.json();

  const material = new THREE.LineBasicMaterial({
    color: 0x00aaff
  });

  constellations.forEach(c => {
    const points = c.lines.map(p =>
      new THREE.Vector3(p.x, p.y, p.z)
    );

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
  });
}
