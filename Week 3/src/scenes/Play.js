class Play extends Phaser.Scene {
  constructor() {
    super('playScene');
  }

  preload() {
    this.load.image('rocket', './assets/rocket.png');
    this.load.image('spaceship', './assets/spaceship.png');
    this.load.image('starfield', './assets/starfield.png');
    this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
  }
  
  create() {
    // place tile sprite
    this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
    
    // green UI background
    this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00ff00).setOrigin(0, 0);
    // top white border
    this.add.rectangle(0, 0, game.config.width, borderUISize, 0xffffff).setOrigin(0, 0);
    // bottom white border
    this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xffffff).setOrigin(0, 0);
    // left white border
    this.add.rectangle(0, 0, borderUISize, game.config.height, 0xffffff).setOrigin(0, 0);
    // right white border
    this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height,  0xffffff).setOrigin(0, 0);

    // add rocket (p1)
    this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

    // add spaceships (x3)
    this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0,0);
    this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0,0);
    this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0,0);

    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
      frameRate: 30
    });

    // initialize score
    this.p1Score = 0;

    // display score
    let scoreConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#F3B141',
      color: '#843695',
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 100
    }

    this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);

    // GAME OVER flag
    this.gameOver = false;

    // 60 second play clock
    scoreConfig.fixedWidth = 0;
    this.clock = this.time.delayedCall(69000, () => {
      this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
      this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart', scoreConfig).setOrigin(0.5);
      this.gameOver = true;
    }, null, this);
  }

  update () {
    // check key input for restart
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
      this.scene.restart();
    }

    this.p1Rocket.update();
    this.starfield.tilePositionX -= 4;
    this.ship01.update();
    this.ship02.update();
    this.ship03.update();

    if (this.checkCollision(this.p1Rocket, this.ship03)) {
      this.p1Rocket.reset();
      this.shipExplode(this.ship03);
    }
    if (this.checkCollision(this.p1Rocket, this.ship02)) {
      this.p1Rocket.reset();
      this.shipExplode(this.ship02);
    }
    if (this.checkCollision(this.p1Rocket, this.ship01)) {
      this.p1Rocket.reset();
      this.shipExplode(this.ship01);
    }
  }

  checkCollision(rocket, ship) {
    if (rocket.x < ship.x + ship.width &&
      rocket.x + rocket.width > ship.x &&
      rocket.y < ship.y + ship.height &&
      rocket.height + rocket.y > ship.y) {
      return true;
    } else {
      return false;
    }

    if (!this.gameOver) {
      this.p1Rocket.update();
      this.ship01.update();
      this.ship02.update();
      this.ship03.update();
    }
  }

  shipExplode(ship) {
    // temporarily hide ship
    ship.alpha = 0;

    // create explosion sprite at ship's pos
    let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);

    // play explode animation
    boom.anims.play('explode');

    // callback after anim
    boom.on('animationcomplete', () => { // callback after anim completes
      ship.reset(); // reset ship position
      ship.alpha = 1; // make ship visible again
      boom.destroy(); // remove explosion sprite
    });

    // score add and repaint
    this.p1Score += ship.points;
    this.scoreLeft.text = this.p1Score;
  }
}