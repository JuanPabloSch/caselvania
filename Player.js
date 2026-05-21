export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'benedict_walk', 0);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        this.body.setGravityY(1000); 

        // Hitbox inicial (parado)
        this.body.setSize(50, 134);
        this.body.setOffset(50, 0); 

        this.maxHealth = 5;
        this.health = this.maxHealth;
        this.isInvincible = false;
        this.isDead = false;
        this.isKnockback = false; 
        // Al final de tu constructor en Player.js:
        this.isDucking = false;
    }

update(cursors, spaceKey) {
        if (this.isDead) return; 
        
        if (this.isKnockback) {
            this.isDucking = false;
            this.anims.stop();
            this.setOrigin(0.5, 0.5); // Resetea origen visual
            this.setTexture('benedict_walk'); 
            this.setFrame(2); 
            return; 
        }

        const onFloor = this.body.blocked.down;

        // --- MECÁNICA: AGACHARSE (benedict_duck: 150x90 estático) ---
        if (cursors.down.isDown && onFloor) {
            this.setVelocityX(0); 
            
            if (!this.isDucking) {
                this.isDucking = true;
                this.anims.stop(); 
                
                this.setTexture('benedict_duck', 0); 
                this.frame = this.scene.textures.getFrame('benedict_duck', 0);
                
                // 1. ACHICAMOS LA CAJA: Mide 90 de alto. 
                // Al dejar el tercer parámetro en 'false', se achica manteniendo el centro.
                this.body.setSize(65, 90, false); 

                // 2. CORRECCIÓN VISUAL: Como la caja se achicó, movemos el origen del dibujo 
                // un poquito hacia arriba para que el cuerpo del patito calce perfecto dentro de la caja
                this.setOrigin(0.5, 0.25);
            }

            // 3. ¡EL TRUCO ANTICAÍDAS!: El offset en Y se queda CLAVADO en 0.
            // Al no cambiar este número, la base de la caja nunca atraviesa la plataforma.
            if (this.flipX) {
                this.body.setOffset(65, 0); 
            } else {
                this.body.setOffset(20, 0);
            }

            // Disparar agachado
            if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
                this.shootAgachado();
            }
            
            return; 
        }

        // --- MECÁNICA: LEVANTARSE ---
        if (this.isDucking && !cursors.down.isDown) {
            this.isDucking = false;
            
            // Volvemos el origen visual al centro exacto
            this.setOrigin(0.5, 0.5); 
            
            this.setTexture('benedict_walk', 0); 
            this.frame = this.scene.textures.getFrame('benedict_walk', 0);
            
            // Volvemos a la caja normal de parado
            this.body.setSize(50, 134, false);
            
            // El offset en Y sigue estando en 0, impecable
            this.body.setOffset(this.flipX ? 65 : 35, 0);
        }

        // Control de disparo normal estando parado/saltando
        if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
            this.shoot();
        }

        // Control de movimiento horizontal (Solo si NO está agachado)
        if (!this.isDucking) {
            if (cursors.left.isDown) {
                this.setVelocityX(-180);
                this.setFlipX(true);
                if (onFloor) this.anims.play('walk', true);
                this.body.setOffset(65, 0);
            } 
            else if (cursors.right.isDown) {
                this.setVelocityX(180);
                this.setFlipX(false);
                if (onFloor) this.anims.play('walk', true);
                this.body.setOffset(35, 0);
            } 
            else {
                this.setVelocityX(0);
                if (onFloor) {
                    this.anims.stop();
                    this.setFrame(0); 
                    this.body.setOffset(this.flipX ? 65 : 35, 0);
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
        this.body.setAllowGravity(false);
        this.body.setEnable(false); 
        
        this.anims.stop();
        this.setTexture('benedict_dead'); 
        this.setAngle(0);                

        this.scene.time.addEvent({
            delay: 16, 
            callback: () => {
                const alturaPisoDeseada = 510; // El valor que calibraste antes
                if (this.y < alturaPisoDeseada) {
                    this.y += 8; 
                    if (this.y > alturaPisoDeseada) {
                        this.y = alturaPisoDeseada;
                    }
                }
            },
            repeat: 60 
        });
        
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

    shootAgachado() {
        if (this.isDead || this.isKnockback) return; 
        const direction = this.flipX ? -1 : 1;
        const bulletX = this.x + (direction * 70);
        
        // Estaba en -10, le sumamos 5px hacia abajo y queda en -5
        const bulletY = this.y + 10; 

        const bullet = this.scene.bullets.create(bulletX, bulletY, 'bullet_texture');
        const bulletSpeed = 500;
        bullet.setVelocityX(bulletSpeed * direction);
    }
}