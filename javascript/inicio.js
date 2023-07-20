const menuIcon = document.getElementById("menu-icon");
const slider = document.getElementById("slider");

menuIcon.addEventListener("click", () => {
  slider.classList.toggle("open");
});
