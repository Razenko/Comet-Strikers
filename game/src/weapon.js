import Util from './util.js'

/**
 * @classdesc
 * This class represents a weapon element the player uses as offensive tools on his ship.
 * @class Weapon
 * @extends Phaser.GameObjects.Sprite
 * @constructor scene - The current Phaser.Scene
 * @constructor distance - The distance (spacing) between the individual elements
 * @constructor delay - The total delay (interval) between firing, in order to prevent spamming.
 * @constructor speed - The speed (velocity) of the element.
 * @constructor texture - The texture to be used as sprite.
 * @constructor scale - The scale (size) of the element.
 * @constructor alpha - Set transparency.
 */
export default class Weapon extends Phaser.GameObjects.Sprite {
    constructor(scene, distance, delay, speed, texture, scale, alpha) {
        super(scene);
        this._scene = scene;
        this._distance = distance;
        this._elements = [];
        this._delay = delay;
        this._delayCounter = 0;
        this._amount = null;
        this._speed = speed;
        this._soundeffect = null;
        this._spriteConfig = {
            texture: texture,
            scale: scale,
            alpha: alpha
        }
    }

    /**
     Getters and setters
     */

    //Elements
    get elements() {
        return this._elements;
    }

    set elements(value) {
        this._elements = value;
    }

    //SpriteConfig
    get spriteConfig() {
        return this._spriteConfig;
    }

    set spriteConfig(value) {
        this._spriteConfig = value;
    }

    //Distance
    get distance() {
        return this._distance;
    }

    set distance(value) {
        this._distance = value;
    }

    //Scene
    get scene() {
        return this._scene;
    }

    set scene(value) {
        this._scene = value;
    }

    //Delay
    get delay() {
        return this._delay;
    }

    set delay(value) {
        this._delay = value;
    }

    //DelayCounter
    get delayCounter() {
        return this._delayCounter;
    }

    set delayCounter(value) {
        this._delayCounter = value;
    }

    //Amount
    get amount() {
        return this._amount;
    }

    set amount(value) {
        this._amount = value;
    }

    //Speed
    get speed() {
        return this._speed;
    }

    set speed(value) {
        this._speed = value;
    }

    //Sound
    get soundeffect() {
        return this._soundeffect;
    }

    set soundeffect(value) {
        this._soundeffect = value;
    }


    /**
     * Creates a given number of weapon objects.
     * @method create
     * @param ship_x - Horizontal position of the ship
     * @param ship_y - Vertical position of the ship
     * @param ship_angle - Angle of the ship
     * @param amount - The number of laser objects to create
     * @param distance - distance between objects
     * @param texture - Texture (bitmap) to use
     * @param scale - Scale
     * @param alpha - Alpha blend level
     */
    create(ship_x, ship_y, ship_angle, amount, distance, texture, scale, alpha) {
        let currentDistance = 0;
        let correction = distance / 2;
        for (let i = 0; i < amount; i++) {
            let element = this.scene.physics.add.image(400, 400, texture);
            element.setScale(scale);
            element.setAlpha(alpha);
            let initialPosition = Util.getAnglePos(-15, ship_angle, ship_x, ship_y);
            let elementPosition = Util.getAnglePos(currentDistance - correction, ship_angle + 90, initialPosition.x, initialPosition.y);
            element.setPosition(elementPosition.x, elementPosition.y);
            element.setAngle(ship_angle);
            currentDistance += distance;
            this.elements.push(element);
        }
    }

    /**
     * Update the positioning of the elements relative to the position of the ship.
     * @method update
     */
    update() {
        let purgebuffer = [];
        for (let element of this.elements) {
            this.scene.physics.velocityFromRotation(element.rotation, this.speed, element.body.velocity);
            if (element.x < 0 || element.y < 0 || element.x > this.scene.cameras.main.width || element.y > this.scene.cameras.main.height) { //Check if element if out of bounds
                element.destroy(); //Destroy the element
                purgebuffer.push(element); //Queue the element object for array removal
            }
        }

        this.cleanElementArray(purgebuffer); //Remove all destroyed elements from array (to prevent unused objects from wasting resources).
    }

    /**
     * Cleans out the element array of objects that are no longer in the playing field.
     * @param purgebuffer - Array of elements due for removal.
     */
    cleanElementArray(purgebuffer) {
        if (purgebuffer.length > 0) {
            for (let element of purgebuffer) {
                this.elements.splice(this.elements.indexOf(element));
            }
        }
    }

    removeElement(element) {
        this.elements.splice(this.elements.indexOf(element));
    }

    /**
     * Fire!!
     */
    fire(ship_x, ship_y, ship_angle) {
        if (this.amount == null || this.amount > 0) { //Check inventory (remaining elements) if exists.
            if (this.delayCounter < 1) { //Current interval is over
                this.create(ship_x, ship_y, ship_angle, 2, this.distance, this.spriteConfig.texture, this.spriteConfig.scale, this.spriteConfig.alpha); //Create a new element.
                this.delayCounter = this.delay; //Reset delay interval
                if (this.soundeffect != null) {
                    this.soundeffect.play(); //Play the associated sound effect
                }
                if (this.amount != null) {
                    this.amount--; //Reduce inventory
                }
            }
            this.delayCounter--; //Reduce delay interval
        }
    }

    /**
     * Cease firing!!
     */
    stopFire() {
        this.delayCounter = 0; //Reset delay interval (when the player stops pressing the respective button)
    }
}