const loginView = document.getElementById("login-view");
const registerView = document.getElementById("register-view");

document.getElementById("go-register").addEventListener("click", (e) => {
    e.preventDefault();
    loginView.classList.add("hidden");
    registerView.classList.remove("hidden");
});

document.getElementById("go-login").addEventListener("click", (e) => {
    e.preventDefault();
    registerView.classList.add("hidden");
    loginView.classList.remove("hidden");
});
