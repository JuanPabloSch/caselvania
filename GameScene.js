import Player from './Player.js';

export default class GameScene extends Phaser.Scene {
    preload() {
        this.load.image('fondo1', 'fondo1.png');
        this.load.image('fondo2', 'fondo2.png');
    }

    create() {
        this.physics.world.setBounds(0, 0, 12000, 600);

        // Parallax: scrollFactor 0 los mantiene fijos a la cámara
        this.bg1 = this.add.tileSprite(0, 0, 800, 600, 'fondo1').setOrigin(0).setScrollFactor(0);
        this.bg2 = this.add.tileSprite(0, 0, 800, 600, 'fondo2').setOrigin(0).setScrollFactor(0);

        this.player = new Player(this, 100, 500);

        this.cameras.main.setBounds(0, 0, 12000, 600);
        this.cameras.main.startFollow(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.player.update(this.cursors);

        // Movimiento de las texturas para el efecto parallax
        this.bg1.tilePositionX = this.cameras.main.scrollX * 0.2; // Fondo lejano (lento)
        this.bg2.tilePositionX = this.cameras.main.scrollX * 0.5; // Fondo cercano (rápido)
    }
}