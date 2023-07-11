const carousel = document.getElementById('photo-carousel');
const images = carousel.getElementsByTagName('img');
let currentIndex = 0;

function showNextImage() {
  const currentImage = images[currentIndex];
  const nextIndex = (currentIndex + 1) % images.length;
  const nextImage = images[nextIndex];

  currentImage.style.opacity = '0';
  currentImage.style.zIndex = '1';

  nextImage.style.opacity = '1';
  nextImage.style.zIndex = '2';

  currentIndex = nextIndex;
}

setInterval(showNextImage, 5000);
