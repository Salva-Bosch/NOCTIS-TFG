import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

/**
 * Convierte RA / DEC (grados) a coordenadas 3D
 * r = radio de la esfera celeste
 */
function raDecToXYZ(raDeg, decDeg, r = 1000) {
  const ra = THREE.MathUtils.degToRad(raDeg);
  const dec = THREE.MathUtils.degToRad(decDeg);

  const x = r * Math.cos(dec) * Math.cos(ra);
  const y = r * Math.sin(dec);
  const z = r * Math.cos(dec) * Math.sin(ra);

  return new THREE.Vector3(x, y, z);
}

/**
 * Convierte magnitud aparente a tamaño visual
 * (más negativa = más grande)
 */
function magnitudeToSize(mag) {
  return Math.max(0.5, 4 - mag);
}

export async function loadStars(scene) {
  const res = await fetch("data/stars.json");
  const stars = await res.json();

  const positions = [];
  const sizes = [];

  stars.forEach(star => {
    const pos = raDecToXYZ(star.ra, star.dec);
    positions.push(pos.x, pos.y, pos.z);
    sizes.push(magnitudeToSize(star.mag));
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  geometry.setAttribute(
    "size",
    new THREE.Float32BufferAttribute(sizes, 1)
  );

  /**
   * Shader para tamaño variable por estrella
   */
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: true,
    uniforms: {
      color: { value: new THREE.Color(0xffffff) }
    },
    vertexShader: `
      attribute float size;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });

  const starsPoints = new THREE.Points(geometry, material);
  scene.add(starsPoints);
}
