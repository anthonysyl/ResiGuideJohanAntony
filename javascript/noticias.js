
document.addEventListener("DOMContentLoaded", function() 
{


    function editarNoticia(buttonElement) {
        const newsContainer = buttonElement.closest('.news-container');

        const titleInput = newsContainer.querySelector('.news-title input');
        const descriptionInput = newsContainer.querySelector('.news-description input');
        const contentTextarea = newsContainer.querySelector('.news-content textarea');

        titleInput.removeAttribute('disabled');
        descriptionInput.removeAttribute('disabled');
        contentTextarea.removeAttribute('disabled');

        const acceptButton = newsContainer.querySelector('.action-button.accept');
        acceptButton.style.display = 'block';
    }

    function triggerFileInput(imgElement) {
        const fileInput = imgElement.previousElementSibling;
        fileInput.click();
    }

    function updateImage(inputElement) {
        const newsImage = inputElement.nextElementSibling;
        const reader = new FileReader();

        reader.onload = function(e) {
            newsImage.src = e.target.result;
        }

        reader.readAsDataURL(inputElement.files[0]);
    }

    function actualizarNoticia(buttonElement, noticiaId) {
        const newsContainer = buttonElement.closest('.news-container');
        const imagen = newsContainer.querySelector('.news-img').src;
        const titulo = newsContainer.querySelector('.news-title input').value;
        const descripcion = newsContainer.querySelector('.news-description input').value;
        const contenido = newsContainer.querySelector('.news-content textarea').value;

        const data = {
            imagen,
            titulo,
            descripcion,
            contenido
        };

        axios.put(`/noticias/editar-noticia/${noticiaId}`, data)
            .then(response => {
                if (response.data.success) {
                    console.log("Noticia actualizada correctamente!");
                } else {
                    console.error("Error actualizando noticia:", response.data.message);
                }
            })
            .catch(error => {
                console.error("Error actualizando noticia:", error.message);
            });
    }

    function eliminarNoticia(buttonElement) {
        const newsContainer = buttonElement.closest('.news-container');
        const noticiaId = buttonElement.dataset.id;

        axios.delete(`/noticias/eliminar-noticia/${noticiaId}`)
            .then(response => {
                if (response.data.success) {
                    newsContainer.remove();
                    console.log("Noticia eliminada correctamente!");
                } else {
                    console.error("Error eliminando noticia:", response.data.message);
                }
            })
            .catch(error => {
                console.error("Error eliminando noticia:", error.message);
            });
    }

    window.editarNoticia = editarNoticia;
    window.triggerFileInput = triggerFileInput;
    window.updateImage = updateImage;
    window.actualizarNoticia = actualizarNoticia;
    window.eliminarNoticia = eliminarNoticia;
});
