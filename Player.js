export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'benedict_walk', 0);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        this.body.setGravityY(1000); 
    }

    update(cursors, spaceKey) {
        const onFloor = this.body.blocked.down;

        // 1. DISPARO (Funciona en el piso y en el aire)
        if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
            this.shoot();
        }

        // 2. Control de movimiento horizontal
        if (cursors.left.isDown) {
            this.setVelocityX(-180);
            this.setFlipX(true);
            if (onFloor) this.anims.play('walk', true);
        } 
        else if (cursors.right.isDown) {
            this.setVelocityX(180);
            this.setFlipX(false);
            if (onFloor) this.anims.play('walk', true);
        } 
        else {
            this.setVelocityX(0);
            if (onFloor) {
                this.anims.stop();
                this.setFrame(0); 
            }
        }

        // 3. Control del aire
        if (!onFloor) {
            this.anims.stop(); 
            this.setFrame(2); 
        }

        // 4. Salto
        if (cursors.up.isDown && onFloor) {
            this.setVelocityY(-550);
        }
    }

    shoot() {
    // Calculamos la dirección basándonos en si el sprite está volteado (flipX)
    const direction = this.flipX ? -1 : 1;
    
    // POSICIÓN EN X: 
    // Usamos 70 píxeles desde el centro (la mitad de 150 son 75, menos 5 píxeles = 70)
    // Al multiplicarlo por 'direction', sumará 70 si mira a la derecha o restará 70 si mira a la izquierda.
    const bulletX = this.x + (direction * 70);
    
    // Posición en Y (se mantiene igual, a 45px desde arriba)
    const bulletY = (this.y - (this.displayHeight / 2)) + 45; 

    // Creamos la bala
    const bullet = this.scene.bullets.create(bulletX, bulletY, 'bullet_texture');
    
    // Velocidad de la bala
    const bulletSpeed = 500;
    bullet.setVelocityX(bulletSpeed * direction);
}
}