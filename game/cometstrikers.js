import LevelScene from './src/LevelScene.js'

let testLevel = new LevelScene(1);

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: testLevel

};

const game = new Phaser.Game(config);