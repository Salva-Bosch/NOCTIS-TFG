// ScrollReveal para animaciones de entrada
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('reveal--visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

revealElements.forEach(el => observer.observe(el));

// Carrusel de planetas rocosos tipo slider
const slides = document.querySelectorAll('.planet-slide');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

let currentSlide = 0;

// Función mostrar slide
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

// Inicializamos con el primer slide
showSlide(currentSlide);

// Botones
nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
});

prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
});
