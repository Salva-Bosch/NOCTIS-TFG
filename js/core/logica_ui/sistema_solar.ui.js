/* LÓGICA DE LA BARRA DEL CONTROL DE TIEMPO DEL SISTEMA SOLAR 3D */

// UI del control temporal (NASA Eyes style)
import * as timeEngine from "../timeEngine.js";

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

// Helpers formato
const pad = n => String(n).padStart(2, "0");
const fmtTime = d => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const fmtDate = d =>
    d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });

// Estado UI
let lastNonZeroScale = 1;

// ---- Estado visual ----
function setBarStateFromScale(scale) {
    timebar.classList.remove(
        "timebar--realtime",
        "timebar--paused",
        "timebar--rate",
        "timebar--rewind"
    );

    if (scale === 0) {
        timebar.classList.add("timebar--paused");
        statusEl.textContent = "PAUSED";
        btnPlayPause.textContent = "▶";
        return;
    }

    if (scale === 1) {
        timebar.classList.add("timebar--realtime");
        statusEl.textContent = "REAL RATE";
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

    if (s >= 31536000) return `${sign}1 YEAR / S`;
    if (s >= 2592000) return `${sign}30 DAYS / S`;
    if (s >= 86400) return `${sign}1 DAY / S`;
    if (s >= 3600) return `${sign}1 HOUR / S`;
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
    const s = lastNonZeroScale || 60;
    timeEngine.setTimeScale(-Math.abs(s));
    syncUI();
});

btnForward.addEventListener("click", () => {
    const s = lastNonZeroScale || 60;
    timeEngine.setTimeScale(Math.abs(s));
    syncUI();
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
}

// Init
(function initUI() {
    syncUI();
    updateClock();
})();
