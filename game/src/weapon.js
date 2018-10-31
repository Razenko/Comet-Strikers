import Util from './util.js'

/**
 * @classdesc
 * This class represents a weapon element the player uses as offensive tools on his ship.
 * @class Weapon
 * @extends Phaser.GameObjects.Sprite
 * @constructor scene - The current Phaser.Scene
 * @constructor distance - The distance (spacing) between the individual elements
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
            if (element.x < 0 || element.y < 0 || element.x > this.scene.cameras.main.width || element.y > this.scene.cameras.main.height) {
                element.destroy();
                purgebuffer.push(element);
            }
        }

        this.cleanElementArray(purgebuffer);
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
        if (this.amount == null || this.amount > 0) {
            if (this.delayCounter < 1) {
                this.create(ship_x, ship_y, ship_angle, 2, this.distance, this.spriteConfig.texture, this.spriteConfig.scale, this.spriteConfig.alpha);
                this.delayCounter = this.delay;
                if (this.amount != null) {
                    this.amount--;
                }
            }
            this.delayCounter--;
        }
    }

    /**
     * Cease firing!!
     */
    stopFire() {
        this.delayCounter = 0;
    }
}