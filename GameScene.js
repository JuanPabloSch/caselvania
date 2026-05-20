import Player from './Player.js';

export default class GameScene extends Phaser.Scene {
    preload() {
        this.load.image('fondo1', 'fondo1.png');
        this.load.image('fondo2', 'fondo2.png');
        
        // Cargamos el spritesheet con el tamaño de CADA frame (150x134)
        this.load.spritesheet('benedict_walk', 'benedict_walk.png', { 
            frameWidth: 150, 
            frameHeight: 134 
        });
    }

    create() {
        this.physics.world.setBounds(0, 0, 12000, 600);

        this.bg1 = this.add.tileSprite(0, 0, 800, 600, 'fondo1').setOrigin(0).setScrollFactor(0);
        this.bg2 = this.add.tileSprite(0, 0, 800, 600, 'fondo2').setOrigin(0).setScrollFactor(0);

        // Creamos la animación de caminar
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('benedict_walk', { start: 0, end: 4 }),
            frameRate: 6, // ← BAJAMOS ESTE VALOR (Estaba en 10). Menos frames por segundo = animación más lenta.
            repeat: -1     
        });

        // Posicionamos a Benedict un poco más arriba para que no se caiga por su nueva altura
        this.player = new Player(this, 100, 400);

        this.cameras.main.setBounds(0, 0, 12000, 600);
        this.cameras.main.startFollow(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.player.update(this.cursors);

        this.bg1.tilePositionX = this.cameras.main.scrollX * 0.2;
        this.bg2.tilePositionX = this.cameras.main.scrollX * 0.5;
    }
}