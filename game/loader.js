import CometStrikers from './src/cometstrikers.js'

/**
 * Comet Strikers - An asteroids clone in Javascript (Development version)
 * Made by Marcel Schoeber as the final assignment for the DHTML course of Stenden University.
 * Studentnumber: 331910
 *
 * Uses the Phaser 3.15 Framework.
 * Requires a browser that supports ECMAScript 6. (see https://kangax.github.io/compat-table/es6/ for a detailed overview)
 */

/**
 * CometStrikers loader
 * @type {CometStrikers} - Create a new instance of the game with 3 levels.
 */

const game = new CometStrikers(3);
game.run(); //Run the game.
