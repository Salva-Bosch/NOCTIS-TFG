/*
LÓGICA DE LA PÁGINA PERFIL
*/

import { auth, db } from "../../js/firebase.js";
import { requireSession } from "../../js/guards/sessionGuard.js";
import { logout } from "../../js/core/auth_logic.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const user = await requireSession(); // debe devolver el user autenticado

// Leer Firestore
const ref = doc(db, "users", user.uid);
const snap = await getDoc(ref);

if (snap.exists()) {
    const data = snap.data();

    document.getElementById("name").textContent = `Nombre: ${data.name}`;
    document.getElementById("email").textContent = `Email: ${data.email}`;
    document.getElementById("created").textContent =
        `Creado: ${data.createdAt?.toDate().toLocaleDateString()}`;
}

// Logout
document.getElementById("logout").addEventListener("click", async () => {
    await logout();
    window.location.replace("../auth/auth.html");
});

