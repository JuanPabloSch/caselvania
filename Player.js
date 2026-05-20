export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Inicializamos con el spritesheet cargado y el frame 0 por defecto
        super(scene, x, y, 'benedict_walk', 0);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        this.body.setGravityY(1000); // Un poco más de gravedad para que se sienta pesado como Castlevania
        
        // Opcional: Si notas que el personaje flota un poco o su hitbox es enorme, 
        // puedes achicar su caja de colisión aquí con:
        // this.body.setSize(60, 134); 
    }

    update(cursors) {
        if (cursors.left.isDown) {
            this.setVelocityX(-180);
            this.setFlipX(true); // Gira el sprite hacia la izquierda
            this.anims.play('walk', true);
        } 
        else if (cursors.right.isDown) {
            this.setVelocityX(180);
            this.setFlipX(false); // Gira el sprite hacia la derecha
            this.anims.play('walk', true);
        } 
        else {
            this.setVelocityX(0);
            this.anims.stop();   // Detiene la animación si está quieto
            this.setFrame(0);    // Lo deja en la pose estática inicial
        }
        
        // Salto clásico
        if (cursors.up.isDown && this.body.blocked.down) {
            this.setVelocityY(-550);
        }
    }
}