import Util from './util.js'
import Laser from './laser.js'

/**
 * @classdesc
 * The ship which is controlled by the player. Creates the ship and provides control mechanisms.
 * Also handles the thrusters particle effects (engine exhaust trail).
 * @class PlayerShip - Represents the ship the player uses.
 * @extends Phaser.GameObjects.Sprite
 * @constructor scene - The current Phaser.Scene
 */
export default class PlayerShip extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene)
        this.scene = scene;
        this.ship = null;
        this.active = true;
        this.invulnerable = false;
        this.shipEmitter = null;
        this.emitterDeathZone = null;
        this.util = new Util();
        this.laser = null;
        this.create(scene);
    }

    /**
     * Create a new ship and the associated thruster effects
     * @method create
     */
    create() {
        this.invulnerable = true;
        console.log("Ship spawned, vulnerability set to true")
        let particles = this.scene.add.particles('blue');
        this.shipEmitter = particles.createEmitter({
            speed: 1,
            scale: {start: 1, end: 0},
            alpha: 0.5,
            blendMode: 'ADD',
            //angle: { min: 60, max: 120, steps: 32 },
            lifespan: 1000,
            quantity: 1,
            //radial: true
            on: false
        });

        this.ship = this.scene.physics.add.image(400, 400, 'ship');
        this.ship.setDamping(true);
        this.ship.setDrag(0.99);
        this.ship.setMaxVelocity(200);
        this.ship.setVelocity(0, 0);
        this.ship.setBounce(1, 1);
        this.ship.angle = -90;
        this.ship.setCollideWorldBounds(false);
        this.emitterDeathZone = new Phaser.Geom.Circle(this.ship.x, this.ship.y, 50);
        this.laser = new Laser(this.scene, 58);
        console.log("Disable invulnerability event started")
        this.setVulnerabilityState(this, 2000, false);


    }

    /**
     * Update the ship's position (together with laser and thrusters).
     * @method update
     */
    update() {
        this.scene.physics.world.wrap(this.ship, 32);
        let emitterPosition = this.util.getAnglePos(30, this.ship.angle, this.ship.x, this.ship.y);
        this.shipEmitter.setPosition(emitterPosition.x, emitterPosition.y);
        //this.shipEmitter.setAngle({min: this.ship.angle + 180, max: this.ship.angle + 180, steps: 32});
        this.shipEmitter.setAngle(this.ship.angle + 180);
        let deathzonePosition = this.util.getAnglePos(-20, this.ship.angle, this.ship.x, this.ship.y);
        this.emitterDeathZone.setPosition(deathzonePosition.x, deathzonePosition.y);
        this.shipEmitter.setDeathZone(new Phaser.GameObjects.Particles.Zones.DeathZone(this.emitterDeathZone, true));
        this.laser.update(this.ship.x, this.ship.y, this.ship.angle);
    }

    /**
     * Returns the current ship object
     * @returns {null|*}
     */
    getPlayerShip() {
        return this.ship;
    }

    /**
     * Accelerate the ship forward.
     *
     */

    accelerate() {
        if (this.active) {
            this.scene.physics.velocityFromRotation(this.ship.rotation, 200, this.ship.body.acceleration);
            this.shipEmitter.on = true;
        }

    }

    /**
     * Stop/reverse the ship.
     *
     */
    deAccelerate() {
        if (this.active) {
            this.scene.physics.velocityFromRotation(this.ship.rotation, -50, this.ship.body.acceleration);
            this.shipEmitter.on = false;
        }
    }

    /**
     * Disable thrusters and float
     */
    noAcceleration() {
        this.ship.setAcceleration(0);
        this.shipEmitter.on = false;
    }

    /**
     * Rotate the sprite counterclockwise (left)
     */
    turnLeft() {
        if (this.active) {
            this.ship.setAngularVelocity(-300);
        }
    }

    /**
     * Rotate the sprite clockwise (right)
     */
    turnRight() {
        if (this.active) {
            this.ship.setAngularVelocity(300);
        }
    }

    /**
     * Stop rotating
     */
    neutral() {
        this.ship.setAngularVelocity(0);
    }

    /**
     * Fire teh lazers!!
     */
    fire(){
        this.laser.fire();
    }

    /**
     * Stop firing
     */
    stopFire(){
        this.laser.stopFire();
    }

    /**
     * Total and utter destruction of the ship.
     */
    explode() {
        let explosion_x = this.ship.x;
        let explosion_y = this.ship.y;

        this.ship.destroy();
        this.shipEmitter.on = false;

        let particles = this.scene.add.particles('blue');
        let explosion = particles.createEmitter({
            speed: 50,
            scale: {start: 1, end: 0},
            x: explosion_x,
            y: explosion_y,
            alpha: 0.5,
            blendMode: 'ADD',
            lifespan: 5000,
            quantity: 200,
            on: true
        })
        this.scene.time.delayedCall(2000, function() {
            explosion.on = false;
        });
    }


    /**
     * Set the vulnerability of the ship (invulnerable is false, vulnerable is true)
     * @param self - The current scope (this class)
     * @param delay - Delay in milliseconds until the parameter is passed through
     * @param state - The new vulnerability state (boolean)
     */
    setVulnerabilityState(self, delay , state){
        this.scene.time.delayedCall(delay, function () {
            self.invulnerable = state;
            //debugcode:
            if(self.invulnerable){
                console.log("ship invulnerable");
            } else {
                console.log("Ship vulnerable");
            }
        });
    }

    /**
     * Return the current vulnerability state
     * @returns {boolean}
     */
    getVulnerabilityState(){
        return this.invulnerable;
    }

}