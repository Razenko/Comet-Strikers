import LevelScene from './src/levelscene.js'

/**
 * Comet Strikers - An asteroids clone in Javascript (Development version)
 * Made by Marcel Schoeber as the final assignment for the DHTML course of Stenden University.
 * Studentnumber: 331910
 *
 * Uses the Phaser 3.14 Framework.
 * Requires a browser that supports ECMAScript 6. (see https://kangax.github.io/compat-table/es6/ for a detailed overview)
 */

//Create new level
let testLevel = new LevelScene(1);

//Create Phaser configuration
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

//Instantiate game
const game = new Phaser.Game(config);