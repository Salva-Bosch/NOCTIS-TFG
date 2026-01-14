const goRegisterButton = document.getElementById('go-register');
const authContainer = document.querySelector('.auth');

if (goRegisterButton && authContainer) {
  goRegisterButton.addEventListener('click', (e) => {
    e.preventDefault();

    // Animación de salida hacia la derecha
    authContainer.classList.add('auth--slide-out-right');

    setTimeout(() => {
      window.location.href = goRegisterButton.getAttribute('href');
    }, 600);
  });
}
