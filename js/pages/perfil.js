/*
LÓGICA DE LA PÁGINA PERFIL
*/

import { auth, db } from "../core/firebase.js";
import { requireSession } from "../guards/sessionGuard.js";
import { logout } from "../core/auth_logic.js";

import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
    updateProfile,
    updateEmail,
    sendPasswordResetEmail,
    deleteUser
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ELEMENTOS */
const inputName = document.getElementById("inputName");
const inputEmail = document.getElementById("inputEmail");
const createdEl = document.getElementById("created");
const msgEl = document.getElementById("msg");

const btnSave = document.getElementById("btnSave");
const btnPassword = document.getElementById("btnPassword");
const btnDelete = document.getElementById("btnDelete");
const btnLogout = document.getElementById("logout");

/* SESIÓN */
const user = await requireSession();
const userRef = doc(db, "users", user.uid);

/* CARGAR DATOS */
const snap = await getDoc(userRef);

if (snap.exists()) {
    const data = snap.data();

    inputName.value = data.name ?? "";
    inputEmail.value = data.email ?? "";
    createdEl.textContent = data.createdAt?.toDate().toLocaleString();
}

/* GUARDAR CAMBIOS */
btnSave.addEventListener("click", async () => {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();

    if (!name || !email) {
        msgEl.textContent = "Nombre y email obligatorios";
        return;
    }

    try {
        if (auth.currentUser.displayName !== name) {
            await updateProfile(auth.currentUser, { displayName: name });
        }

        if (auth.currentUser.email !== email) {
            await updateEmail(auth.currentUser, email);
        }

        await setDoc(
            userRef,
            {
                name,
                email,
                updatedAt: serverTimestamp()
            },
            { merge: true }
        );

        msgEl.textContent = "Cambios guardados correctamente";
    } catch (err) {
        msgEl.textContent = err.message;
    }
});

/* CAMBIAR CONTRASEÑA */
btnPassword.addEventListener("click", async () => {
    try {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        msgEl.textContent = "Email de cambio de contraseña enviado";
    } catch (err) {
        msgEl.textContent = err.message;
    }
});

/* ELIMINAR CUENTA */
btnDelete.addEventListener("click", async () => {
    if (!confirm("¿Seguro que quieres eliminar tu cuenta?")) return;

    try {
        await deleteDoc(userRef);
        await deleteUser(auth.currentUser);
        window.location.replace("../../pages/auth/auth.html");
    } catch (err) {
        msgEl.textContent = err.message;
    }
});

/* LOGOUT */
btnLogout.addEventListener("click", async () => {
    await logout();
    window.location.replace("../../pages/auth/auth.html");
});
