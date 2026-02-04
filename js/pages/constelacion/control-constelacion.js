let isDragging = false;
let prevX = 0;
let prevY = 0;

export function initControls(camera) {
  window.addEventListener("mousedown", e => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", e => {
    if (!isDragging) return;

    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;

    camera.rotation.y -= dx * 0.002;
    camera.rotation.x -= dy * 0.002;

    camera.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, camera.rotation.x)
    );

    prevX = e.clientX;
    prevY = e.clientY;
  });

  window.addEventListener("wheel", e => {
    camera.fov += e.deltaY * 0.05;
    camera.fov = Math.max(30, Math.min(100, camera.fov));
    camera.updateProjectionMatrix();
  });
}
