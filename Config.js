import GameScene from './GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,  // Resolución de pantalla
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // La gravedad la definiremos en el Player
            debug: false        // Ponlo en true para ver los hitboxes
        }
    },
    scene: [GameScene]
};

const game = new Phaser.Game(config);