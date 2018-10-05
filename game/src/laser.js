import Util from './util.js'

/**
 * @classdesc
 * This class represents the laser cannon element the player uses as weapons on his ship.
 * @class Laser
 * @extends Phaser.GameObjects.Sprite
 * @constructor scene - The current Phaser.Scene
 * @constructor distance - The distance (spacing) between the individual lasers
 */
export default class Laser extends Phaser.GameObjects.Sprite {
    constructor(scene, distance) {
        super(scene);
        this._scene = scene;
        this._distance = distance;
        this._lasers = [];
        this._delay = 0;
    }

    /**
     Getters and setters
     */

    //Lasers
    get lasers() {
        return this._lasers;
    }

    set lasers(value) {
        this._lasers = value;
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

    /**
     * Creates a given number of laser objects.
     * @method create
     * @param ship_x - Horizontal position of the ship
     * @param ship_y - Vertical position of the ship
     * @param ship_angle - Angle of the ship
     * @param amount - The number of laser objects to create
     */
    create(ship_x, ship_y, ship_angle, amount) {
        let currentDistance = 0;
        let correction = this.distance / 2;
        for (let i = 0; i < amount; i++) {
            let laser = this.scene.physics.add.image(400, 400, 'laser');
            laser.setScale(0.5);
            laser.setAlpha(0.8);
            let initialPosition = Util.getAnglePos(-15, ship_angle, ship_x, ship_y);
            let laserPosition = Util.getAnglePos(currentDistance - correction, ship_angle + 90, initialPosition.x, initialPosition.y);
            laser.setPosition(laserPosition.x, laserPosition.y);
            laser.setAngle(ship_angle);
            currentDistance += this.distance;
            this.lasers.push(laser);
        }
    }

    /**
     * Update the positioning of the lasers relative to the position of the ship.
     * @method update
     */
    update() {
        let killbuffer = [];
        for (let laser of this.lasers) {
            this.scene.physics.velocityFromRotation(laser.rotation, 800, laser.body.velocity);
            if (laser.x < 0 || laser.y < 0 || laser.x > this.scene.cameras.main.width || laser.y > this.scene.cameras.main.height) {
                laser.destroy();
                killbuffer.push(laser);
            }
        }

        this.cleanLaserArray(killbuffer);
    }

    /**
     * Cleans out the laser array of objects that are no longer in the playing field.
     * @param killbuffer - Array of lasers due for removal.
     */
    cleanLaserArray(killbuffer) {
        if (killbuffer.length > 0) {
            for (let laser of killbuffer) {
                this.lasers.splice(this.lasers.indexOf(laser));
            }
        }
    }

    /**
     * Fire the lasers!!
     */
    fire(ship_x, ship_y, ship_angle) {
        if (this.delay < 1) {
            this.create(ship_x, ship_y, ship_angle, 2);
            this.delay = 8;
            //console.log(this.lasers.length)
        }
        this.delay--;
    }

    /**
     * Cease firing!!
     */
    stopFire() {
        this.delay = 0;
    }
}