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
        this.scene = scene;
        this.distance = distance;
        this.lasers = [];
        this.util = new Util();
        this.create(2);
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
     * Update the positioning of the laser emitters relative to the position of the ship.
     * @method update
     * @param ship_x - The ship's x-axis
     * @param ship_y - The ship's y-axis
     * @param ship_angle - The angle of the ship (as a rotating sprite)
     */
    update(ship_x, ship_y, ship_angle) {
        let currentDistance = 0;
        let correction = this.distance / 2;
        for (let i = 0; i < this.lasers.length; i++) {
            let initialPosition = this.util.getAnglePos(-15, ship_angle, ship_x, ship_y);
            let laserPosition = this.util.getAnglePos(currentDistance - correction, ship_angle+90, initialPosition.x, initialPosition.y);
            this.lasers[i].setPosition(laserPosition.x, laserPosition.y);
            //this.shipEmitter.setAngle({min: this.ship.angle + 180, max: this.ship.angle + 180, steps: 32});
            this.lasers[i].setAngle(ship_angle);
            currentDistance += this.distance;
        }
    }

    /**
     * Fire the lasers!!
     */
    fire() {
        for (let i = 0; i < this.lasers.length; i++) {
            this.lasers[i].on = true;
        }
    }

    /**
     * Cease firing!!
     */
    stopFire() {
        for (let i = 0; i < this.lasers.length; i++) {
            this.lasers[i].on = false;
        }
    }
}