import LevelScene from './src/levelscene.js'
import WinLevel from './src/winlevel.js'

/**
 * Comet Strikers - An asteroids clone in Javascript (Development version)
 * Made by Marcel Schoeber as the final assignment for the DHTML course of Stenden University.
 * Studentnumber: 331910
 *
 * Uses the Phaser 3.15 Framework.
 * Requires a browser that supports ECMAScript 6. (see https://kangax.github.io/compat-table/es6/ for a detailed overview)
 */

//Set number of levels.
let numberOfLevels = 3;

let levels = createLevels(numberOfLevels);


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
    scene: levels

};

//Instantiate game
const game = new Phaser.Game(config);

//Create array of levels
function createLevels(amount) {
    let tmpArray = [];
    for (let i = 1; i <= amount; i++) {
        let level = new LevelScene(i);
        tmpArray.push(level);
    }
    //Final win screen
    tmpArray.push(new WinLevel(amount + 1));
    return tmpArray;
}