import Util from './util.js'
import Laser from './laser.js'

/**
 * @classdesc
 * The sprite which is controlled by the player. Creates the sprite and provides control mechanisms.
 * Also handles the thrusters particle effects (engine exhaust trail).
 * @class PlayerShip - Represents the sprite the player uses.
 * @extends Phaser.GameObjects.Sprite
 * @constructor scene - The current Phaser.Scene
 */
export default class PlayerShip extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene);
        this._scene = scene;
        this._sprite = null;
        this._active = true;
        this._invulnerable = false;
        this._shipEmitter = null;
        this._emitterDeathZone = null;
        this._laser = null;
        this.create(scene);
    }

    /**
     Getters and setters
     */

    //Laser
    get laser() {
        return this._laser;
    }

    set laser(value) {
        this._laser = value;
    }

    //EmitterDeathZone
    get emitterDeathZone() {
        return this._emitterDeathZone;
    }

    set emitterDeathZone(value) {
        this._emitterDeathZone = value;
    }

    //ShipEmitter
    get shipEmitter() {
        return this._shipEmitter;
    }

    set shipEmitter(value) {
        this._shipEmitter = value;
    }

    //Invulnerable
    get invulnerable() {
        return this._invulnerable;
    }

    set invulnerable(value) {
        this._invulnerable = value;
    }

    //Active
    get active() {
        return this._active;
    }

    set active(value) {
        this._active = value;
    }

    //Ship
    get sprite() {
        return this._sprite;
    }

    set sprite(value) {
        this._sprite = value;
    }

    //Scene
    get scene() {
        return this._scene;
    }

    set scene(value) {
        this._scene = value;
    }

    /**
     * Create a new sprite and the associated thruster effects
     * @method create
     */
    create() {
        this.invulnerable = true;
        console.log("Ship spawned, vulnerability set to true");
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

        this.sprite = this.scene.physics.add.image(400, 400, 'ship');
        this.sprite.setDamping(true);
        this.sprite.setDrag(0.99);
        this.sprite.setMaxVelocity(200);
        this.sprite.setVelocity(0, 0);
        this.sprite.setBounce(1, 1);
        this.sprite.angle = -90;
        this.sprite.setCollideWorldBounds(false);
        this.emitterDeathZone = new Phaser.Geom.Circle(this.sprite.x, this.sprite.y, 50);
        this.laser = new Laser(this.scene, 58);
        console.log("Disable invulnerability event started");
        this.setVulnerabilityState(this, 2000, false);


    }

    /**
     * Update the sprite's position (together with laser and thrusters).
     * @method update
     */
    update() {
        this.scene.physics.world.wrap(this.sprite, 32);
        let emitterPosition = Util.getAnglePos(30, this.sprite.angle, this.sprite.x, this.sprite.y);
        this.shipEmitter.setPosition(emitterPosition.x, emitterPosition.y);
        //this.shipEmitter.setAngle({min: this.sprite.angle + 180, max: this.sprite.angle + 180, steps: 32});
        this.shipEmitter.setAngle(this.sprite.angle + 180);
        let deathzonePosition = Util.getAnglePos(-20, this.sprite.angle, this.sprite.x, this.sprite.y);
        this.emitterDeathZone.setPosition(deathzonePosition.x, deathzonePosition.y);
        this.shipEmitter.setDeathZone(new Phaser.GameObjects.Particles.Zones.DeathZone(this.emitterDeathZone, true));
        this.laser.update(this.sprite.x, this.sprite.y, this.sprite.angle);
    }

    // /**
    //  * Returns the current sprite object
    //  * @returns {null|*}
    //  */
    // getPlayerShip() {
    //     return this.sprite;
    // }

    /**
     * Accelerate the sprite forward.
     *
     */

    accelerate() {
        if (this.active) {
            this.scene.physics.velocityFromRotation(this.sprite.rotation, 200, this.sprite.body.acceleration);
            this.shipEmitter.on = true;
        }

    }

    /**
     * Stop/reverse the sprite.
     *
     */
    deAccelerate() {
        if (this.active) {
            this.scene.physics.velocityFromRotation(this.sprite.rotation, -50, this.sprite.body.acceleration);
            this.shipEmitter.on = false;
        }
    }

    /**
     * Disable thrusters and float
     */
    noAcceleration() {
        this.sprite.setAcceleration(0);
        this.shipEmitter.on = false;
    }

    /**
     * Rotate the sprite counterclockwise (left)
     */
    turnLeft() {
        if (this.active) {
            this.sprite.setAngularVelocity(-300);
        }
    }

    /**
     * Rotate the sprite clockwise (right)
     */
    turnRight() {
        if (this.active) {
            this.sprite.setAngularVelocity(300);
        }
    }

    /**
     * Stop rotating
     */
    neutral() {
        this.sprite.setAngularVelocity(0);
    }

    /**
     * Fire teh lazers!!
     */
    fire() {
        this.laser.fire();
    }

    /**
     * Stop firing
     */
    stopFire() {
        this.laser.stopFire();
    }

    /**
     * Total and utter destruction of the sprite.
     */
    explode() {
        let explosion_x = this.sprite.x;
        let explosion_y = this.sprite.y;

        this.sprite.destroy();
        this.shipEmitter.on = false;
        this.stopFire();

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
        });
        this.scene.time.delayedCall(2000, function () {
            explosion.on = false;
        });
    }


    /**
     * Set the vulnerability of the sprite (invulnerable is false, vulnerable is true)
     * @param self - The current scope (this class)
     * @param delay - Delay in milliseconds until the parameter is passed through
     * @param state - The new vulnerability state (boolean)
     */
    setVulnerabilityState(self, delay, state) {
        this.scene.time.delayedCall(delay, function () {
            self.invulnerable = state;
            //debugcode:
            if (self.invulnerable) {
                console.log("sprite invulnerable");
            } else {
                console.log("Ship vulnerable");
            }
        });
    }

    /**
     * Return the current vulnerability state
     * @returns {boolean}
     */
    getVulnerabilityState() {
        return this.invulnerable;
    }

}