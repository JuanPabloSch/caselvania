import Player from './Player.js';

export default class GameScene extends Phaser.Scene {
    preload() {
        this.load.image('fondo1', 'fondo1.png');
        this.load.image('fondo2', 'fondo2.png');
        this.load.spritesheet('benedict_walk', 'benedict_walk.png', { 
            frameWidth: 150, 
            frameHeight: 134 
        });
    }

    create() {
        // El mundo mide 12000x600
        this.physics.world.setBounds(0, 0, 12000, 600);

        this.bg1 = this.add.tileSprite(0, 0, 800, 600, 'fondo1').setOrigin(0).setScrollFactor(0);
        this.bg2 = this.add.tileSprite(0, 0, 800, 600, 'fondo2').setOrigin(0).setScrollFactor(0);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('benedict_walk', { start: 0, end: 4 }),
            frameRate: 6, 
            repeat: -1     
        });

        // Instanciamos al jugador (lo ponemos arriba para que caiga al piso)
        this.player = new Player(this, 100, 200);

        // --- PISO INVISIBLE ---
        // Ponemos el piso abajo de todo (en Y = 540, porque 600 - 60 de alto = 540)
        // El tamaño es de 12000 de largo por 60 de alto
        this.floor = this.add.zone(0, 540, 12000, 60).setOrigin(0);
        
        // Le añadimos físicas estáticas (para que no se caiga por la gravedad)
        this.physics.add.existing(this.floor, true); 

        // Hacemos que Benedict colisione con el piso invisible
        this.physics.add.collider(this.player, this.floor);
        // ----------------------

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