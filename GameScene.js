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

        this.load.spritesheet('sebihead', 'sebihead.png', {
        frameWidth: 80,
        frameHeight: 80
        });
        this.load.image('benedict_dead', 'benedict_dead.png');
        this.load.image('benedict_duck', 'benedict_duck.png'); // Imagen de 150x90
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

        // Balas de plata de Benedict
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xcccccc, 1);
        graphics.fillRect(0, 0, 12, 6);
        graphics.fillStyle(0x888888, 1);
        graphics.fillRect(0, 5, 12, 1);
        graphics.generateTexture('bullet_texture', 12, 6);
        this.bullets = this.physics.add.group({ allowGravity: false });

        // --- NUEVO: TEXTURA Y GRUPO PARA LAS BALAS ENEMIGAS (VIOLETAS) ---
        const eGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        eGraphics.fillStyle(0x9b59b6, 1); 
        eGraphics.fillRect(0, 0, 10, 10);  
        eGraphics.generateTexture('enemy_bullet_texture', 10, 10);
        this.enemyBullets = this.physics.add.group({ allowGravity: false });
        // -----------------------------------------------------------------

        this.player = new Player(this, 100, 200);

        // Piso
        this.floor = this.add.zone(0, 540, 12000, 60).setOrigin(0);
        this.physics.add.existing(this.floor, true); 
        this.physics.add.collider(this.player, this.floor);

        // --- ENEMIGOS (Los cambiamos para que floten más arriba, Y = 250) ---
        this.enemies = this.physics.add.group({ allowGravity: false }); 

        // Bajamos la Y a 420 para que estén al alcance de un salto
        this.enemies.add(new Enemy(this, 700, 420, 300)); 
        this.enemies.add(new Enemy(this, 1500, 420, 300));
        this.enemies.add(new Enemy(this, 2800, 420, 300));
        // ---------------------------------------------------------------------

        // --- COLISIONES Y DAÑO ---
        this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
            bullet.destroy();
            enemy.destroy();
        });

        this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
            player.takeDamage(enemy); 
        });

        // NUEVO: Las balas enemigas dañan a Benedict
        this.physics.add.overlap(this.player, this.enemyBullets, (player, bullet) => {
            bullet.destroy(); 
            player.takeDamage(bullet); 
        });
        
        // --- INTERFAZ DE VIDA ---
        this.healthBars = [];
        this.createHealthBarUI();

        this.cameras.main.setBounds(0, 0, 12000, 600);
        this.cameras.main.startFollow(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    createHealthBarUI() {
        for (let i = 0; i < 5; i++) {
            let xPos = 20 + (i * 14); 
            let yPos = 20;            

            let bgBar = this.add.rectangle(xPos, yPos, 10, 24, 0x444444).setOrigin(0).setScrollFactor(0);
            let activeBar = this.add.rectangle(xPos, yPos, 10, 24, 0xff0000).setOrigin(0).setScrollFactor(0);
            this.healthBars.push(activeBar);
        }
    }

    updateHealthBar() {
        for (let i = 0; i < this.healthBars.length; i++) {
            if (i >= this.player.health) {
                this.healthBars[i].setVisible(false); 
            } else {
                this.healthBars[i].setVisible(true);
            }
        }
    }

    update() {
        this.player.update(this.cursors, this.spaceKey);

        // Actualizamos pasándole el jugador como parámetro
        this.enemies.getChildren().forEach(enemy => {
            enemy.update(this.player);
        });

        this.bg1.tilePositionX = this.cameras.main.scrollX * 0.2;
        this.bg2.tilePositionX = this.cameras.main.scrollX * 0.5;

        this.bullets.getChildren().forEach(bullet => {
            if (bullet.x > this.cameras.main.scrollX + 800 || bullet.x < this.cameras.main.scrollX) {
                bullet.destroy();
            }
        });

        // NUEVO: Limpieza de balas enemigas
        this.enemyBullets.getChildren().forEach(bullet => {
            if (bullet.x > this.cameras.main.scrollX + 800 || bullet.x < this.cameras.main.scrollX) {
                bullet.destroy();
            }
        });
    }
}