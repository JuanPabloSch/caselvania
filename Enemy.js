export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, patrolDistance = 200) {
        // Creamos una textura violeta temporal de 40x40 para el enemigo
        if (!scene.textures.exists('enemy_box')) {
            const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
            graphics.fillStyle(0x9b59b6, 1); // Violeta gótico
            graphics.fillRect(0, 0, 40, 40);
            graphics.generateTexture('enemy_box', 40, 40);
        }

        super(scene, x, y, 'enemy_box');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setGravityY(800); // Tienen gravedad para apoyarse en el piso

        // Variables de patrulla
        this.startX = x;
        this.patrolDistance = patrolDistance;
        this.speed = 80;
        this.setVelocityX(this.speed);
    }

    update() {
        // Si se aleja mucho de su posición inicial a la derecha, vuelve
        if (this.x > this.startX + this.patrolDistance) {
            this.setVelocityX(-this.speed);
        }
        // Si se aleja mucho a la izquierda, cambia a la derecha
        else if (this.x < this.startX) {
            this.setVelocityX(this.speed);
        }
    }
}