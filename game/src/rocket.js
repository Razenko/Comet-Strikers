import Weapon from './weapon.js'

/**
 * Rocket class inherited from Weapon
 */
export default class Rocket extends Weapon {
    constructor(scene, distance, amount) {
        super(scene, distance, 50, 600, 'rocket', 0.5, 1);
        this.amount = amount;
    }

    //Rockets
    get rockets() {
        return this.elements;
    }

    set rockets(value) {
        this.elements = value;
    }
}
