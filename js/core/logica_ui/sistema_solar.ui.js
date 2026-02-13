/* LÓGICA DE LA BARRA DEL CONTROL DE TIEMPO DEL SISTEMA SOLAR 3D */

// UI del control temporal (NASA Eyes style)
import * as timeEngine from "../timeEngine.js";
import { getSettings } from "../settingsManager.js";

const State = {
    REAL: "realtime",
    PAUSED: "paused",
    RATE: "rate",
    REWIND: "rewind"
};

// DOM
const timebar = document.getElementById("timebar");
const statusEl = document.getElementById("timeStatus");
const clockEl = document.getElementById("timeClock");
const dateEl = document.getElementById("timeDate");

const btnPlayPause = document.getElementById("timePlayPause");
const btnRewind = document.getElementById("timeRewind");
const btnForward = document.getElementById("timeForward");
const presetBtns = Array.from(document.querySelectorAll(".timebar-preset"));

const liveBtn = document.getElementById("liveBtn");

// Helpers formato
const pad = n => String(n).padStart(2, "0");
const fmtTime = d => {
    const settings = getSettings();
    const is12h = settings.timeFormat === "12";

    let hours = d.getHours();
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    if (is12h) {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // el 0 es 12 en 12h
        return `${pad(hours)}:${minutes}:${seconds} ${ampm}`;
    }

    return `${pad(hours)}:${minutes}:${seconds}`;
};
const fmtDate = d =>
    d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });

// Estado UI
let lastNonZeroScale = 1;

const TIME_STEPS = [
    -31536000, // -1 YEAR / S
    -2592000,  // -30 DAYS / S
    -86400,    // -1 DAY / S
    -3600,     // -1 HOUR / S
    -60,       // -1 MIN / S
    1,         // REAL RATE
    60,        // +1 MIN / S
    3600,      // +1 HOUR / S
    86400,     // +1 DAY / S
    2592000,   // +30 DAYS / S
    31536000   // +1 YEAR / S
];


// ---- Estado visual ----

// CLick del botón LIVE
liveBtn.addEventListener("click", () => {
    timeEngine.syncToNow();
    timeEngine.play();
    syncUI();
});

function setBarStateFromScale(scale) {
    timebar.classList.remove(
        "timebar--realtime",
        "timebar--paused",
        "timebar--rate",
        "timebar--rewind"
    );

    if (scale === 0) {
        timebar.classList.add("timebar--paused");
        statusEl.textContent = "PAUSADO";
        btnPlayPause.textContent = "▶";
        return;
    }

    if (scale === 1) {
        timebar.classList.add("timebar--realtime");
        statusEl.textContent = "TIEMPO REAL";
        btnPlayPause.textContent = "⏸";
        return;
    }

    if (scale < 0) {
        timebar.classList.add("timebar--rewind");
    } else {
        timebar.classList.add("timebar--rate");
    }

    statusEl.textContent = formatRate(scale);
    btnPlayPause.textContent = "⏸";
}

// ---- Texto central de velocidad ----
function formatRate(scale) {
    const s = Math.abs(scale);
    const sign = scale < 0 ? "-" : "+";

    if (s >= 31536000) return `${sign}1 AÑO / S`;
    if (s >= 2592000) return `${sign}30 DÍAS / S`;
    if (s >= 86400) return `${sign}1 DÍA / S`;
    if (s >= 3600) return `${sign}1 HORA / S`;
    if (s >= 60) return `${sign}1 MIN / S`;
    return `${sign}${s} SEC / S`;
}

// ---- Presets ----
function setActivePreset(scale) {
    presetBtns.forEach(b => b.classList.toggle("is-active", Number(b.dataset.scale) === scale));
}

// ---- Eventos ----
btnPlayPause.addEventListener("click", () => {
    const current = timeEngine.getTimeScale();
    if (current === 0) {
        timeEngine.setTimeScale(lastNonZeroScale || 1);
    } else {
        lastNonZeroScale = current || lastNonZeroScale || 1;
        timeEngine.pause();
    }
    syncUI();
});

btnRewind.addEventListener("click", () => {
    const current = timeEngine.getTimeScale();
    const idx = getNearestStepIndex(current);
    applyStepByIndex(idx - 1);
});

btnForward.addEventListener("click", () => {
    const current = timeEngine.getTimeScale();
    const idx = getNearestStepIndex(current);
    applyStepByIndex(idx + 1);
});

presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const scale = Number(btn.dataset.scale);
        if (scale === 1) {
            timeEngine.syncToNow();
            timeEngine.play();
        } else {
            timeEngine.setTimeScale(scale);
        }
        lastNonZeroScale = scale === 0 ? lastNonZeroScale : scale;
        setActivePreset(scale);
        syncUI();
    });
});

// ---- Reloj en vivo ----
function updateClock() {
    const d = timeEngine.getCurrentDate();
    if (d) {
        clockEl.textContent = fmtTime(d);
        dateEl.textContent = fmtDate(d);
    }
    requestAnimationFrame(updateClock);
}

// ---- Sync general ----
function syncUI() {
    const scale = timeEngine.getTimeScale();
    setBarStateFromScale(scale);
    setActivePreset(scale === 0 ? lastNonZeroScale : scale);
    liveBtn.classList.toggle("is-live", timeEngine.getTimeScale() === 1);
}

// Init
(function initUI() {
    timeEngine.play();
    syncUI();
    updateClock();
})();

function getNearestStepIndex(scale) {
    const idx = TIME_STEPS.indexOf(scale);
    if (idx !== -1) return idx;

    // Si el scale no coincide exactamente, aproximamos
    let nearest = 0;
    let minDiff = Infinity;
    TIME_STEPS.forEach((s, i) => {
        const d = Math.abs(Math.abs(scale) - Math.abs(s));
        if (d < minDiff) {
            minDiff = d;
            nearest = i;
        }
    });
    return nearest;
}

function applyStepByIndex(index) {
    const clamped = Math.max(0, Math.min(TIME_STEPS.length - 1, index));
    const scale = TIME_STEPS[clamped];

    if (scale === 1) {
        timeEngine.syncToNow();
        timeEngine.play();
    } else {
        timeEngine.setTimeScale(scale);
    }
    lastNonZeroScale = scale === 0 ? lastNonZeroScale : scale;
    syncUI();
}

