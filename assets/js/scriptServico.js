let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
document.addEventListener("DOMContentLoaded", function () {

  const modalVideo = document.getElementById("modalVideo");
  const areaVip = document.getElementById("areaVipConteudo");
  const bloqueio = document.getElementById("bloqueioVip");

  // ================= ABRIR VÍDEO =================
  document.addEventListener("click", function (e) {

    const card = e.target.closest(".video-card-netflix");

    if (card) {
      const videoURL = card.getAttribute("data-video");
      modalVideo.src = videoURL + "?autoplay=1";
    }

  });

  document.getElementById("videoModal")
    .addEventListener("hidden.bs.modal", function () {
      modalVideo.src = "";
    });

  // ================= ÁREA VIP =================

  const ehAssinante = true;
  if (ehAssinante) {

    bloqueio.style.display = "none";

    const videosVip = [
      { id: "wLvjpIygJVo", titulo: "Aula VIP 1" },
      { id: "kiAk4KZafRw", titulo: "Aula VIP 2" },
      { id: "pWFKRgR0Aag", titulo: "Configuração Avançada Cameo 5" }
    ];

    videosVip.forEach(video => {

  const col = document.createElement("div");
  col.className = "col-md-3";

  col.innerHTML = `
    <div class="video-card-netflix"
         data-video="https://www.youtube.com/embed/${video.id}"
         data-bs-toggle="modal"
         data-bs-target="#videoModal">
      <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg"
           class="img-fluid rounded">
      <p class="mt-2">${video.titulo}</p>
    </div>
  `;

  areaVip.appendChild(col);
});


  }

});