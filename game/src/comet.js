import CelestialObject from './celestialobject.js'

/**
 * Comet class inherited from CelestialObject
 * @classdesc
 * This class represents a Comet, which inherits its properties and functionality from CelestialObject.
 * @constructor scene - The current level scene
 * @constructor level- The current level number
 * @constructor name - The name of this object
 * @constructor texture - The texture to be used as a sprite.
 * @constructor spawnpoint - A predefined spawnpoint, set null for random spawn location.
 * @constructor scale - A predefined scale, set null for random scale.
 * @constructor rotation - The speed of rotation, set null for random rotation value.
 * @constructor ship - The location of the ship.
 */
export default class Comet extends CelestialObject {
    constructor(scene, level, name, texture, spawnpoint, scale, rotation, ship) {
        super(scene, level, name, texture, spawnpoint, scale, rotation, ship);
        this.spriteConfig.sizeBoundaries.min = 55;
        this.spriteConfig.sizeBoundaries.max = 70;
        this.create();
    }
}