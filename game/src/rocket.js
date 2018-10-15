import Weapon from './weapon.js'

export default class Rocket extends Weapon {
    constructor(scene, distance) {
        super(scene, distance, 50, 'rocket', 0.5, 1);
    }

    //Rockets
    get rockets() {
        return this.elements;
    }

    set rockets(value) {
        this.elements = value;
    }
}
