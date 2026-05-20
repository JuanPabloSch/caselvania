import Player from './Player.js';
import Enemy from './Enemy.js';

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

        // Balas
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xcccccc, 1);
        graphics.fillRect(0, 0, 12, 6);
        graphics.fillStyle(0x888888, 1);
        graphics.fillRect(0, 5, 12, 1);
        graphics.generateTexture('bullet_texture', 12, 6);
        this.bullets = this.physics.add.group({ allowGravity: false });

        this.player = new Player(this, 100, 200);

        // Piso
        this.floor = this.add.zone(0, 540, 12000, 60).setOrigin(0);
        this.physics.add.existing(this.floor, true); 
        this.physics.add.collider(this.player, this.floor);

        // Enemigos
        this.enemies = this.physics.add.group();
        this.enemies.add(new Enemy(this, 600, 400, 150));
        this.enemies.add(new Enemy(this, 1200, 400, 200));
        this.enemies.add(new Enemy(this, 2500, 400, 300));

        this.physics.add.collider(this.enemies, this.floor);

        // --- COLISIONES Y DAÑO ---
        // Balas matan enemigos
        this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
            bullet.destroy();
            enemy.destroy();
        });

        // Enemigos dañan al jugador
        this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
            player.takeDamage(enemy); // ← Le pasamos el "enemy" acá adentro
        });
        
        // -------------------------

        // --- DISEÑO DE LA BARRA DE VIDA (ESTILO CASTLEVANIA) ---
        // Creamos un contenedor estático para la interfaz
        this.healthBars = [];
        this.createHealthBarUI();
        // --------------------------------------------------------

        this.cameras.main.setBounds(0, 0, 12000, 600);
        this.cameras.main.startFollow(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    createHealthBarUI() {
        // Dibujamos 5 rectangulitos pegados uno al lado del otro
        // Cada bloque mide 10 píxeles de ancho y 24 de alto, separados por 4 píxeles.
        for (let i = 0; i < 5; i++) {
            let xPos = 20 + (i * 14); // 20px de margen izquierdo + espaciado
            let yPos = 20;            // 20px de margen superior

            // Rectángulo de fondo gris oscuro (la vida vacía)
            let bgBar = this.add.rectangle(xPos, yPos, 10, 24, 0x444444).setOrigin(0).setScrollFactor(0);
            
            // Rectángulo de vida activa (rojo clásico)
            let activeBar = this.add.rectangle(xPos, yPos, 10, 24, 0xff0000).setOrigin(0).setScrollFactor(0);
            
            // Guardamos la barra activa en un array para poder ocultarla cuando reciba daño
            this.healthBars.push(activeBar);
        }
    }

    updateHealthBar() {
        // Recorremos las barras visuales y apagamos las que superen la vida actual de Benedict
        for (let i = 0; i < this.healthBars.length; i++) {
            if (i >= this.player.health) {
                this.healthBars[i].setVisible(false); // Apaga el rectangulito rojo
            } else {
                this.healthBars[i].setVisible(true);
            }
        }
    }

    update() {
        this.player.update(this.cursors, this.spaceKey);

        this.enemies.getChildren().forEach(enemy => {
            enemy.update();
        });

        this.bg1.tilePositionX = this.cameras.main.scrollX * 0.2;
        this.bg2.tilePositionX = this.cameras.main.scrollX * 0.5;

        this.bullets.getChildren().forEach(bullet => {
            if (bullet.x > this.cameras.main.scrollX + 800 || bullet.x < this.cameras.main.scrollX) {
                bullet.destroy();
            }
        });
    }
}