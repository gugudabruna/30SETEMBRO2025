document.addEventListener("DOMContentLoaded", () => {
  const btnVoltar = document.getElementById("voltar-btn2024");

  // Só adiciona eventos se o botão existir
  if (btnVoltar) {
    btnVoltar.addEventListener("mouseenter", () => {
      btnVoltar.src = "imagens/voltar-hover.png";
    });

    btnVoltar.addEventListener("mouseleave", () => {
      btnVoltar.src = "imagens/voltar.png";
    });
  }

  // Modal
  const modal = document.getElementById("modalVideo");
  const tv = document.querySelector(".conteudo-na-tv");
  const fechar = document.querySelector(".fechar-modal");

  if (tv && modal && fechar) {
    tv.addEventListener("click", () => {
      modal.style.display = "flex";

      const video = modal.querySelector("video");
      if (video) {
        video.play(); // dá autoplay só ao abrir
      }
    });

    fechar.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
});

// Fecha o modal ao clicar fora da área de conteúdo
window.addEventListener("click", function (event) {
  var modal = document.getElementById("modalVideo");
  var tv = document.querySelector(".conteudo-na-tv");
  var fechar = document.querySelector(".fechar-modal");

  if (event.target === modal) {
    closeModal();
  }
});

function closeModal() {
  const modal = document.getElementById("modalVideo");
  const video = modal.querySelector("video");

  modal.style.display = "none";

  // pausa o vídeo e reinicia para o começo
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}

function transicaoWormhole(urlDestino) {
  const wormhole = document.getElementById("wormhole");

  gsap.to(wormhole, {
    width: "3000px",
    height: "3000px",
    duration: 1.2,
    ease: "power4.in",
    onComplete: () => {
      window.location.href = urlDestino;
    },
  });
}
