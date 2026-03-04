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

    // ================= ABRIR VÍDEO =================
const videoCards = document.querySelectorAll(".video-card-netflix");
const modalVideo = document.getElementById("modalVideo");

videoCards.forEach(card => {
  card.addEventListener("click", function () {
    modalVideo.src = this.getAttribute("data-video");
  });
});

// Limpa vídeo ao fechar modal
document.getElementById("videoModal")
  .addEventListener("hidden.bs.modal", function () {
    modalVideo.src = "";
  });


// ================= ÁREA VIP =================
document.addEventListener("DOMContentLoaded", function () {

  const areaVip = document.getElementById("areaVipConteudo");
  const bloqueio = document.getElementById("bloqueioVip");

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const ehAssinante = carrinho.find(item => item.tipo === "assinatura");

  if (ehAssinante) {

    bloqueio.style.display = "none";

    areaVip.innerHTML = `
      <div class="col-md-3">
        <div class="video-card-netflix"
             data-video="https://www.youtube.com/embed/Uq5e291QdZ0"
             data-bs-toggle="modal"
             data-bs-target="#videoModal">
          <img src="https://img.youtube.com/vi/Uq5e291QdZ0/hqdefault.jpg"
               class="img-fluid rounded">
          <p class="mt-2">Aula Exclusiva VIP</p>
        </div>
      </div>
    `;
  }
});