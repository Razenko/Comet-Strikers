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

    //RocketsAvailable
    get rocketsAvailable() {
        if (this.rockets != null) {
            return this.rockets.amount;
        }
    }

    //TotalRockets
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
        this.invulnerable = true; //Start off indestructible so player wont immediately get smashed (grace period)
        let particles = this.scene.add.particles('blue'); //Add particle emitter for exhaust trail
        this.shipEmitter = particles.createEmitter({
            speed: 1,
            scale: {start: 1, end: 0},
            alpha: 0.5,
            blendMode: 'ADD',
            lifespan: 1000,
            quantity: 1,
            on: false
        });

        this.sprite = this.scene.physics.add.image(400, 400, 'ship'); //Create ship sprite
        this.sprite.setDamping(true); //Make sure ship does not glide on forever
        this.sprite.setDrag(0.99); //Prevent from stopping instantly
        this.sprite.setMaxVelocity(200); //Maximum speed
        this.sprite.setVelocity(0, 0); //Starting speed
        this.sprite.setBounce(1, 1); //Give it some weight
        this.sprite.angle = -90; //Set starting angle
        this.sprite.setCollideWorldBounds(false); //Wont collide with playing field edges
        this.emitterDeathZone = new Phaser.Geom.Circle(this.sprite.x, this.sprite.y, 50); //Create a zone which will block the emitter (to prevent ship and emitter overlap)
        this.lasers = new Laser(this.scene, 58); //Create a pair of lasers with a distance of 58 pixels between them
        this.rockets = new Rocket(this.scene, 58, this.totalRockets); //Create a limited number of rockets pairs (same distance again)
        this.setVulnerabilityState(this, 2000, false); //Disable the grace period after two seconds
    }

    /**
     * Update the ship's position (together with laser and thrusters).
     * @method update
     */
    update() {
        this.scene.physics.world.wrap(this.sprite, 32); //Make sure the ship stays within the playing field
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

        //Destroy the ship
        this.sprite.destroy();
        this.shipEmitter.on = false;
        this.stopFireLasers();
        this.stopFireRockets();

        //Create particle emitter explosion
        let particles = this.scene.add.particles('fire');
        let explosion = particles.createEmitter({
            speed: 100,
            scale: {start: 0.5, end: 0},
            x: explosion_x,
            y: explosion_y,
            alpha: 0.5,
            blendMode: 'SCREEN',
            lifespan: 3000,
            quantity: 100,
            on: true
        });

        //Disable particle emitter after a second
        this.scene.time.delayedCall(1000, function () {
            explosion.on = false;
        });
    }


    /**
     * Set the vulnerability of the ship
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