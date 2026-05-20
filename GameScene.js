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
        this.physics.world.setBounds(0, 0, 12000, 600);

        this.bg1 = this.add.tileSprite(0, 0, 800, 600, 'fondo1').setOrigin(0).setScrollFactor(0);
        this.bg2 = this.add.tileSprite(0, 0, 800, 600, 'fondo2').setOrigin(0).setScrollFactor(0);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('benedict_walk', { start: 0, end: 4 }),
            frameRate: 6, 
            repeat: -1     
        });

        // --- GRUPO DE BALAS ---
        // --- REDISEÑO DE LA BALA (PLATEADA) ---
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Color base: Gris claro/plateado (0xcccccc)
        graphics.fillStyle(0xcccccc, 1);
        graphics.fillRect(0, 0, 12, 6);

        // Opcional: Una pequeña línea plateada oscura abajo para darle relieve metálico
        graphics.fillStyle(0x888888, 1);
        graphics.fillRect(0, 5, 12, 1); // Línea de sombra de 1 píxel de alto

        graphics.generateTexture('bullet_texture', 12, 6);
        // --------------------------------------

        // Creamos el grupo físico para las balas
        this.bullets = this.physics.add.group({
            allowGravity: false // Las balas de Castlevania no suelen caer por gravedad
        });
        // ----------------------

        this.player = new Player(this, 100, 200);

        this.floor = this.add.zone(0, 540, 12000, 60).setOrigin(0);
        this.physics.add.existing(this.floor, true); 
        this.physics.add.collider(this.player, this.floor);

        this.cameras.main.setBounds(0, 0, 12000, 600);
        this.cameras.main.startFollow(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();
        
        // MAPEADO DE LA BARRA ESPACIADORA
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        // Le pasamos también la barra espaciadora al update del jugador
        this.player.update(this.cursors, this.spaceKey);

        this.bg1.tilePositionX = this.cameras.main.scrollX * 0.2;
        this.bg2.tilePositionX = this.cameras.main.scrollX * 0.5;

        // Limpieza: Destruir las balas que se salen de la pantalla para no saturar la memoria
        this.bullets.getChildren().forEach(bullet => {
            if (bullet.x > this.cameras.main.scrollX + 800 || bullet.x < this.cameras.main.scrollX) {
                bullet.destroy();
            }
        });
    }
}