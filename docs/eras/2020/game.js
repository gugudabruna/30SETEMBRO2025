// === SEU CÓDIGO COMPLETO (ATUALIZADO) ===
let game = null;

function openGameModal() {
  openModal("modalGame");

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

class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image("sky", "../../imagens/subconciente.jpg");
    this.load.image("door", "../../imagens/portal.png");

    // Ursinho
    this.load.image("bear_static", "../../sprites/miks/static.png");
    this.load.image("bear_walk1", "../../sprites/miks/walk1.png");
    this.load.image("bear_walk2", "../../sprites/miks/walk2.png");
    this.load.image("bear_walk3", "../../sprites/miks/walk3.png");
    this.load.image("bear_walk4", "../../sprites/miks/walk4.png");

    this.load.image("bruna", "../../imagens/kitty-bruna1.png");
    this.load.image("kitty", "../../imagens/kitty-bruna2.png");
    this.load.image("foto3", "../../imagens/kitty-bruna3.png");

    // Bombas
    this.load.image("bomb1", "../../imagens/bombaclara.png");
    this.load.image("bomb2", "../../imagens/bombalidia.png");

    // Plataforma simples (um bloco)
    this.load.image("ground", "../../imagens/ground.png");

    this.load.image("heart_full", "../..//imagens/heart_full.png");
    this.load.image("heart_empty", "../../imagens/heart_empty.png");
  }

  create() {
    const worldW = 4000;
    const worldH = 600;

    this.add
      .image(worldW / 2, worldH / 2, "sky")
      .setDisplaySize(worldW, worldH);
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // chão
    this.ground = this.add.rectangle(
      worldW / 2,
      worldH - 50,
      worldW,
      100,
      0x000000,
      0
    );
    this.physics.add.existing(this.ground, true);

    // plataformas
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(600, 450, "ground").setScale(2, 0.5).refreshBody();
    this.platforms.create(1000, 300, "ground").setScale(1, 0.5).refreshBody();
    this.platforms.create(1500, 200, "ground").setScale(1.5, 0.5).refreshBody();
    this.platforms.create(2000, 400, "ground").setScale(2, 0.5).refreshBody();
    this.platforms.create(2500, 250, "ground").setScale(1, 0.5).refreshBody();
    this.platforms.create(3200, 350, "ground").setScale(2, 0.5).refreshBody();

    // player
    this.player = this.physics.add.sprite(100, worldH - 150, "bear_static");
    this.player.setScale(1.5);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.platforms);

    // label
    this.nameLabel = this.add
      .text(this.player.x, this.player.y - 80, "KITTY 🐻", {
        fontFamily: "Press Start 2P",
        fontSize: "14px",
        color: "#fff",
        stroke: "#000",
        strokeThickness: 1.5,
      })
      .setOrigin(0.5)
      .setScale(2);

    // animações
    this.anims.create({
      key: "right",
      frames: [{ key: "bear_walk1" }, { key: "bear_walk2" }],
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "left",
      frames: [{ key: "bear_walk3" }, { key: "bear_walk4" }],
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "bear_static" }],
      frameRate: 20,
    });

    // bombas
    this.bombs = this.physics.add.group();
    this.physics.add.overlap(this.player, this.bombs, this.hitBomb, null, this);

    // controles teclado e mobile (mesmo do seu código)
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // câmera
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // vidas
    this.lives = 3;
    this.lifeIcons = [];
    for (let i = 0; i < 3; i++) {
      const heart = this.add
        .image(40 + i * 40, 40, "heart_full")
        .setScale(0.08)
        .setScrollFactor(0);
      this.lifeIcons.push(heart);
    }

    // spawn bombas
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnBomb,
      callbackScope: this,
      loop: true,
    });

    // safe zone + portal
    this.safeZoneX = worldW - 300;
    this.add
      .rectangle(this.safeZoneX, worldH - 100, 600, 200, 0x00ff00, 0.2)
      .setDepth(0);
    this.portal = this.physics.add
      .sprite(worldW - 150, worldH - 150, "door")
      .setScale(1.2)
      .setDepth(1);

    this.portal.body.allowGravity = false;
    this.portal.body.immovable = true;

    // controle de overlay
    this.uiOpen = false;
    this.physics.add.overlap(
      this.player,
      this.portal,
      this.showInternalOverlay,
      null,
      this
    );
  }

  update() {
    const acceleration = 100;
    const jumpPower = -450;

    if (
      this.cursors.left.isDown ||
      this.keys.left.isDown ||
      this.mobileInput?.left
    ) {
      this.player.setAccelerationX(-acceleration);
      this.player.anims.play("left", true);
    } else if (
      this.cursors.right.isDown ||
      this.keys.right.isDown ||
      this.mobileInput?.right
    ) {
      this.player.setAccelerationX(acceleration);
      this.player.anims.play("right", true);
    } else {
      this.player.setAccelerationX(0);
      this.player.setVelocityX(this.player.body.velocity.x * 0.9);
      this.player.anims.play("turn");
    }

    if (
      (this.cursors.up.isDown ||
        this.cursors.space.isDown ||
        this.keys.up.isDown ||
        this.mobileInput?.up) &&
      this.player.body.touching.down
    ) {
      this.player.setVelocityY(jumpPower);
    }

    this.nameLabel.setPosition(this.player.x, this.player.y - 80);
  }

  // === NOVO: Overlay interno do Phaser ===
  showInternalOverlay() {
    if (this.uiOpen) return;
    this.uiOpen = true;
  
    this.player.setVelocity(0, 0);
    this.player.body.enable = false;
    this.bombs.children.each((b) => (b.body.enable = false));
  
    const w = this.cameras.main.width * 0.8;
    const h = this.cameras.main.height * 0.8;
    const x = (this.cameras.main.width - w) / 2;
    const y = (this.cameras.main.height - h) / 2;
  
    // Fundo mais claro, quase transparente, estilo céu
    this.overlayBg = this.add.graphics().setScrollFactor(0).setDepth(10);
    this.overlayBg.fillStyle(0xb3e5fc, 0.7); // azul claro + 70% opacidade
    this.overlayBg.fillRoundedRect(x, y, w, h, 25);
  
    // Borda bem suave
    this.border = this.add.graphics().setScrollFactor(0).setDepth(11);
    this.border.lineStyle(4, 0xffffff, 0.6);
    this.border.strokeRoundedRect(x, y, w, h, 25);
  
    // Lista de imagens
    const images = ["bruna", "kitty", "foto3"];
    const spacing = w / (images.length + 1);
  
    const previews = images.map((key, index) => {
      const posX = x + spacing * (index + 1);
      const posY = y + h / 2;
  
      // Pequenas bolinhas
      const circle = this.add.circle(posX, posY, 12, 0xffffff)
        .setScrollFactor(0)
        .setDepth(12)
        .setAlpha(0.8)
        .setInteractive({ useHandCursor: true });
  
      // Imagens invisíveis no início
      const img = this.add.image(posX, posY, key)
        .setDisplaySize(10, 10)
        .setAlpha(0)
        .setDepth(12)
        .setScrollFactor(0);
  
      // Efeito de hover/click
      circle.on("pointerover", () => {
        this.tweens.add({
          targets: img,
          alpha: 1,
          displayWidth: 180,
          displayHeight: 180,
          duration: 400,
          ease: "Back.Out",
          onUpdate: () => img.setTint(0xffffff) // garante que fique bem visível
        });
        this.tweens.add({ targets: circle, alpha: 0, duration: 200 });
      });
  
      circle.on("pointerout", () => {
        this.tweens.add({
          targets: img,
          alpha: 0,
          displayWidth: 10,
          displayHeight: 10,
          duration: 300,
          ease: "Back.In"
        });
        this.tweens.add({ targets: circle, alpha: 0.8, duration: 200 });
      });
  
      return { circle, img };
    });
  
    // Botão de fechar com contraste melhor
    this.overlayClose = this.add.text(
      x + w / 2,
      y + h - 40,
      "☁ FECHAR ☁",
      {
        fontFamily: "Press Start 2P",
        fontSize: "16px",
        color: "#0d47a1", // azul escuro para contraste
        backgroundColor: "#ffffff",
        padding: { x: 14, y: 8 }
      }
    )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive()
      .setDepth(12);
  
    this.overlayClose.on("pointerdown", () => {
      this.overlayBg.destroy();
      this.border.destroy();
      previews.forEach(p => {
        p.circle.destroy();
        p.img.destroy();
      });
      this.overlayClose.destroy();
  
      this.uiOpen = false;
      this.player.body.enable = true;
      this.bombs.children.each((b) => (b.body.enable = true));
    });
  }
  
  
  

  spawnBomb() {
    if (this.player.x > this.safeZoneX - 200) return;

    const worldH = 600;
    const possibleHeights = [worldH - 120, worldH - 250, worldH - 350];

    // 50% chance de não spawnar nada, 50% chance de 1 bomba
    const numBombs = Phaser.Math.Between(0, 1);

    for (let i = 0; i < numBombs; i++) {
      const y = Phaser.Utils.Array.GetRandom(possibleHeights);
      const x = Phaser.Math.Between(1800, 3200);
      const texture = Phaser.Math.Between(0, 1) ? "bomb1" : "bomb2";

      const bomb = this.bombs.create(x, y, texture);

      bomb.setVelocityX(-Phaser.Math.Between(150, 300));
      bomb.setScale(texture === "bomb1" ? 0.2 : 0.25);
      bomb.body.allowGravity = false;
      bomb.checkWorldBounds = true;
      bomb.outOfBoundsKill = true;
    }

    // intervalo maior e escalonado
    let delay = Phaser.Math.Between(4000, 6000);

    if (this.player.x > this.safeZoneX - 1000) {
      delay = Phaser.Math.Between(6000, 9000);
    }

    this.time.addEvent({
      delay: delay,
      callback: this.spawnBomb,
      callbackScope: this,
      loop: false,
    });
  }

  hitBomb(player, bomb) {
    bomb.destroy();
    this.lives--;

    // Atualiza os corações
    this.updateLivesUI();

    // efeito de dano (urso vermelho por 200ms)
    this.player.setTint(0xff0000);
    this.time.delayedCall(200, () => {
      this.player.clearTint();
    });

    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  // Tela de Game Over
  gameOver() {
    // desativa player e bombas
    this.player.setTint(0xff0000);
    this.player.setVelocity(0, 0);
    this.player.body.enable = false;
    this.bombs.clear(true, true);

    // fundo preto cobrindo toda a tela
    const overlay = this.add
      .rectangle(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.85
      )
      .setOrigin(0, 0)
      .setScrollFactor(0);

    // texto grande no meio estilo GTA
    this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        "GAME OVER",
        {
          fontFamily: "Press Start 2P",
          fontSize: "72px", // base menor
          color: "#ff0000",
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setScale(5); // aumenta no olho

    // instrução para reiniciar
    this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + 100,
        "Clique para reiniciar",
        {
          fontFamily: "Press Start 2P",
          fontSize: "20px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setScale(3); // aumenta no olho

    // agora sim o input funciona
    this.input.once("pointerdown", () => {
      this.scene.restart();
    });
  }

  // Atualiza corações
  updateLivesUI() {
    for (let i = 0; i < this.lifeIcons.length; i++) {
      if (i < this.lives) {
        this.lifeIcons[i].setTexture("heart_full");
      } else {
        this.lifeIcons[i].setTexture("heart_empty");
      }
    }
  }
}
