/* === CONSTELAÇÃO RESPONSIVA E REPOSICIONAMENTO === */

const container = document.querySelector(".constelacao");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");

// Modal (mantenha suas funções, aqui só garanto que existam)
function abrirModal(img, texto) {
  if (!modal) return;
  modalImg.src = img || "";
  const modalText = document.getElementById("modal-text");
  if (modalText) modalText.textContent = texto || "";
  modal.style.display = "flex";
  requestAnimationFrame(() => modal.classList.add("show"));
}

function fecharModal() {
  if (!modal) return;
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
    if (modalImg) modalImg.src = "";
  }, 400);
}

if (modal) {
  modal.addEventListener("click", function (event) {
    const modalContent = document.querySelector(".modal-content");
    if (!modalContent || !modalContent.contains(event.target)) {
      fecharModal();
    }
  });
}

/* util: debounce */
function debounce(fn, wait = 150) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* guarda cancel functions das animações para parar ao recriar */
let cancelAnimFns = [];

/* coleta dados já presentes no HTML (se houver) para reaproveitar imagens/textos */
function coletarSeeds() {
  const seeds = Array.from(container.querySelectorAll(".estrela"));
  const imgs = seeds.map((s) => s.dataset.img).filter(Boolean);
  const texts = seeds.map((s) => s.dataset.text).filter(Boolean);
  return { imgs, texts };
}

/* calcula quantidade de estrelas baseada na área do container (tune conforme quiser) */
function calcularQuantidade() {
  const w = container.clientWidth || window.innerWidth;
  const h = container.clientHeight || window.innerHeight;
  const area = w * h;
  // 1 estrela a cada 20.000 px² (ajuste divisor para aumentar/diminuir densidade)
  const qtd = Math.round(area / 20000);
  // limites para não criar 1000 estrelas em telas grandes ou poucas demais
  return Math.min(220, Math.max(18, qtd));
}

/* animação suave por estrela — retorna função para cancelar essa animação */
function moverEstrela(estrela) {
  let x = 0,
    y = 0;
  let stopped = false;

  function step() {
    if (stopped) return;
    // pequenas variações por frame — ajuste multiplicador para movimento maior
    x += (Math.random() - 0.5) * 1.2;
    y += (Math.random() - 0.5) * 1.2;
    estrela.style.transform = `translate(${x}px, ${y}px)`;
    estrela._raf = requestAnimationFrame(step);
  }

  step();

  return () => {
    stopped = true;
    if (estrela._raf) cancelAnimationFrame(estrela._raf);
  };
}

/* cria/recria as estrelas (limpa antigas) */
function gerarEstrelas() {
  // para animações antigas
  cancelAnimFns.forEach((fn) => typeof fn === "function" && fn());
  cancelAnimFns = [];

  // guarda seeds (imgs/texts) se existirem no HTML inicial
  const { imgs: seedImgs, texts: seedTexts } = coletarSeeds();

  // remove elementos antigos
  container.querySelectorAll(".estrela").forEach((e) => {
    if (e._raf) cancelAnimationFrame(e._raf);
    e.remove();
  });

  const qtd = calcularQuantidade();

  for (let i = 0; i < qtd; i++) {
    const estrela = document.createElement("div");
    estrela.className = "estrela";
    // posição aleatória em % — sempre relativa ao container (que precisa ser position: relative)
    estrela.style.top = `${Math.random() * 98}%`;
    estrela.style.left = `${Math.random() * 98}%`;

    // tamanho aleatório
    const tamanho = Math.random() * 10 + 2; // entre 4px e 12px (alterei, n é mais isso)
    estrela.style.width = `${tamanho}px`;
    estrela.style.height = `${tamanho}px`;

    // reaplica dados se existirem (rotações simples para distribuir)
    if (seedImgs.length) estrela.dataset.img = seedImgs[i % seedImgs.length];
    if (seedTexts.length)
      estrela.dataset.text = seedTexts[i % seedTexts.length];

    // clique abre modal
    estrela.addEventListener("click", () => {
      abrirModal(estrela.dataset.img, estrela.dataset.text);
    });

    container.appendChild(estrela);
    // inicia animação e guarda função de cancelamento
    cancelAnimFns.push(moverEstrela(estrela));
  }
}

/* inicialização: gera estrelas e adiciona listeners de resize/orientation */
document.addEventListener("DOMContentLoaded", () => {
  if (!container) return console.warn("container .constelacao não encontrado");
  gerarEstrelas();

  // quando redimensionar, recria com debounce
  window.addEventListener(
    "resize",
    debounce(() => {
      // só recriar se container mudou significativamente (pode melhorar checagem)
      gerarEstrelas();
    }, 140)
  );

  // em alguns navegadores mobile, orientationchange é mais imediato
  window.addEventListener("orientationchange", () => {
    setTimeout(gerarEstrelas, 200);
  });
});

modalImg.onload = function () {
  if (modalImg.naturalHeight > modalImg.naturalWidth) {
    modalImg.classList.add("vertical");
  } else {
    modalImg.classList.remove("vertical");
  }
};
