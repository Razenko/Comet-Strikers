import Weapon from './weapon.js'

/**
 * @classdesc
 * Rocket class inherited from Weapon
 * @constructor scene - The current scene
 * @constructor distance - The distance (spacing) between lasers as pixels
 * @constructor amount - Number of rockets in ship's inventory
 */
export default class Rocket extends Weapon {
    constructor(scene, distance, amount) {
        super(scene, distance, 50, 600, 'rocket', 0.5, 1);
        this.amount = amount;
        this.soundeffect = this.scene.sound.add('rocket');
    }

    //Rockets
    get rockets() {
        return this.elements;
    }

    set rockets(value) {
        this.elements = value;
    }
}
