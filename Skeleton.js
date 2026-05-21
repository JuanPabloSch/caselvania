export default class Skeleton extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Creamos una textura temporal si no existe
        if (!scene.textures.exists('temp_skeleton')) {
            const canvas = scene.textures.createCanvas('temp_skeleton', 50, 100);
            const ctx = canvas.context;
            ctx.fillStyle = '#dddddd';
            ctx.fillRect(0, 0, 50, 100);
            canvas.refresh();
        }

        super(scene, x, y, 'temp_skeleton');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Física configurada igual que el Player
        this.setSize(50, 100);
        this.setOffset(0, 0);
        this.setCollideWorldBounds(true);
        this.body.setAllowGravity(true);
        
        // Patrulla
        this.startX = x;
        this.patrolRange = 100;
        this.patrolSpeed = 80;
        this.body.setVelocityX(this.patrolSpeed);

        this.lastFrameTime = 0;
        this.throwCooldown = 2000;
    }

    update(player) {
        if (!this.active || player.isDead) return;

        // Movimiento de patrulla
        if (this.x >= this.startX + this.patrolRange) {
            this.body.setVelocityX(-this.patrolSpeed);
        } else if (this.x <= this.startX - this.patrolRange) {
            this.body.setVelocityX(this.patrolSpeed);
        }

        // Ataque
        const distanceX = Math.abs(this.x - player.x);
        if (distanceX < 450) {
            const direction = player.x > this.x ? 1 : -1;
            if (this.scene.time.now - this.lastFrameTime > this.throwCooldown) {
                this.throwBone(direction);
                this.lastFrameTime = this.scene.time.now;
            }
        }
    }

    throwBone(direction) {
        if (!this.scene.enemyBones) return;

        // Crear textura de hueso (cuadradito rojo)
        if (!this.scene.textures.exists('temp_bone')) {
            const canvas = this.scene.textures.createCanvas('temp_bone', 15, 15);
            const ctx = canvas.context;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(0, 0, 15, 15);
            canvas.refresh();
        }

        const bone = this.scene.enemyBones.create(this.x + (direction * 30), this.y - 30, 'temp_bone');
        bone.body.setGravityY(1000);
        bone.setVelocity(200 * direction, -450);
        bone.setAngularVelocity(300 * direction);
    }
}