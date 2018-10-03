import Util from './util.js'

/**
 * @classdesc
 * This class represents the laser cannon element the player uses as weapons on his sprite.
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
        this.create(2);
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

    /**
     * Creates a given number of laser objects.
     * @method create
     * @param amount - The number of laser objects to create
     */
    create(amount) {
        let particles = this.scene.add.particles('blue');

        for (let i = 0; i < amount; i++) {
            let laser = particles.createEmitter({
                speed: 200,
                scale: {start: 1, end: 0},
                alpha: 0.5,
                blendMode: 'ADD',
                //angle: { min: 60, max: 120, steps: 32 },
                lifespan: 3000,
                quantity: 1,
                //radial: true
                on: false
            });

            this.lasers.push(laser);
        }
    }

    /**
     * Update the positioning of the laser emitters relative to the position of the sprite.
     * @method update
     * @param ship_x - The sprite's x-axis
     * @param ship_y - The sprite's y-axis
     * @param ship_angle - The angle of the sprite (as a rotating sprite)
     */
    update(ship_x, ship_y, ship_angle) {
        let currentDistance = 0;
        let correction = this.distance / 2;
        for (let laser of this.lasers) {
            let initialPosition = Util.getAnglePos(-15, ship_angle, ship_x, ship_y);
            let laserPosition = Util.getAnglePos(currentDistance - correction, ship_angle + 90, initialPosition.x, initialPosition.y);
            laser.setPosition(laserPosition.x, laserPosition.y);
            //this.shipEmitter.setAngle({min: this.sprite.angle + 180, max: this.sprite.angle + 180, steps: 32});
            laser.setAngle(ship_angle);
            currentDistance += this.distance;
        }
    }

    /**
     * Fire the lasers!!
     */
    fire() {
        for (let laser of this.lasers) {
            laser.on = true;
        }
    }

    /**
     * Cease firing!!
     */
    stopFire() {
        for (let laser of this.lasers) {
            laser.on = false;
        }
    }
}