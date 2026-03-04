// ================= script serviços =================

     document.addEventListener("DOMContentLoaded", function () {

      const videoModal = document.getElementById('videoModal');
      const iframe = document.getElementById("modalVideo");
      const videoCards = document.querySelectorAll(".video-card");

      // Quando clicar em um card
      videoCards.forEach(card => {
        card.addEventListener("click", function () {
          const videoURL = this.getAttribute("data-video");
          iframe.src = videoURL + "?autoplay=1";
        });
      });

      // Quando fechar o modal, parar o vídeo
      videoModal.addEventListener('hidden.bs.modal', function () {
        iframe.src = "";
      });

    });