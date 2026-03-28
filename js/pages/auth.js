/*
LÓGICA DEL PROCESO DE AUTENTICACIÓN DE USUARIOS (LOGIN Y LOGOUT)
*/

import { register, login, loginWithGoogle } from "../core/auth_logic.js";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// GOOGLE SIGN-IN (ambos botones: login y register)
document.querySelectorAll(".google-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    try {
      await loginWithGoogle();
      window.location.replace("../../pages/app/home/home.html");
    } catch (err) {
      alert(err.message);
    }
  });
});


// LOGIN
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.querySelector('input[type="email"]').value;
  const password = loginForm.querySelector('input[type="password"]').value;

  try {
    await login(email, password);
    window.location.replace("../../pages/app/home/home.html");
  } catch (err) {
    alert(err.message);
  }
});

// REGISTER
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputs = registerForm.querySelectorAll("input");
  const name = inputs[0].value;
  const email = inputs[1].value;
  const password = inputs[2].value;

  try {
    await register(name, email, password);
    window.location.replace("../../pages/app/home/home.html");
  } catch (err) {
    alert(err.message);
  }
});
