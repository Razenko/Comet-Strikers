import StartScreen from './startscreen.js'
import LevelScene from './levelscene.js'
import WinLevel from './winlevel.js'

/**
 * Comet Strikers - An asteroids clone in Javascript (Development version)
 * Made by Marcel Schoeber as the final assignment for the DHTML course of Stenden University.
 * Studentnumber: 331910
 *
 * Uses the Phaser 3.15 Framework.
 * Requires a browser that supports ECMAScript 6. (see https://kangax.github.io/compat-table/es6/ for a detailed overview)
 */

/**
 * @classdesc
 * Main game instantiation class.
 * Creates a Phaser 3 config object with a given number of levels,
 * after which the run method can be executed to start the game.
 * @class CometStrikers - Class containing game configuration and startup functionality.
 * @constructor levels - The number of levels to be generated and added to the config object.
 */
export default class CometStrikers {
    constructor(levels) {
        this.config = this.create(levels);
    }

    /**
     * Creates and returns the config object with a number of levels.
     * @param numberOfLevels - An integer value representing the number of levels to be generated.
     * @returns {{type: integer, width: number, height: number, physics: {default: string, arcade: {gravity: {y: number}, debug: boolean}}, scene: Array}}
     */
    create(numberOfLevels) {
        let levels = CometStrikers.createLevels(numberOfLevels);
        return {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'comet-strikers',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {y: 0},
                    debug: false
                }
            },
            scene: levels
        };
    }

    /**
     * Run the game.
     */
    run() {
        new Phaser.Game(this.config);
    }

    /**
     * Creates and returns an array of levels.
     * @param amount - The number of levels to be generated.
     * @returns {Array} - An array of levels (Phaser scenes).
     */
    static createLevels(amount) {
        let tmpArray = [];
        tmpArray.push(new StartScreen(1));
        for (let i = 1; i <= amount; i++) {
            let level = new LevelScene(i);
            tmpArray.push(level);
        }
        //Final win screen
        tmpArray.push(new WinLevel(amount + 1));
        return tmpArray;
    }
}