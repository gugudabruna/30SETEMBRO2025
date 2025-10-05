const inicio = new Date("2007-09-30T11:27:00");

function atualizarContador() {
  const agora = new Date();
  const diferenca = agora - inicio;

  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
  const segundos = Math.floor((diferenca / 1000) % 60);

  // 👇 formatação inteligente:
  // até 999 -> usa 3 dígitos com zero à esquerda
  // a partir de 1000 -> usa separador de milhar (pt-BR)
  let diasFormatados;
  if (dias < 1000) {
    diasFormatados = dias.toString().padStart(3, "0");
  } else {
    diasFormatados = dias.toLocaleString("pt-BR");
  }

  document.getElementById("contador-dias").textContent = diasFormatados;
  document.getElementById("horas").textContent = horas
    .toString()
    .padStart(2, "0");
  document.getElementById("minutos").textContent = minutos
    .toString()
    .padStart(2, "0");
  document.getElementById("segundos").textContent = segundos
    .toString()
    .padStart(2, "0");
}

setInterval(atualizarContador, 1000);
atualizarContador();

const anos = [2007, 2014, 2020, 2021, 2022, 2023, 2024, 2025];
let indiceAtual = 2; // por padrão 2020

function mostrarSeletor() {
  document.getElementById("timer-card").style.display = "none";
  document.getElementById("seletor").style.display = "flex";
  atualizarDisplay();
}

document.addEventListener("DOMContentLoaded", () => {
  // Se a URL vier com "#anos", mostrar o seletor de anos
  if (window.location.hash === "#anos") {
    mostrarSeletor();
  }
});

function atualizarDisplay() {
  const anterior = document.getElementById("ano-anterior");
  const atual = document.getElementById("ano-selecionado");
  const posterior = document.getElementById("ano-posterior");

  anterior.textContent = anos[indiceAtual - 1] || "";
  atual.textContent = anos[indiceAtual];
  posterior.textContent = anos[indiceAtual + 1] || "";

  // Atualiza apenas a classe da era, sem remover outras classes do body
  const body = document.getElementById("body");

  // Remove qualquer classe que começa com 'era-'
  body.classList.forEach((cls) => {
    if (cls.startsWith("era-")) {
      body.classList.remove(cls);
    }
  });

  // Adiciona a nova classe da era
  body.classList.add(`era-${anos[indiceAtual]}`);

  // Aplica animação em cada item
  [anterior, atual, posterior].forEach((el) => {
    el.classList.remove("fade"); // remove se já tiver
    void el.offsetWidth; // força reflow (reinicia animação)
    el.classList.add("fade"); // adiciona novamente
  });
}

function navegar(direcao) {
  const novoIndice = indiceAtual + direcao;
  if (novoIndice >= 0 && novoIndice < anos.length) {
    indiceAtual = novoIndice;
    atualizarDisplay();
  }
}

function selecionarAno() {
  const ano = anos[indiceAtual];
  // Redireciona para outra página (você pode criar arquivos tipo 2021.html etc)
  window.location.href = "eras/" + ano + "/" + ano + ".html";
}

atualizarDisplay(); // inicializa

const setaCima = document.getElementById("seta-cima");
const setaBaixo = document.getElementById("seta-baixo");
const btnVoltar = document.getElementById("voltar-btn");

setaCima.addEventListener("mouseenter", () => {
  setaCima.src = "../docs/imagens/up-hover.png";
  setaCima.addEventListener("mouseleave", () => {
    setaCima.src = "../docs/imagens/up.png";
  });
});

setaBaixo.addEventListener("mouseenter", () => {
  setaBaixo.src = "../docs/imagens/down-hover.png";
});
setaBaixo.addEventListener("mouseleave", () => {
  setaBaixo.src = "../docs/imagens/down.png";
});

// botão voltar
btnVoltar.addEventListener("mouseenter", () => {
  btnVoltar.src = "../docs/imagens/voltar-hover.png";
});
btnVoltar.addEventListener("mouseleave", () => {
  btnVoltar.src = "../docs/imagens/voltar.png";
});

function createHeart() {
  const classes = document.body.className.split(" ");
  const eraClasse = classes.find((c) => c.startsWith("era-"));
  const ano = eraClasse ? eraClasse.split("-")[1] : "2007";

  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.classList.add(`heart-${ano}`);

  heart.style.left = Math.random() * window.innerWidth + "px";
  heart.style.top = Math.random() * window.innerHeight + "px";
  heart.style.animation = `float 5s ease-out forwards`;

  document.getElementById("hearts-container").appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 5000);
}

// criar vários corações a cada intervalo
setInterval(() => {
  for (let i = 0; i < 3; i++) {
    createHeart();
  }
}, 700);
