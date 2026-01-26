const carousels = {
    rocky: document.getElementById('rocky-carousel'),
    gas: document.getElementById('gas-carousel')
};

const state = {
    rocky: 0,
    gas: 0
};

function updateCarousel(type) {
    const carousel = carousels[type];
    const index = state[type];
    const width = carousel.offsetWidth;
    carousel.style.transform = `translateX(-${index * width}px)`;
}

document.querySelectorAll('.carousel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.carousel;
        const cards = carousels[type].children.length;
        if(btn.classList.contains('next')) {
            state[type] = (state[type] + 1) % cards;
        } else {
            state[type] = (state[type] - 1 + cards) % cards;
        }
        updateCarousel(type);
    });
});

window.addEventListener('resize', () => {
    updateCarousel('rocky');
    updateCarousel('gas');
});
