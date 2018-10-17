import CelestialObject from './celestialobject.js'

export default class Comet extends CelestialObject {
    constructor(scene, level, texture, spawnpoint, scale, rotation, ship) {
        super(scene, level, texture, spawnpoint, scale, rotation, ship);
        this.spriteConfig.sizeBoundaries.min = 55;
        this.spriteConfig.sizeBoundaries.max = 70;
        this.create();
    }


}