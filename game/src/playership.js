import Util from './util.js'
import Laser from './laser.js'
import Rocket from './rocket.js'

/**
 * @classdesc
 * The ship which is controlled by the player. Creates the ship and provides control mechanisms.
 * Also handles the thrusters particle effects (engine exhaust trail).
 * @class PlayerShip - Represents the ship the player uses.
 * @extends Phaser.GameObjects.Sprite
 * @constructor scene - The current Phaser.Scene
 */
export default class PlayerShip extends Phaser.GameObjects.Sprite {

    constructor(scene, totalrockets) {
        super(scene);
        this._scene = scene;
        this._sprite = null;
        this._active = true;
        this._invulnerable = false;
        this._shipEmitter = null;
        this._emitterDeathZone = null;
        this._lasers = null;
        this._rockets = null;
        this._totalRockets = totalrockets;
        this.create(scene);
    }

    /**
     Getters and setters
     */

    //Laser
    get lasers() {
        return this._lasers;
    }

    set lasers(value) {
        this._lasers = value;
    }

    //Rockets
    get rockets() {
        return this._rockets;
    }

    set rockets(value) {
        this._rockets = value;
    }

    get rocketsAvailable() {
        if (this.rockets != null) {
            return this.rockets.amount;
        }
    }

    get totalRockets() {
        return this._totalRockets;
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
     * Create a new ship and the associated thruster effects
     * @method create
     */
    create() {
        this.invulnerable = true;
        let particles = this.scene.add.particles('blue');
        this.shipEmitter = particles.createEmitter({
            speed: 1,
            scale: {start: 1, end: 0},
            alpha: 0.5,
            blendMode: 'ADD',
            lifespan: 1000,
            quantity: 1,
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
        this.lasers = new Laser(this.scene, 58);
        this.rockets = new Rocket(this.scene, 58, this.totalRockets);
        this.setVulnerabilityState(this, 2000, false);
    }

    /**
     * Update the ship's position (together with laser and thrusters).
     * @method update
     */
    update() {
        this.scene.physics.world.wrap(this.sprite, 32);
        let emitterPosition = Util.getAnglePos(30, this.sprite.angle, this.sprite.x, this.sprite.y);
        this.shipEmitter.setPosition(emitterPosition.x, emitterPosition.y);
        this.shipEmitter.setAngle(this.sprite.angle + 180);
        let deathzonePosition = Util.getAnglePos(-20, this.sprite.angle, this.sprite.x, this.sprite.y);
        this.emitterDeathZone.setPosition(deathzonePosition.x, deathzonePosition.y);
        this.shipEmitter.setDeathZone(new Phaser.GameObjects.Particles.Zones.DeathZone(this.emitterDeathZone, true));
        this.lasers.update();
        this.rockets.update();
    }

    /**
     * Accelerate the ship forward.
     *
     */
    accelerate() {
        if (this.active) {
            this.scene.physics.velocityFromRotation(this.sprite.rotation, 200, this.sprite.body.acceleration);
            this.shipEmitter.on = true;
        }
    }

    /**
     * Stop/reverse the ship.
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
     * Rotate the ship counterclockwise (left)
     */
    turnLeft() {
        if (this.active) {
            this.sprite.setAngularVelocity(-300);
        }
    }

    /**
     * Rotate the ship clockwise (right)
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
    fireLasers() {
        this.lasers.fire(this.sprite.x, this.sprite.y, this.sprite.angle);
    }

    /**
     * Stop firing lasers
     */
    stopFireLasers() {
        this.lasers.stopFire();
    }

    /**
     * Fire rockets!!
     */
    fireRockets() {
        this.rockets.fire(this.sprite.x, this.sprite.y, this.sprite.angle);
    }

    /**
     * Stop firing rockets
     */
    stopFireRockets() {
        this.rockets.stopFire();
    }

    /**
     * Total and utter destruction of the ship.
     */
    explode() {
        let explosion_x = this.sprite.x;
        let explosion_y = this.sprite.y;

        this.sprite.destroy();
        this.shipEmitter.on = false;
        this.stopFireLasers();
        this.stopFireRockets();

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
     * Set the vulnerability of the ship (invulnerable is false, vulnerable is true)
     * @param self - The current scope (this class)
     * @param delay - Delay in milliseconds until the parameter is passed through
     * @param state - The new vulnerability state (boolean)
     */
    setVulnerabilityState(self, delay, state) {
        this.scene.time.delayedCall(delay, function () {
            self.invulnerable = state;
        });
    }
}