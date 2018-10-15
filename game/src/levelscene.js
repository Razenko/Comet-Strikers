import Util from './util.js'
import PlayerShip from './playership.js'
// import CelestialObject from './celestialobject.js'
import Asteroid from './asteroid.js'

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
        // this._cursors = null;
        // this._space = null;
        // this._ctrl = null;
        this._controls = null;
        this._asteroids = [];
        this._childAsteroids = [];
        this._comets = [];
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

    //Controls
    get controls() {
        return this._controls;
    }

    set controls(value) {
        this._controls = value;
    }

    //
    // //Cursors
    // get cursors() {
    //     return this._cursors;
    // }
    //
    // set cursors(value) {
    //     this._cursors = value;
    // }
    //
    // //Space
    // get space() {
    //     return this._space;
    // }
    //
    // set space(value) {
    //     this._space = value;
    // }
    //
    // //Ctrl
    // get ctrl() {
    //     return this._ctrl;
    // }
    //
    // set ctrl(value) {
    //     this._ctrl = value;
    // }

    //Asteroids
    get asteroids() {
        return this._asteroids;
    }

    set asteroids(value) {
        this._asteroids = value;
    }

    //ChildAsteroids
    get childAsteroids() {
        return this._childAsteroids;
    }

    set childAsteroids(value) {
        this._childAsteroids = value;
    }

    //Comets
    get comets() {
        return this._comets;
    }

    set comets(value) {
        this._comets = value;
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
        this.load.image('rocket', './game/assets/rocket.png');
        this.load.spritesheet('explosion', './game/assets/explosion.png', {
            frameWidth: 128,
            frameHeight: 128,
            endFrame: 16
        });
    }

    /**
     * Create the elements of the level, such as: the background image, the player's ship, the asteroids/comets and the input handlers.
     * @method create
     */
    create() {
        this.add.image(400, 300, 'bg');
        this.ship = new PlayerShip(this);
        this.createAsteroids(4 + this.level, 'asteroid', this.level, this.ship.sprite.x, this.ship.sprite.y, this);

        this.controls = {
            cursors: this.input.keyboard.createCursorKeys(),
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            ctrl: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL)
        };

        // this.cursors = this._input.keyboard.createCursorKeys();
        // this.space = this._input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // this.ctrl = this._input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

        let config = {
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 16, first: 16}),
            frameRate: 20
        };

        this.anims.create(config);
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
            let asteroid = new Asteroid(scene, type, level, null, null, null, ship_x, ship_y);
            this.asteroids.push(asteroid);
        }
    }

    createChildAsteroids(amount, level, ship_x, ship_y, scene, x, y, scale) {
        for (let i = 0; i < amount; i++) {
            let asteroid = new Asteroid(scene, 'child_asteroid', level, {
                x: x,
                y: y
            }, scale, (Util.getRandomInt(-80, 80) / 10) + 2, ship_x, ship_y);
            // asteroid.sprite.setPosition(x, y);
            // asteroid.sprite.setScale(scale);
            this.childAsteroids.push(asteroid);
        }
    }


    /**
     * Update the current game logic. Check for input events and collisions.
     * @method update
     */
    update() {
        if (this.alive) {
            if (this.controls.cursors.up.isDown) {
                this.ship.accelerate();
            }
            else if (this.controls.cursors.down.isDown) {
                this.ship.deAccelerate();
            }
            else {
                this.ship.noAcceleration();
            }

            if (this.controls.cursors.left.isDown) {
                this.ship.turnLeft();
            }
            else if (this.controls.cursors.right.isDown) {
                this.ship.turnRight();
            }
            else {
                this.ship.neutral();
            }

            if (this.controls.space.isDown) {
                this.ship.fireLasers()
            } else {
                this.ship.stopFireLasers();
            }

            if (this.controls.ctrl.isDown) {
                this.ship.fireRockets()
            } else {
                this.ship.stopFireRockets();
            }

            this.ship.update();
            this.checkCollisionsAndUpdate();


        }
        else {

            this.updateCelestialObjects();

        }
    }

    updateCelestialObjects() {
        for (let asteroid of this.asteroids) {
            asteroid.update();
        }
        for (let childAsteroid of this.childAsteroids) {
            childAsteroid.update();
        }
    }

    checkCollisionsAndUpdate() {
        for (let asteroid of this.asteroids) {
            asteroid.update();
            this.physics.world.collide(this.ship.sprite, asteroid.sprite, this.onShipCollisionEvent, null, this);
            for (let laser of this.ship.lasers.lasers) {
                this.physics.world.overlap(asteroid.sprite, laser, this.onLaserAsteroidCollisionEvent, null, this);
            }
        }

        for (let childAsteroid of this.childAsteroids) {
            childAsteroid.update();
            this.physics.world.collide(this.ship.sprite, childAsteroid.sprite, this.onShipCollisionEvent, null, this);
            for (let laser of this.ship.lasers.lasers) {
                this.physics.world.overlap(childAsteroid.sprite, laser, this.onLaserChildAsteroidCollisionEvent, null, this);
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

    onLaserAsteroidCollisionEvent(asteroidSprite, laser) {
        this.explosion(asteroidSprite.x, asteroidSprite.y, asteroidSprite.scaleX * 2);
        let modifier = 0;
        if (asteroidSprite.scaleX < 0.5) {
            modifier = 2;
        } else {
            modifier = 3;
        }
        this.createChildAsteroids(modifier, this.level, this.ship.sprite.x, this.ship.sprite.y, this, asteroidSprite.x, asteroidSprite.y, (asteroidSprite.scaleX / modifier));
        laser.destroy();
        asteroidSprite.destroy();
        this.ship.lasers.lasers.splice(this.ship.lasers.lasers.indexOf(laser));
    }

    onLaserChildAsteroidCollisionEvent(asteroidSprite, laser) {
        this.explosion(asteroidSprite.x, asteroidSprite.y, asteroidSprite.scaleX * 2);
        laser.destroy();
        asteroidSprite.destroy();
        this.ship.lasers.lasers.splice(this.ship.lasers.lasers.indexOf(laser));
    }

    explosion(x, y, scale) {
        let explosion = this.add.sprite(x, y, 'explosion');
        explosion.setScale(scale);
        explosion.anims.play('explode');
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

    // isOriginalAsteroid(sprite, collection) {
    //     for (let object of collection) {
    //         if (object instanceof Asteroid) {
    //             if (sprite === object.sprite) {
    //                 console.log(object.object_type);
    //                 return object.object_type === 'asteroid';
    //             }
    //         }
    //     }
    //     return null;
    // }

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