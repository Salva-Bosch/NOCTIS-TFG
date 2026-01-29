// MOTOR DE TIEMPO GLOBAL

let currentDate = null;
let timeScale = 1;// 1 = tiempo real
let isPaused = false;
let lastUpdate = null;

// Inicializa el motor
function init() {
    currentDate = new Date();// tiempo real actual
    timeScale = 1;
    isPaused = false;
    lastUpdate = performance.now();
}

// Se llama una vez por frame
function update() {
    if (isPaused || timeScale === 0) {
        lastUpdate = performance.now();
        return;
    }

    const now = performance.now();
    const deltaMs = now - lastUpdate;
    lastUpdate = now;

    // Avance de tiempo (ms → segundos → escalado)
    const deltaSeconds = (deltaMs / 1000) * timeScale;

    currentDate = new Date(currentDate.getTime() + deltaSeconds * 1000);
}

function syncToNow() {
    currentDate = new Date();
    lastUpdate = performance.now();
}

// Controles
function setTimeScale(value) {
    timeScale = value;
    isPaused = value === 0;
}

function pause() {
    timeScale = 0;
    isPaused = true;
}

function play() {
    timeScale = 1;
    isPaused = false;
}

// Getters
function getCurrentDate() {
    return currentDate;
}

function getTimeScale() {
    return timeScale;
}

export {
    init,
    update,
    setTimeScale,
    pause,
    play,
    syncToNow,
    getCurrentDate,
    getTimeScale
};
