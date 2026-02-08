/*
LÓGICA DEL PROCESO DE AUTENTICACIÓN DE USUARIOS (LOGIN Y LOGOUT)
*/

import { register, login } from "../core/auth_logic.js";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// LOGIN
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.querySelector('input[type="email"]').value;
  const password = loginForm.querySelector('input[type="password"]').value;

  try {
    await login(email, password);
    window.location.replace("../app/home/home.html");
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
    window.location.replace("../app/home/home.html");
  } catch (err) {
    alert(err.message);
  }
});
