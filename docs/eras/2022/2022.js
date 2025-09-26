import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.148.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.148.0/examples/jsm/controls/OrbitControls.js";

// === Cena ===
const scene = new THREE.Scene();

// === Câmera ===
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 18);

// === Renderizador ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// === Luzes ===
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// === Loader de Texturas ===
const textureLoader = new THREE.TextureLoader();

// === Planeta ===
const planetaTexture = textureLoader.load("../../texturas/planeta.jpg");
const planetaGeometry = new THREE.SphereGeometry(3, 64, 64);
const planetaMaterial = new THREE.MeshStandardMaterial({
  map: planetaTexture,
  roughness: 0.6,
  metalness: 0.3,
  emissive: 0x552244, // tom suave de roxo
  emissiveIntensity: 0.2,
});
const planeta = new THREE.Mesh(planetaGeometry, planetaMaterial);
scene.add(planeta);

// === Anel ===
const ringGeometry = new THREE.RingGeometry(4, 6, 124);
const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0xff69b4,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.7,
});

const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2.5;
scene.add(ring);

// === Estrelas no fundo ===
const starGeometry = new THREE.BufferGeometry();
const starCount = 3000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  starPositions[i] = (Math.random() - 0.5) * 200;
}
starGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(starPositions, 3)
);
const starColors = [0xffffff, 0xffc0cb, 0xadd8e6, 0xb19cd9];
const starMaterial = new THREE.PointsMaterial({
  vertexColors: true,
  size: 0.5,
});

const colors = [];
for (let i = 0; i < starCount; i++) {
  const color = new THREE.Color(
    starColors[Math.floor(Math.random() * starColors.length)]
  );
  colors.push(color.r, color.g, color.b);
}
starGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// === Anel de detritos genéricos (pontos) ===
const detritosGeometry = new THREE.BufferGeometry();
const detritosCount = 500;
const detritosPositions = new Float32Array(detritosCount * 3);
for (let i = 0; i < detritosCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 4.5 + Math.random() * 0.5;
  detritosPositions[i * 3] = Math.cos(angle) * radius;
  detritosPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
  detritosPositions[i * 3 + 2] = Math.sin(angle) * radius;
}
detritosGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(detritosPositions, 3)
);
const detritosMaterial = new THREE.PointsMaterial({
  color: 0xff99cc,
  size: 0.1,
});
const detritosRing = new THREE.Points(detritosGeometry, detritosMaterial);
scene.add(detritosRing);

// === Detritos clicáveis (sprites com imagem) ===
const detritosData = [
  {
    nome: "Dia do Donnut",
    conteudo: "Em uma semana incrível, um dia incrível surgiu! ",
    icone: "../../texturas/foto.png",
  },
  {
    nome: "Taylor Swift",
    conteudo:
      "🎤 Icônica, Fantástica, Taylor é um nome que soa infinito, mesmo sem tantas letras. Um conforto em forma de música, isso que a famosa 'Tay Tay', traz para a vida da Bruna.",
    icone: "../../texturas/taylor.png",
  },
  {
    nome: "Brooklyn Nine-Nine",
    conteudo:
      "B99 nunca precisou de risada de fundo pra ser engraçado. 8 temporadas apenas, mas infinitos momentos icônicos! Pra não de perder, precisamos de pastas para nos organizar, assim como a Amy, que tem pastas para tudo... Até para organizar um planeta como esse.",
    icone: "../../texturas/b99.png",
  },
  {
    nome: "Bruna + Gustavo",
    conteudo:
      "Cartas, quadros, presentes feitos à mão, todas as coisas que transformam cada dia e como encontro, num encontro especial. Sempre com um toquezinho a mais de Bruna ou de Gustavo, Às vezes dos dois...",
    icone: "../../texturas/bg.png",
  },
  {
    nome: "Patos",
    conteudo:
      "☕ Uma sexta-feira incrível como várias outras, filmes, batatas fritas e nuggets. mas além disso... PATOS! PATOS, PATOS e mais PATOS! A criação de dois bichinhos rechonchudos e fofinhos, que infelizmente moreram logo depois.",
    icone: "../../texturas/ducks.png",
  },
  {
    nome: "Pecorino",
    conteudo:
      "☕ 1 ANO DA GENTE! Um dia maravilhoso, comida maravilhosa, e um careca gentil. Um usuário e uma senha, que deram luz a um documentário completo sobre todo esse relacionamento.",
    icone: "../../texturas/pecorino.png",
  },
  {
    nome: "Aliança",
    conteudo:
      "25.10.2023 - Difícil definir e expressar os sentimentos daquele momento. Um anel que representa tanto, o dia que finalmente pudemos dizer que somos namorados.",
    icone: "../../texturas/anel.png",
  },
  {
    nome: "São Paulo",
    conteudo:
      " Time do coração, não da pra mudar, você nasce assim, você sorri, chora, sofre, e por muitas vezes é muito zoado, mas você não pode largar...",
    icone: "../../texturas/SP.png",
  },
  {
    nome: "Enrolados",
    conteudo:
      " Pascal e Maximus não falam, mas entendem mais que muita gente. Às vezes, o mundo só se revela quando a gente decide sair da janela. Assim como a coragem de se dizer que você gosta de alguém.",
    icone: "../../texturas/enrolados.png",
  },
  {
    nome: "Grupo de Tulipas",
    conteudo:
      "Flores lindas e maravilhosas, o sonho de toda garota, não é mesmo?",
    icone: "../../texturas/tulipas.png",
  },
  {
    nome: "Nós",
    conteudo: "Nóis, só nóis mesmo.",
    icone: "../../texturas/nos.png",
  },
  {
    nome: "Feijoada",
    conteudo:
      "Feijão. Será que tem como alguém não gostar de feijão, mas amar uma feijoada? Isso não é possivel, né? Né?",
    icone: "../../texturas/feijoada.png",
  },
  {
    nome: "Voleibol",
    conteudo:
      "Esporte favorito da Bruna,  um grande atleta, sem investimento porém, com toda certeza",
    icone: "../../texturas/volei.png",
  },
  {
    nome: "Namorado",
    conteudo:
      "Gustavo Ramos Caetano, namorado da Bruna, o amor da vida dela, e a pessoa que mais ama ela no mundo. o parceirinho dela, e sem dúvidas a pessoa que vai passar o resto da vida com ela!",
    icone: "../../texturas/gugu.png",
  },
];

const detritosSprites = [];
detritosData.forEach((item, i) => {
  const angle = (i / detritosData.length) * Math.PI * 2;
  const radius = 5;

  const spriteTexture = textureLoader.load(item.icone);
  const spriteMaterial = new THREE.SpriteMaterial({ map: spriteTexture });
  const sprite = new THREE.Sprite(spriteMaterial);

  sprite.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  sprite.scale.set(1.0, 1.0, 1.0);

  sprite.userData = { nome: item.nome, conteudo: item.conteudo };
  scene.add(sprite);
  detritosSprites.push(sprite);
});

// === Tooltip ===
const tooltip = document.createElement("div");
tooltip.style.position = "absolute";
tooltip.style.background = "rgba(0,0,0,0.7)";
tooltip.style.color = "white";
tooltip.style.padding = "6px 10px";
tooltip.style.borderRadius = "8px";
tooltip.style.fontSize = "14px";
tooltip.style.display = "none";
tooltip.style.pointerEvents = "none";
document.body.appendChild(tooltip);

// === Raycaster ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(detritosSprites, true);

  if (intersects.length > 0) {
    const detrito = intersects[0].object;
    tooltip.style.display = "block";
    tooltip.style.left = event.clientX + 10 + "px";
    tooltip.style.top = event.clientY + 10 + "px";
    tooltip.innerHTML = detrito.userData.nome;
  } else {
    tooltip.style.display = "none";
  }
  if (intersects.length > 0) {
    const detrito = intersects[0].object;
    detrito.scale.set(1.3, 1.3, 1.3); // cresce ao passar o mouse
    tooltip.style.display = "block";
  } else {
    detritosSprites.forEach((s) => s.scale.set(1.0, 1.0, 1.0)); // volta ao normal
    tooltip.style.display = "none";
  }
});

// === Clique abre modal ===
const modal = document.getElementById("infoModal");
const fechar = document.getElementById("fechar");
const infoContent = document.getElementById("infoContent");

function abrirModal(texto) {
  infoContent.innerHTML = texto;
  modal.style.display = "flex";
}
fechar.onclick = () => (modal.style.display = "none");
window.onclick = (event) => {
  if (event.target === modal) modal.style.display = "none";
};

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(detritosSprites, true);

  if (intersects.length > 0) {
    const detrito = intersects[0].object;
    abrirModal(detrito.userData.conteudo);
  }
});

// === Controles ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === Purpurina cósmica (partículas cristalinas ao redor do planeta) ===
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 10000;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const radius = 6 + Math.random() * 6; // distância do planeta (6 a 12)
  const theta = Math.random() * Math.PI * 2; // ângulo horizontal
  const phi = Math.acos(2 * Math.random() - 1); // ângulo vertical

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xff99cc,
  size: 0.08,
  // transparent: true,
  opacity: 1,
  blending: THREE.AdditiveBlending,
});
const purpurina = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(purpurina);

// === Atmosfera animada em volta do planeta ===
const atmosferaGeometry = new THREE.SphereGeometry(3.2, 64, 64);
const atmosferaMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.6 - dot(vNormal, vec3(0.0,0.0,1.0)), 2.0);
      float pulse = 0.5 + 0.5 * sin(time * 2.0);
      vec3 color = mix(vec3(1.0, 0.5, 0.8), vec3(0.7,0.2,1.0), pulse);
      gl_FragColor = vec4(color, intensity * 1.5);
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
});
const atmosfera = new THREE.Mesh(atmosferaGeometry, atmosferaMaterial);
scene.add(atmosfera);

// === Variável para tempestade/calmaria ===
let stormPhase = 0;

// === Loop de animação ===
function animate() {
  requestAnimationFrame(animate);

  planeta.rotation.y += 0.002;
  ring.rotation.z += 0.001;
  stars.rotation.y += 0.0005;
  detritosRing.rotation.y += 0.001; // anel de partículas gira
  detritosSprites.forEach((sprite) => {
    sprite.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.001); // sprites giram junto
  });

  controls.update();
  renderer.render(scene, camera);

  // === Purpurina gira lentamente ===
  purpurina.rotation.y += 0.0008;

  // === Atmosfera pulsando (tempestade/calmaria) ===
  atmosferaMaterial.uniforms.time.value += 0.02;

  stormPhase += 0.02;
  const stormIntensity = (Math.sin(stormPhase) + 1) / 2; // 0 → 1
  particlesMaterial.opacity = 0.3 + stormIntensity * 0.7;
}

animate();

// === Resize ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
