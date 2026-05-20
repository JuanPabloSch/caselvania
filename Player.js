export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player_sprite');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        this.body.setGravityY(800);
    }

    update(cursors) {
        if (cursors.left.isDown) this.setVelocityX(-200);
        else if (cursors.right.isDown) this.setVelocityX(200);
        else this.setVelocityX(0);
    }
}