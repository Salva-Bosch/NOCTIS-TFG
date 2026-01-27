export function startLoop(renderer, scene, camera, controls) {
    function animate() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
}
