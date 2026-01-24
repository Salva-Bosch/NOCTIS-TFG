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
const avatarImg = document.getElementById("avatar");
const toggleBtn = document.getElementById("toggleAvatars");
const avatarPicker = document.getElementById("avatarPicker");
const avatarOptions = document.querySelectorAll("#avatarPicker img");

const inputName = document.getElementById("inputName");
const inputEmail = document.getElementById("inputEmail");
const createdEl = document.getElementById("created");
const msgEl = document.getElementById("msg");

const btnSave = document.getElementById("btnSave");
const btnPassword = document.getElementById("btnPassword");
const btnDelete = document.getElementById("btnDelete");
const btnLogout = document.getElementById("logout");

/* Seguridad mínima por si falta algo en el DOM */
if (!avatarImg || !toggleBtn || !avatarPicker || !inputName || !inputEmail || !createdEl || !msgEl) {
    throw new Error("Faltan elementos en el DOM del perfil (IDs incorrectos o HTML desactualizado).");
}

/* SESIÓN */
const user = await requireSession();
const userRef = doc(db, "users", user.uid);

/* CARGAR DATOS */
const snap = await getDoc(userRef);

let currentPhotoURL = "/assets/avatars/avatar-luna.png";

if (snap.exists()) {
    const data = snap.data();

    inputName.value = data.name ?? "";
    inputEmail.value = data.email ?? "";
    createdEl.textContent = data.createdAt?.toDate().toLocaleString() ?? "";

    currentPhotoURL = data.photoURL ?? currentPhotoURL;
}

avatarImg.src = currentPhotoURL;

/* Marcar avatar activo al cargar */
avatarOptions.forEach(img => {
    if (img.dataset.avatar === currentPhotoURL) img.classList.add("active");
});

/* TOGGLE PICKER */
toggleBtn.addEventListener("click", () => {
    const isHidden = avatarPicker.style.display === "none" || avatarPicker.style.display === "";
    avatarPicker.style.display = isHidden ? "grid" : "none";
});

/* CAMBIAR AVATAR */
avatarOptions.forEach(img => {
    img.addEventListener("click", async () => {
        const newAvatar = img.dataset.avatar;
        if (!newAvatar) return;

        try {
            await setDoc(userRef, { photoURL: newAvatar }, { merge: true });

            currentPhotoURL = newAvatar;
            avatarImg.src = newAvatar;

            avatarOptions.forEach(i => i.classList.remove("active"));
            img.classList.add("active");

            avatarPicker.style.display = "none";
            msgEl.textContent = "Avatar actualizado";
        } catch (err) {
            msgEl.textContent = err?.message ?? "Error al actualizar el avatar";
        }
    });
});

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
        msgEl.textContent = err?.message ?? "Error al guardar cambios";
    }
});

/* CAMBIAR CONTRASEÑA */
btnPassword.addEventListener("click", async () => {
    try {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        msgEl.textContent = "Email de cambio de contraseña enviado";
    } catch (err) {
        msgEl.textContent = err?.message ?? "Error al enviar email";
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
        msgEl.textContent = err?.message ?? "Error al eliminar la cuenta";
    }
});

/* LOGOUT */
btnLogout.addEventListener("click", async () => {
    await logout();
    window.location.replace("../../pages/auth/auth.html");
});
