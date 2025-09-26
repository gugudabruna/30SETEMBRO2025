


// Seletores
const tituloPlaneta = document.getElementById("texto-plnt");
const modalPlaneta = document.getElementById("planetaModal");
const fecharPlaneta = document.getElementById("fecharPlaneta");

// Abrir ao clicar no título
tituloPlaneta.addEventListener("click", () => {
  modalPlaneta.style.display = "block";
});

// Fechar ao clicar no X
fecharPlaneta.addEventListener("click", () => {
  modalPlaneta.style.display = "none";
});

// Fechar ao clicar fora do conteúdo
window.addEventListener("click", (event) => {
  if (event.target === modalPlaneta) {
    modalPlaneta.style.display = "none";
  }
});
