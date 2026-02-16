/*
LÓGICA DE LA PÁGINA PERFIL
*/

import { auth, db } from "../core/firebase.js";
import { requireSession } from "../guards/sessionGuard.js";
import { logout } from "../core/auth_logic.js";
import { getSettings } from "../core/settingsManager.js";

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

async function initPerfil() {

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
    const btnLogout = document.getElementById("btnLogout");
    const profileNameEl = document.getElementById("profileName");

    /* Seguridad mínima */
    if (!avatarImg || !inputName || !inputEmail || !createdEl || !profileNameEl) {
        console.error("DOM incompleto en perfil.html");
        return;
    }

    /* SESIÓN */
    const user = await requireSession();
    const userRef = doc(db, "users", user.uid);

    /* CARGAR DATOS */
    const snap = await getDoc(userRef);

    let currentPhotoURL = "../../../assets/avatars/avatar-luna.webp";

    // Helper para formatear fecha según ajustes
    function formatUserDate(date) {
        if (!date) return "";
        const settings = getSettings();
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: settings.timeFormat === "12"
        };
        return date.toLocaleString(undefined, options);
    }

    if (snap.exists()) {
        const data = snap.data();

        inputName.value = data.name ?? "";
        inputEmail.value = data.email ?? "";
        createdEl.textContent = formatUserDate(data.createdAt?.toDate());
        profileNameEl.textContent = data.name ?? "Perfil";

        currentPhotoURL = data.photoURL ?? currentPhotoURL;
    }

    avatarImg.src = currentPhotoURL;

    avatarOptions.forEach(img => {
        if (img.dataset.avatar === currentPhotoURL) {
            img.classList.add("active");
        }
    });

    /* TOGGLE PICKER */
    if (toggleBtn && avatarPicker) {
        toggleBtn.addEventListener("click", () => {
            const isHidden =
                avatarPicker.style.display === "none" ||
                avatarPicker.style.display === "";

            avatarPicker.style.display = isHidden ? "grid" : "none";
        });
    }

    /* CAMBIAR AVATAR */
    avatarOptions.forEach(img => {
        img.addEventListener("click", async () => {
            const newAvatar = img.dataset.avatar;
            if (!newAvatar) return;

            await setDoc(userRef, { photoURL: newAvatar }, { merge: true });

            currentPhotoURL = newAvatar;
            avatarImg.src = newAvatar;

            avatarOptions.forEach(i => i.classList.remove("active"));
            img.classList.add("active");

            avatarPicker.style.display = "none";
            msgEl.textContent = "Avatar actualizado";
        });
    });

    /* GUARDAR CAMBIOS */
    if (btnSave) {
        btnSave.addEventListener("click", async () => {
            const name = inputName.value.trim();
            const email = inputEmail.value.trim();

            if (!name || !email) {
                msgEl.textContent = "Nombre y email obligatorios";
                return;
            }

            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, { displayName: name });
            }

            if (auth.currentUser.email !== email) {
                await updateEmail(auth.currentUser, email);
            }

            await setDoc(
                userRef,
                { name, email, updatedAt: serverTimestamp() },
                { merge: true }
            );

            profileNameEl.textContent = name;
            msgEl.textContent = "Cambios guardados correctamente";
        });
    }

    /* CAMBIAR CONTRASEÑA */
    if (btnPassword) {
        btnPassword.addEventListener("click", async () => {
            await sendPasswordResetEmail(auth, auth.currentUser.email);
            msgEl.textContent = "Email de cambio de contraseña enviado";
        });
    }

    /* ELIMINAR CUENTA */
    if (btnDelete) {
        btnDelete.addEventListener("click", async () => {
            if (!confirm("¿Seguro que quieres eliminar tu cuenta?")) return;

            try {
                await deleteDoc(userRef);
                await deleteUser(auth.currentUser);
                window.location.replace("../../public/auth.html");
            } catch (err) {
                if (err.code === "auth/requires-recent-login") {
                    msgEl.textContent = "Vuelve a iniciar sesión para eliminar la cuenta";
                    await logout();
                    window.location.replace("../../public/auth.html");
                } else {
                    msgEl.textContent = err.message;
                }
            }
        });
    }

    /* LOGOUT */
    if (btnLogout) {
        btnLogout.addEventListener("click", async () => {
            await logout();
            window.location.replace("../../public/auth.html");
        });
    }
}

initPerfil();

