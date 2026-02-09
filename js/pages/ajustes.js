/* LÓGICA DE LA PÁGINA AJUSTES */

import { auth, db } from "../core/firebase.js";
import { requireSession } from "../guards/sessionGuard.js";
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function initSettings() {
    /* ELEMENTOS UI */
    const userAvatar = document.getElementById("userAvatar");
    const userName = document.getElementById("userName");

    const navItems = document.querySelectorAll(".nav-item[data-section]");
    const sections = document.querySelectorAll(".settings-section");

    const displayLocation = document.getElementById("display-location");
    const displayCoords = document.getElementById("display-coords");

    const btnSaveIdiomas = document.getElementById("save-idiomas");
    const btnSaveMedidas = document.getElementById("save-medidas");
    const btnSaveHora = document.getElementById("save-hora");
    const btnResetMedidas = document.getElementById("reset-defaults");
    const msgEl = document.getElementById("msg");

    /* SESIÓN */
    const user = await requireSession();
    const userRef = doc(db, "users", user.uid);
    const settingsRef = doc(db, "users", user.uid, "config", "settings");

    /* CARGAR DATOS PERFIL */
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        const userData = userSnap.data();
        userName.textContent = userData.name || "Usuario";
        if (userData.photoURL) userAvatar.src = userData.photoURL;

        // Simular ubicación si estuviera en el perfil
        displayLocation.textContent = "Valencia, España";
        displayCoords.textContent = "39°25'33.60\" N   0°46'30.00\" O";
    }

    /* CARGAR AJUSTES APLICACIÓN */
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
        const settings = settingsSnap.data();

        // Idiomas
        if (settings.language) {
            document.querySelector(`input[name="language"][value="${settings.language}"]`).checked = true;
        }

        // Medidas
        if (settings.distance) {
            document.querySelector(`input[name="distance"][value="${settings.distance}"]`).checked = true;
        }
        if (settings.temp) {
            document.querySelector(`input[name="temp"][value="${settings.temp}"]`).checked = true;
        }

        // Hora
        if (settings.autoTime !== undefined) {
            document.getElementById("auto-time").checked = settings.autoTime;
        }
        if (settings.timeFormat) {
            document.querySelector(`input[name="time-format"][value="${settings.timeFormat}"]`).checked = true;
        }
    }

    /* NAVEGACIÓN ENTRE SECCIONES */
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetSection = item.dataset.section;

            // Update Nav UI
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");

            // Update Section Visibility
            sections.forEach(sec => {
                sec.classList.remove("active");
                if (sec.id === `section-${targetSection}`) {
                    sec.classList.add("active");
                }
            });
        });
    });

    /* GUARDAR AJUSTES */

    const saveSettings = async (data) => {
        try {
            await setDoc(settingsRef, {
                ...data,
                updatedAt: serverTimestamp()
            }, { merge: true });

            msgEl.textContent = "Cambios guardados correctamente";
            setTimeout(() => {
                msgEl.textContent = "";
            }, 3000);
        } catch (error) {
            console.error("Error al guardar ajustes:", error);
            msgEl.textContent = "Error al guardar los ajustes";
            setTimeout(() => {
                msgEl.textContent = "";
            }, 3000);
        }
    };

    btnSaveIdiomas.addEventListener("click", () => {
        const selectedLang = document.querySelector('input[name="language"]:checked').value;
        saveSettings({ language: selectedLang });
    });

    btnSaveMedidas.addEventListener("click", () => {
        const distance = document.querySelector('input[name="distance"]:checked').value;
        const temp = document.querySelector('input[name="temp"]:checked').value;
        saveSettings({ distance, temp });
    });

    btnSaveHora.addEventListener("click", () => {
        const autoTime = document.getElementById("auto-time").checked;
        const timeFormat = document.querySelector('input[name="time-format"]:checked').value;
        saveSettings({ autoTime, timeFormat });
    });

    btnResetMedidas.addEventListener("click", () => {
        document.querySelector('input[name="distance"][value="km"]').checked = true;
        document.querySelector('input[name="temp"][value="c"]').checked = true;
    });
}

initSettings();
