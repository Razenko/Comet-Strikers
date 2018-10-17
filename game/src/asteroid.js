import CelestialObject from './celestialobject.js'

export default class Asteroid extends CelestialObject {
    constructor(scene, level, texture, spawnpoint, scale, rotation, ship) {
        super(scene, level, texture, spawnpoint, scale, rotation, ship);
        this.create();
    }
}