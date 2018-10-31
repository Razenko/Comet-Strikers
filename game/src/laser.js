import Weapon from './weapon.js'

/**
 * Laser class inherited from Weapon
 */
export default class Laser extends Weapon {
    constructor(scene, distance) {
        super(scene, distance, 8, 800, 'laser', 0.5, 0.8);
    }

    //Lasers
    get lasers() {
        return this.elements;
    }

    set lasers(value) {
        this.elements = value;
    }
}
