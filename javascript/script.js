
const squares = document.querySelectorAll('.square');

// Agregamos un evento de clic a cada botón 'Read More'
squares.forEach(square => {
    const readMoreBtn = square.querySelector('.read-more');
    const additionalContent = square.querySelector('.additional-content');

    readMoreBtn.addEventListener('click', () => {
        // Alternamos la clase 'expanded' en la tarjeta correspondiente
        square.classList.toggle('expanded');
    });
});
const getStartedBtn = document.getElementById('get-started');

getStartedBtn.addEventListener('click', () => {
  window.location.href = 'inicio.html';
});
