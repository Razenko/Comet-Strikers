import CelestialObject from './celestialobject.js'

/**
 * Asteroid class inherited from CelestialObject
 */
export default class Asteroid extends CelestialObject {
    constructor(scene, level, name, texture, spawnpoint, scale, rotation, ship) {
        super(scene, level, name, texture, spawnpoint, scale, rotation, ship);
        this.create();
    }
}