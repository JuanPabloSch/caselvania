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
    // 1. Verificar si está en el suelo o en el aire
    const onFloor = this.body.blocked.down;

    // 2. Control de movimiento horizontal
    if (cursors.left.isDown) {
        this.setVelocityX(-180);
        this.setFlipX(true);
        
        // Solo reproduce la animación de caminar si está en el piso
        if (onFloor) {
            this.anims.play('walk', true);
        }
    } 
    else if (cursors.right.isDown) {
        this.setVelocityX(180);
        this.setFlipX(false);
        
        if (onFloor) {
            this.anims.play('walk', true);
        }
    } 
    else {
        this.setVelocityX(0);
        if (onFloor) {
            this.anims.stop();
            this.setFrame(0); // Pose quieto en el suelo
        }
    }

    // 3. Control del aire (Salto / Caída)
    if (!onFloor) {
        this.anims.stop(); // Frenamos la animación de caminar para que no mueva las piernas
        
        // Congelamos a Benedict en el frame 2 (o el que prefieras del 0 al 4) 
        // para que mantenga una pose fija de salto mientras esté en el aire.
        this.setFrame(2); 
    }

    // 4. Lógica de activar el salto
    if (cursors.up.isDown && onFloor) {
        this.setVelocityY(-550);
    }
}
}