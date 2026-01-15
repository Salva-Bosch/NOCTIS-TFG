const auth = document.getElementById("auth");
const toggleBtn = document.getElementById("toggle-auth");

const loginPanel = document.querySelector(".auth-panel--login");
const registerPanel = document.querySelector(".auth-panel--register");

const sideTitle = document.getElementById("side-title");
const sideText = document.getElementById("side-text");

let isLogin = true;

toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();

    isLogin = !isLogin;

    // Animación de formularios
    loginPanel.classList.toggle("active", isLogin);
    registerPanel.classList.toggle("active", !isLogin);

    // Estado global
    auth.classList.toggle("auth--login", isLogin);
    auth.classList.toggle("auth--register", !isLogin);

    // Textos del side
    if (isLogin) {
        sideTitle.textContent = "¡Hola!";
        sideText.textContent = "Crea tu cuenta";
        toggleBtn.textContent = "Registrarte";
    } else {
        sideTitle.textContent = "¡Bienvenido!";
        sideText.textContent = "Inicia sesión con tu cuenta";
        toggleBtn.textContent = "Iniciar sesión";
    }
});
