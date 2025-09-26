// Fecha o modal ao clicar fora da área de conteúdo
window.addEventListener("click", function (event) {
  var modal = document.getElementById("modalGame");
  var tv = document.querySelector(".conteudo-na-tv");
  var fechar = document.querySelector(".fechar-modal");

  if (event.target === modal) {
    closeModal();
  }
});

function voltarParaAnos() {
  // Fecha qualquer modal aberto da era atual
  closeModal("modalVideo");
  closeModal("modalGame");
  closeModal("modalInfo");

  // Abre o modal de seleção de anos
  openModal("modalAnos");
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";

  if (game) {
    const scene = game.scene.getScene("MainScene");
    if (scene && scene.uiOpen) {
      scene.uiOpen = false;
      game.scene.resume("MainScene"); // volta o jogo
    }
  }
}

document.querySelectorAll(".fechar-modal").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest(".modal").style.display = "none";
    // Se o jogo estiver pausado, despausa:
    if (typeof game !== "undefined" && game.scene) {
      game.scene.resume();
      if (game.scene.keys.defaultScene) {
        game.scene.keys.defaultScene.uiOpen = false;
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const tv = document.querySelector(".tv-container");
  if (tv) {
    tv.addEventListener("click", openGameModal); // Usa a versão correta do game.js
  }

  document.querySelectorAll(".fechar-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-close");
      if (target) closeModal(target);
    });
  });

  // Fecha modal clicando fora
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("modalGame");
    if (event.target === modal) {
      closeModal("modalGame");
    }
  });
});

// Quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  // Ativar clique na TV
  const tv = document.querySelector(".tv-container");
  if (tv) {
    tv.addEventListener("click", openGameModal);
  }

  // Ativar botões de fechar modal
  document.querySelectorAll(".fechar-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-close");
      if (target) closeModal(target);
    });
  });

  // Fecha modal clicando fora do conteúdo
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("modalGame");
    if (event.target === modal) {
      closeModal("modalGame");
    }
  });
});

function openGameModal() {
  openModal("modalGame");

  // mostra controles mobile só no celular
  // força mostrar no mobile
  if (window.innerWidth <= 768) {
    document.getElementById("mobile-controls").style.display = "flex";
  }

  const container = document.getElementById("game");

  if (game) {
    game.scale.resize(
      container.clientWidth || 800,
      container.clientHeight || 600
    );
    game.scene.resume("MainScene");
    return;
  }

  const config = {
    type: Phaser.AUTO,
    parent: "game",
    width: container.clientWidth || 800,
    height: container.clientHeight || 600,
    physics: {
      default: "arcade",
      arcade: { gravity: { y: 800 }, debug: false },
    },
    scene: [MainScene],
  };

  game = new Phaser.Game(config);
}

// esconder os botoes
document.querySelectorAll(".fechar-modal").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("mobile-controls").style.display = "none";
  });
});
