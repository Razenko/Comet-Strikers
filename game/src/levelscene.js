import Util from './util.js'
import PlayerShip from './playership.js'
import CelestialObject from './celestialobject.js'

/**
 * @classdesc
 * Creates a new playing field (level) for the game.
 * Preloads game assets into memory from server and instantiates objects.
 * @class LevelScene - Class representing a level of the game.
 * @extends Phaser.Scene
 * @constructor The current level as integer (used for difficulty scaling)
 */
export default class LevelScene extends Phaser.Scene {
    constructor(level) {
        super({
            key: 'LevelScene'
        });
        this.ship = null;
        this.cursors = null;
        this.space = null;
        this.asteroids = [];
        this.level = level;
        this.alive = true;
        this.lives = 3;
    }

    /**
     * Preload game data, such as sprite graphics and sounds.
     * @method preload
     */
    preload() {
        this.load.image('bg', './game/assets/earth1.jpg');
        this.load.image('ship', './game/assets/ship.png');
        this.load.image('blue', './game/assets/blue_particle.png');
        this.load.image('asteroid1', './game/assets/asteroid1.png');
    }

    /**
     * Create the elements of the level, such as: the background image, the player's ship, the asteroids/comets and the input handlers.
     * @method create
     */
    create() {
        this.add.image(400, 300, 'bg');
        this.ship = new PlayerShip(this);
        //this.shipSpawn(this, 0);
        this.createAsteroids(4 + this.level, 1, this.level, this.ship.getPlayerShip().x, this.ship.getPlayerShip().y, this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    /**
     * Create a given number of asteroids and push them in the corresponding array.
     * @method createAsteroids
     * @param amount - Number of asteroids to create
     * @param type - Object type (asteroid or comet)
     * @param level - The current level as integer (For difficulty modifiers)
     * @param ship_x - The current horizontal (x-axis) position of the player
     * @param ship_y - The current vertical (y-axis) posiyion of the player
     * @param scene - The current Phaser.Scene
     */
    createAsteroids(amount, type, level, ship_x, ship_y, scene) {
        for (let i = 0; i < amount; i++) {
            let asteroid = new CelestialObject(scene, type, level, ship_x, ship_y);
            this.asteroids.push(asteroid);
        }
    }

    /**
     * Update the current game logic. Check for input events and collisions.
     * @method update
     */
    update() {
        if (this.alive) {
            if (this.cursors.up.isDown) {
                this.ship.accelerate();
            }
            else if (this.cursors.down.isDown) {
                this.ship.deAccelerate();
            }
            else {
                this.ship.noAcceleration();
            }

            if (this.cursors.left.isDown) {
                this.ship.turnLeft();

            }
            else if (this.cursors.right.isDown) {
                this.ship.turnRight();


            }
            else {
                this.ship.neutral();

            }

            if (this.space.isDown) {
                this.ship.fire()
            } else {
                this.ship.stopFire();
            }

            this.ship.update();

            for (let i = 0; i < this.asteroids.length; i++) {
                this.asteroids[i].update();

                //this.physics.world.collide(this.ship.getPlayerShip(), this.asteroids[i].getCelestialObject(), null, null, this);

                this.physics.world.collide(this.ship.getPlayerShip(), this.asteroids[i].getCelestialObject(), this.onShipCollisionEvent, null, this);


            }
        }
        else {
            for (let i = 0; i < this.asteroids.length; i++) {
                this.asteroids[i].update();
            }

        }
    }

    /**
     * Called when a ship collides with an asteroid or comet.
     * Destroys current ship if ship is not invulnerable.
     * @method onShipCollisionEvent
     */
    onShipCollisionEvent() {
        // let respawntimer = this.time.addEvent({
        //     delay: 4000,
        //     callback: this.RespawnEvent,
        //     callbackScope: this,
        //     repeat: 1,
        //     startAt: 2000
        // })
        if (!this.ship.getVulnerabilityState()) {
            this.alive = false;
            this.ship.explode();
            this.lives--;
            this.shipSpawn(this, 3000);
        }
    }

    /**
     * Spawn a new ship if player has any lives left
     * @method shipSpawn
     * @param self - The current Phaser.Scene
     * @param delay - Delay spawning with a given number of milliseconds
     */
    shipSpawn(self, delay){
        if (this.lives > 0) {
            this.time.delayedCall(delay, function () {
                self.ship = new PlayerShip(self);
                self.alive = true;
                //self.invulnerable = true;
                //self.ship.setVulnerabilityState(true)
            });
        }
    }

    // RespawnEvent() {
    //     if (!this.alive) {
    //         this.ship = new PlayerShip(this);
    //         this.alive = true;
    //         this.invulnerable = true;
    //     } else {
    //         this.invulnerable = false;
    //     }
    // }
}