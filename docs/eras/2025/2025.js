document.addEventListener("DOMContentLoaded", () => {
  const btnVoltar = document.getElementById("voltar-btn2025");

  // Modal
  const modal = document.getElementById("modalVideo");
  const tv = document.querySelector(".conteudo-na-tv");
  const fechar = document.querySelector(".fechar-modal");
  const iframe = modal.querySelector("iframe");

  if (tv && modal && fechar && iframe) {
    tv.addEventListener("click", () => {
      modal.style.display = "flex";
    });

    fechar.addEventListener("click", () => {
      closeModal();
    });
  }

  // Fecha ao clicar fora da área
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  function closeModal() {
    modal.style.display = "none";

    if (iframe) {
      const src = iframe.src;
      iframe.src = ""; // limpa → para totalmente
      iframe.src = src; // restaura → volta do começo
    }
  }
});
