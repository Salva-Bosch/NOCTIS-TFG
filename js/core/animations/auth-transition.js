const goLoginButton = document.getElementById('go-login');
const authContainer = document.querySelector('.auth');

if (goLoginButton && authContainer) {
  goLoginButton.addEventListener('click', (e) => {
    e.preventDefault();

    // Añadimos clase para animar salida
    authContainer.classList.add('auth--slide-out');

    // Esperamos a que termine la animación
    setTimeout(() => {
      window.location.href = goLoginButton.getAttribute('href');
    }, 600); // debe coincidir con el CSS
  });
}
