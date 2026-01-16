// PROTECCIÓN: saber si el usuario está autenticado en todo momento
import { auth } from "../core/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export function requireSession(redirect = "/pages/auth/auth.html") {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.replace(redirect);
      } else {
        resolve(user);
      }
    });
  });
}
