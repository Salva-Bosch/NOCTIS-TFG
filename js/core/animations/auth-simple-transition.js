const auth = document.getElementById("auth");
const toggleBtn = document.getElementById("toggle-auth");

const loginPanel = document.querySelector(".auth-panel--login");
const registerPanel = document.querySelector(".auth-panel--register");

const sideTitle = document.getElementById("side-title");
const sideText = document.getElementById("side-text");

let isLogin = true;

function setAuthMode(toLogin) {
    if (isLogin === toLogin) return; // evita la doble animación
    isLogin = toLogin;

    // Animación de formularios
    loginPanel.classList.toggle("active", isLogin);
    registerPanel.classList.toggle("active", !isLogin);

    // Estado global
    auth.classList.toggle("auth--login", isLogin);
    auth.classList.toggle("auth--register", !isLogin);

    // Textos del side (desktop)
    if (isLogin) {
        sideTitle.textContent = "¡Hola!";
        sideText.textContent = "Crea tu cuenta";
        toggleBtn.textContent = "Registrarte";
    } else {
        sideTitle.textContent = "¡Bienvenido!";
        sideText.textContent = "Inicia sesión con tu cuenta";
        toggleBtn.textContent = "Iniciar sesión";
    }

    // Actualizar tabs móviles
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === (isLogin ? 'login' : 'register'));
    });
}

toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    setAuthMode(!isLogin);
});

// Eventos de tabs (móvil)
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        setAuthMode(btn.dataset.target === 'login');
    });
});
