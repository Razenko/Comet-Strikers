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
        this._ship = null;
        this._cursors = null;
        this._space = null;
        this._asteroids = [];
        this._level = level;
        this._alive = true;
        this._lives = 3;
    }

    /**
     Getters and setters
     */

    //Ship
    get ship() {
        return this._ship;
    }

    set ship(value) {
        this._ship = value;
    }

    //Cursors
    get cursors() {
        return this._cursors;
    }

    set cursors(value) {
        this._cursors = value;
    }

    //Space
    get space() {
        return this._space;
    }

    set space(value) {
        this._space = value;
    }

    //Asteroids
    get asteroids() {
        return this._asteroids;
    }

    set asteroids(value) {
        this._asteroids = value;
    }

    //Level
    get level() {
        return this._level;
    }

    set level(value) {
        this._level = value;
    }

    //Alive
    get alive() {
        return this._alive;
    }

    set alive(value) {
        this._alive = value;
    }

    //Lives
    get lives() {
        return this._lives;
    }

    set lives(value) {
        this._lives = value;
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
        this.load.image('laser', './game/assets/laser.png');
    }

    /**
     * Create the elements of the level, such as: the background image, the player's ship, the asteroids/comets and the input handlers.
     * @method create
     */
    create() {
        this.add.image(400, 300, 'bg');
        this.ship = new PlayerShip(this);
        this.createAsteroids(4 + this.level, 1, this.level, this.ship.sprite.x, this.ship.sprite.y, this);
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

            for (let asteroid of this.asteroids) {
                asteroid.update();
                this.physics.world.collide(this.ship.sprite, asteroid.sprite, this.onShipCollisionEvent, null, this);
            }
        }
        else {
            for (let asteroid of this.asteroids) {
                asteroid.update();
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
        if (!this.ship.invulnerable) {
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
    shipSpawn(self, delay) {
        if (this.lives > 0) {
            this.time.delayedCall(delay, function () {
                self.ship = new PlayerShip(self);
                self.alive = true;
                //self.invulnerable = true;
                //self.sprite.setVulnerabilityState(true)
            });
        }
    }

    // RespawnEvent() {
    //     if (!this.alive) {
    //         this.sprite = new PlayerShip(this);
    //         this.alive = true;
    //         this.invulnerable = true;
    //     } else {
    //         this.invulnerable = false;
    //     }
    // }
}