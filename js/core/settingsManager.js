/* GESTOR DE AJUSTES DE USUARIO */
import { auth, db } from "./firebase.js";
import { doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentSettings = {
    language: "es",
    distance: "km",
    temp: "c",
    autoTime: true,
    timeFormat: "24"
};

let unsubscribe = null;
const listeners = new Set();

/**
 * Inicializa la escucha de ajustes para el usuario actual.
 */
export function initSettings() {
    auth.onAuthStateChanged(user => {
        if (user) {
            const settingsRef = doc(db, "users", user.uid, "config", "settings");

            if (unsubscribe) unsubscribe();

            unsubscribe = onSnapshot(settingsRef, (doc) => {
                if (doc.exists()) {
                    currentSettings = { ...currentSettings, ...doc.data() };
                    notifyListeners();
                }
            });
        } else {
            if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
            }
        }
    });
}

/**
 * Devuelve los ajustes actuales.
 */
export function getSettings() {
    return currentSettings;
}

/**
 * Suscribe un callback para cambios en los ajustes.
 */
export function onChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

function notifyListeners() {
    listeners.forEach(callback => callback(currentSettings));
}

// Auto-inicializar
initSettings();
