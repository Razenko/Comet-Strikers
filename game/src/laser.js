import Weapon from './weapon.js'

/**
 * @classdesc
 * Laser class inherited from Weapon
 * @constructor scene - The current scene
 * @constructor distance - The distance (spacing) between lasers as pixels
 */
export default class Laser extends Weapon {
    constructor(scene, distance) {
        super(scene, distance, 8, 800, 'laser', 0.5, 0.8);
        this.soundeffect = this.scene.sound.add('laser');
    }

    //Lasers
    get lasers() {
        return this.elements;
    }

    set lasers(value) {
        this.elements = value;
    }
}
