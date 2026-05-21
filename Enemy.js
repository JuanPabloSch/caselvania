export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, patrolDistance = 300) {
        super(scene, x, y, 'sebihead', 0);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);

        // --- ENCAJE PERFECTO DE ESCALA A LA MITAD (0.5) ---
        this.setScale(0.5);          // 1. Escalamos el gráfico al 50%
        this.body.setSize(80, 80);    // 2. Le recordamos al motor el tamaño original
        this.body.setOffset(0, 0);    // 3. Centramos la caja física sobre el sprite escalado
        // --------------------------------------------------

        // Variables de patrullaje horizontal
        this.startX = x;
        this.patrolDistance = patrolDistance;
        this.speed = 100;
        this.setVelocityX(this.speed);

        // Variables para el movimiento de Medusa (onda)
        this.startY = y;           
        this.waveTimer = 0;        
        this.waveSpeed = 0.04;     
        this.waveAmplitude = 30;   

        // Inteligencia de disparo
        this.visionRange = 400;     
        this.lastShotTime = 0;       
        this.shootCooldown = 1500;   
    }

    update(player) {
        // 1. CONTROL DE PATRULLAJE HORIZONTAL
        if (this.body.velocity.x > 0 && this.x > this.startX + this.patrolDistance) {
            this.setVelocityX(-this.speed);
        }
        else if (this.body.velocity.x < 0 && this.x < this.startX) {
            this.setVelocityX(this.speed);
        }
        else if (this.body.velocity.x === 0) {
            this.setVelocityX(this.speed);
        }

        // Voltear el sprite según dirección de patrulla
        if (this.body.velocity.x > 0) {
            this.setFlipX(false); 
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(true);  
        }

        // 2. EFECTO ONDULANTE VERTICAL
        this.waveTimer += this.waveSpeed;
        this.y = this.startY + (Math.sin(this.waveTimer) * this.waveAmplitude);

        // 3. LÓGICA DE DISPARO AL VUELO Y CAMBIO DE FRAME
        const distanceX = Math.abs(this.x - player.x);
        const distanceY = Math.abs(this.y - player.y);

        if (distanceX < this.visionRange && distanceY < 250 && !player.isDead) {
            const direction = player.x > this.x ? 1 : -1;
            this.setFlipX(direction === -1); 

            const currentTime = this.scene.time.now;
            
            if (currentTime - this.lastShotTime > this.shootCooldown) {
                this.setFrame(1); 
                this.shoot(direction);
                this.lastShotTime = currentTime;

                this.scene.time.delayedCall(300, () => {
                    if (this.active) this.setFrame(0);
                });
            }
        }
    }

    shoot(direction) {
        // Ajustamos la salida de la bala para la escala 0.5 (unos 25px hacia adelante)
        const bulletX = this.x + (direction * 25);
        const bullet = this.scene.enemyBullets.create(bulletX, this.y, 'enemy_bullet_texture');
        const bulletSpeed = 280;
        bullet.setVelocityX(bulletSpeed * direction);
    }
}