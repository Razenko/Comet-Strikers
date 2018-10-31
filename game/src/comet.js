import CelestialObject from './celestialobject.js'

/**
 * Comet class inherited from CelestialObject
 */
export default class Comet extends CelestialObject {
    constructor(scene, level, name, texture, spawnpoint, scale, rotation, ship) {
        super(scene, level, name, texture, spawnpoint, scale, rotation, ship);
        this.spriteConfig.sizeBoundaries.min = 55;
        this.spriteConfig.sizeBoundaries.max = 70;
        this.create();
    }


}