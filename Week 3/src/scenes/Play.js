class Play extends Phaser.Scene {
  constructor() {
    super('playScene');
  }

  preload() {
    this.load.image('rocket', './assets/rocket.png');
    this.load.image('spaceship', './assets/spaceship.png');
    this.load.image('starfield', './assets/starfield.png');
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
  }

  update () {
    this.starfield.tilePositionX -= 4;
  }
}