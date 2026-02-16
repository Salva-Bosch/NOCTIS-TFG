import { initScene, animate } from "./scene-constelacion.js";
import { initControls } from "./control-constelacion.js";
import { loadStars } from "./estrellas-constelaciones.js";

console.log("MAIN EJECUTANDO");

const canvas = document.getElementById("app");
console.log("CANVAS =", canvas);

const { scene, camera, renderer } = initScene(canvas);

console.log("SCENE =", scene);
console.log("CAMERA =", camera);
console.log("RENDERER =", renderer);

initControls(camera);

await loadStars(scene);

/* loadConstellations eliminado */

animate(scene, camera, renderer);
