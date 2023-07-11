var navbar = document.getElementById('navbar');
var lastScrollTop = 0;

window.addEventListener('scroll', function() {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop && scrollTop > 200) {
    navbar.classList.remove('hide');
  } else {
    navbar.classList.add('hide');
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Para navegadores móviles
});



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
  window.location.href = 'formulario.html';
});
window.addEventListener('load', function() {
  var imagenes = document.querySelectorAll('.imagen-fondo, .imagen-superpuesta');
  imagenes.forEach(function(imagen) {
    imagen.classList.add('loaded');
  });
});
// Obtener elementos del DOM
const formulario = document.querySelector('.formulario');
const imagenFormulario = document.querySelector('.imagen-formulario');
const continuarBtn = document.querySelector('input[type="submit"]');

// Función para el evento de clic en "Continuar"
function continuar(event) {
  event.preventDefault();

  // Eliminar los campos anteriores
  const camposAnteriores = formulario.querySelectorAll('.campo-formulario');
  camposAnteriores.forEach((campo) => {
    campo.remove();
  });

  // Crear nuevos elementos
  const textoNuevo = document.createElement('p');
  textoNuevo.textContent = 'Ya casi terminamos. Coloca los datos correspondientes:';

  const opcion1 = document.createElement('input');
  opcion1.type = 'text';
  opcion1.placeholder = 'Número de la torre';
  opcion1.classList.add('campo-formulario');

  const opcion2 = document.createElement('input');
  opcion2.type = 'text';
  opcion2.placeholder = 'Número del apartamento';
  opcion2.classList.add('campo-formulario');

  // Insertar nuevos elementos en el formulario
  formulario.appendChild(textoNuevo);
  formulario.appendChild(opcion1);
  formulario.appendChild(opcion2);

  // Cambiar el texto del botón y el evento de clic
  continuarBtn.value = 'Registrarse';
  continuarBtn.removeEventListener('click', continuar);
  continuarBtn.addEventListener('click', function() {
    // Aquí puedes agregar la lógica adicional para el registro final
    console.log('Registrarse...');
  });
}

// Agregar evento de clic al botón "Continuar"
continuarBtn.addEventListener('click', continuar);

console.log($); // Verificar que jQuery esté correctamente cargado.

