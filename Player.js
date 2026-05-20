export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'benedict_walk', 0);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        this.body.setGravityY(1000); 

        // --- CALIBRACIÓN DE HITBOX ---
        // El sprite mide 150x134. Hacemos que la caja física mida solo 50px de ancho y todo el alto (134px).
        this.body.setSize(50, 134);
        
        // Ponemos un offset inicial por defecto (centrado o tirado a un lado)
        this.body.setOffset(50, 0); 
        // -----------------------------

        this.maxHealth = 5;
        this.health = this.maxHealth;
        this.isInvincible = false;
        this.isDead = false;
        this.isKnockback = false; 
    }

    update(cursors, spaceKey) {
        if (this.isDead) return; 
        
        if (this.isKnockback) {
            this.anims.stop();
            this.setFrame(2); 
            return; 
        }

        const onFloor = this.body.blocked.down;

        if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
            this.shoot();
        }

        // Control de movimiento horizontal y AJUSTE DINÁMICO DEL HITBOX
        if (cursors.left.isDown) {
            this.setVelocityX(-180);
            this.setFlipX(true);
            if (onFloor) this.anims.play('walk', true);

            // Si mira a la IZQUIERDA, el arma suele quedar del lado izquierdo.
            // Desplazamos la caja del cuerpo hacia la DERECHA del frame (ej: píxel 65).
            this.body.setOffset(65, 0);
        } 
        else if (cursors.right.isDown) {
            this.setVelocityX(180);
            this.setFlipX(false);
            if (onFloor) this.anims.play('walk', true);

            // Si mira a la DERECHA, el arma se extiende a la derecha.
            // Movemos la caja del cuerpo hacia la IZQUIERDA del frame (ej: píxel 35) 
            // para dejar libres esos ~60 píxeles donde está el arma.
            this.body.setOffset(35, 0);
        } 
        else {
            this.setVelocityX(0);
            if (onFloor) {
                this.anims.stop();
                this.setFrame(0); 
            }
        }

        if (!onFloor) {
            this.anims.stop(); 
            this.setFrame(2); 
        }

        if (cursors.up.isDown && onFloor) {
            this.setVelocityY(-550);
        }
    }

    takeDamage(attacker) {
        if (this.isDead || this.isInvincible) return;

        this.health -= 1;
        this.scene.updateHealthBar();

        if (this.health <= 0) {
            this.die();
            return;
        }

        this.isKnockback = true;
        const knockDirection = attacker.x > this.x ? -1 : 1;
        this.setVelocityX(200 * knockDirection); 
        this.setVelocityY(-300);                 

        this.scene.time.delayedCall(350, () => {
            if (!this.isDead) {
                this.isKnockback = false;
            }
        });

        this.isInvincible = true;
        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            yoyo: true,
            duration: 100,
            repeat: 4,
            onComplete: () => {
                this.alpha = 1;
                this.isInvincible = false;
            }
        });
    }

    die() {
        this.isDead = true;
        this.isKnockback = false;
        this.setVelocity(0, 0);
        this.setAcceleration(0, 0);
        this.anims.stop();
        this.setFrame(0);
        this.setAngle(-90); 
        this.body.setEnable(false); 
        console.log("GAME OVER");
    }

    shoot() {
        if (this.isDead || this.isKnockback) return; 
        const direction = this.flipX ? -1 : 1;
        const bulletX = this.x + (direction * 70);
        const bulletY = (this.y - (this.displayHeight / 2)) + 45; 

        const bullet = this.scene.bullets.create(bulletX, bulletY, 'bullet_texture');
        const bulletSpeed = 500;
        bullet.setVelocityX(bulletSpeed * direction);
    }
}