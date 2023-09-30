document.addEventListener("DOMContentLoaded", function() {
    let saberMasButtons = document.querySelectorAll(".saber-mas");
    let volverButtons = document.querySelectorAll(".volver");

    saberMasButtons.forEach(button => {
        button.addEventListener("click", function() {
            let card = button.closest(".card");
            let icon = card.querySelector(".icon");
            let causaText = card.querySelector(".causa-text");

            // Expande la tarjeta y oculta el ícono y el botón "Saber más"
            card.classList.add("card-expanded");
            icon.style.opacity = "0";
            button.style.opacity = "0";  // Cambiamos la opacidad a 0
            button.style.visibility = "hidden";  // Escondemos el botón
            setTimeout(() => {
                causaText.style.opacity = "1";
            }, 250);  // Tiempo para esperar la animación del ícono
        });
    });

    volverButtons.forEach(button => {
        button.addEventListener("click", function() {
            let card = button.closest(".card");
            let icon = card.querySelector(".icon");
            let causaText = card.querySelector(".causa-text");
            let saberMasButton = card.querySelector(".saber-mas");

            // Contrae la tarjeta y muestra el ícono y el botón "Saber más"
            causaText.style.opacity = "0";
            setTimeout(() => {
                card.classList.remove("card-expanded");
                icon.style.opacity = "1";
                saberMasButton.style.opacity = "1";  // Restauramos la opacidad
                saberMasButton.style.visibility = "visible";  // Mostramos nuevamente el botón "Saber más"
            }, 250);  // Tiempo para esperar la animación del texto
        });
    });
});
