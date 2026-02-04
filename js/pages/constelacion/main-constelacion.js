import { initScene, animate } from "./scene.js";
import { initControls } from "./controls.js";
import { loadStars } from "./stars.js";
import { loadConstellations } from "./constellations.js";

const app = document.getElementById("app");

const { scene, camera, renderer } = initScene(app);

initControls(camera);
await loadStars(scene);
await loadConstellations(scene);

animate(scene, camera, renderer);
