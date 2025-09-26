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
    this.load.image("sky", "/30SET/imagens/subconciente.jpg");
    this.load.image("door", "/30SET/imagens/portal.png");

    // Ursinho
    this.load.image("bear_static", "/30SET/sprites/miks/static.png");
    this.load.image("bear_walk1", "/30SET/sprites/miks/walk1.png");
    this.load.image("bear_walk2", "/30SET/sprites/miks/walk2.png");
    this.load.image("bear_walk3", "/30SET/sprites/miks/walk3.png");
    this.load.image("bear_walk4", "/30SET/sprites/miks/walk4.png");

    // Bombas
    this.load.image("bomb1", "/30SET/imagens/bombaclara.png");
    this.load.image("bomb2", "/30SET/imagens/bombalidia.png");

    // Plataforma simples (um bloco)
    this.load.image("ground", "/30SET/imagens/ground.png");
  }

  create() {
    const worldW = 4000; // mapa mais longo
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

    // plataformas estilo Mario
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(600, 450, "ground").setScale(2, 0.5).refreshBody();
    this.platforms.create(1000, 300, "ground").setScale(1, 0.5).refreshBody();
    this.platforms.create(1500, 200, "ground").setScale(1.5, 0.5).refreshBody();
    this.platforms.create(2000, 400, "ground").setScale(2, 0.5).refreshBody();
    this.platforms.create(2500, 250, "ground").setScale(1, 0.5).refreshBody();
    this.platforms.create(3200, 350, "ground").setScale(2, 0.5).refreshBody();

    // player (urso maior que bomba)
    this.player = this.physics.add.sprite(100, worldH - 150, "bear_static");
    this.player.setScale(1.5); // Kitty maior
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
        strokeThickness: 3,
      })
      .setOrigin(0.5);

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

    // grupo das bombas
    this.bombs = this.physics.add.group();

    // colisão com bombas
    this.physics.add.overlap(this.player, this.bombs, this.hitBomb, null, this);

    // controles
    this.cursors = this.input.keyboard.createCursorKeys();

    // câmera
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // vidas
    this.lives = 3;
    this.livesText = this.add
      .text(16, 16, "Vidas: 3", {
        fontFamily: "Press Start 2P",
        fontSize: "12px",
        color: "#fff",
      })
      .setScrollFactor(0);

    // spawn de bombas
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnBomb,
      callbackScope: this,
      loop: true,
    });

    // safe zone e portal no final do mapa
    this.safeZoneX = worldW - 300;
    this.add.rectangle(this.safeZoneX, worldH - 100, 600, 200, 0x00ff00, 0.2);

    this.portal = this.physics.add
      .sprite(worldW - 150, worldH - 200, "door")
      .setScale(0.5);
    this.physics.add.existing(this.portal, true);
    this.physics.add.overlap(this.player, this.portal, () => {
      openModal("modalInfo");
      document.getElementById("infoTitle").innerText = "Kitty 💖 Bruna";
      document.getElementById("infoBody").innerHTML = `
        <img src="/30SET/imagens/kitty-bruna1.png" width="300" />
        <img src="/30SET/imagens/kitty-bruna2.png" width="300" />
      `;
    });
  }

  update() {
    const acceleration = 600;
    const jumpPower = -450;

    // Movimento
    if (this.cursors.left.isDown) {
      this.player.setAccelerationX(-acceleration);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setAccelerationX(acceleration);
      this.player.anims.play("right", true);
    } else {
      this.player.setAccelerationX(0);
      this.player.setVelocityX(this.player.body.velocity.x * 0.9);
      this.player.anims.play("turn");
    }

    // Pulo estilo Mario
    if (
      (this.cursors.up.isDown || this.cursors.space.isDown) &&
      this.player.body.touching.down
    ) {
      this.player.setVelocityY(jumpPower);
    }

    // Abaixar estilo Mario
    if (this.cursors.down.isDown && this.player.body.touching.down) {
      this.player.setScale(1.5, 1.0); // mantém Kitty maior
      this.player.body.setSize(this.player.width, this.player.height * 0.7);
      this.player.body.setOffset(0, this.player.height * 0.3);
    } else {
      this.player.setScale(1.5, 1.5);
      this.player.body.setSize(this.player.width, this.player.height);
      this.player.body.setOffset(0, 0);
    }

    // label segue o player
    this.nameLabel.setPosition(this.player.x, this.player.y - 80);
  }

  spawnBomb() {
    if (this.player.x > this.safeZoneX - 100) return;

    const worldH = 600;

    // alturas possíveis
    const possibleHeights = [worldH - 120, worldH - 250, worldH - 350];

    // --- Bomba Clara ---
    const y1 = Phaser.Utils.Array.GetRandom(possibleHeights);
    const bomb1 = this.bombs.create(2200, y1, "bomb1");
    bomb1.setVelocityX(-Phaser.Math.Between(200, 300));
    bomb1.setScale(0.3);
    bomb1.body.allowGravity = false;

    // --- Bomba Lídia ---
    const y2 = Phaser.Utils.Array.GetRandom(possibleHeights);
    const bomb2 = this.bombs.create(2400, y2, "bomb2");
    bomb2.setVelocityX(-Phaser.Math.Between(250, 350));
    bomb2.setScale(0.4);
    bomb2.body.allowGravity = false;

    // destruir quando saírem da tela
    bomb1.checkWorldBounds = true;
    bomb1.outOfBoundsKill = true;

    bomb2.checkWorldBounds = true;
    bomb2.outOfBoundsKill = true;
  }

  hitBomb(player, bomb) {
    bomb.destroy();
    this.lives--;
    this.livesText.setText("Vidas: " + this.lives);

    if (this.lives <= 0) {
      this.physics.pause();
      this.player.setTint(0xff0000);

      // fundo preto cobrindo tela
      this.add.rectangle(
        this.cameras.main.midPoint.x,
        this.cameras.main.midPoint.y,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.8
      ).setScrollFactor(0);

      // texto grande no meio
      this.add.text(
        this.cameras.main.midPoint.x,
        this.cameras.main.midPoint.y,
        "GAME OVER\nClique para reiniciar",
        {
          fontFamily: "Press Start 2P",
          fontSize: "48px",
          color: "#fff",
          align: "center"
        }
      ).setOrigin(0.5).setScrollFactor(0);

      this.input.once("pointerdown", () => {
        this.scene.restart();
      });
    }
  }
}
