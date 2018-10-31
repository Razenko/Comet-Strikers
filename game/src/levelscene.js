import Util from './util.js'
import PlayerShip from './playership.js'
import Asteroid from './asteroid.js'
import Comet from './comet.js'
import UIElements from './uielements.js'

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
            key: 'level' + level
        });
        this._ship = null;
        this._controls = null;
        this._asteroids = [];
        this._childAsteroids = [];
        this._comets = [];
        this._level = level;
        this._alive = true;
        this._active = true;
        this._lives = 3;
        this._objecttracker = {
            asteroids: 0,
            childasteroids: 0,
            comets: 0
        };
        this._ui = null;
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

    //Active
    get active() {
        return this._active;
    }

    set active(value) {
        this._active = value;
    }

    //Lives
    get lives() {
        return this._lives;
    }

    set lives(value) {
        this._lives = value;
    }

    //Objecttracker
    get objecttracker() {
        return this._objecttracker;
    }

    set objecttracker(value) {
        this._objecttracker = value;
    }

    //UI
    get ui() {
        return this._ui;
    }

    set ui(value) {
        this._ui = value;
    }


    /**
     * Preload game data, such as sprite graphics and sounds.
     * @method preload
     */
    preload() {
        this.load.image('bg1', './game/assets/earth1.jpg');
        this.load.image('bg2', './game/assets/earth2.jpg');
        this.load.image('bg3', './game/assets/earth3.jpg');
        this.load.image('ship', './game/assets/ship.png');
        this.load.image('ship_icon', './game/assets/ship_icon.png');
        this.load.image('blue', './game/assets/blue_particle.png');
        this.load.image('asteroid1', './game/assets/asteroid1.png');
        this.load.image('asteroid2', './game/assets/asteroid2.png');
        this.load.image('comet1', './game/assets/comet1.png');
        this.load.image('laser', './game/assets/laser.png');
        this.load.image('rocket', './game/assets/rocket.png');
        this.load.image('rocket_icon', './game/assets/rocket_icon.png');
        this.load.image('gameover', './game/assets/gameover.png');
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
        this.add.image(400, 300, LevelScene.getRandomBackgroundImage());
        this.ship = new PlayerShip(this, 3);
        this.createAsteroids(3 + this.level, this.level, this.ship.sprite.x, this.ship.sprite.y, this);
        this.createComets(this.level - 1, this.level, this.ship.sprite.x, this.ship.sprite.y, this);
        this.objecttracker.asteroids = this.asteroids.length;
        this.objecttracker.comets = this.comets.length;
        this.ui = new UIElements(this, this.lives, this.ship.totalRockets, {x: 50, y: 30}, {
            x: 670,
            y: 30
        }, 'ship_icon', 'rocket_icon', 1, 10);
        this.ui.displayLevel("Level " + this.level);

        this.controls = {
            cursors: this.input.keyboard.createCursorKeys(),
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            ctrl: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL)
        };

        let explosion = {
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 16, first: 16}),
            frameRate: 20
        };

        this.anims.create(explosion);
    }

    /**
     * Create a given number of asteroids and push them in the corresponding array.
     * @method createAsteroids
     * @param amount - Number of asteroids to create
     * @param level - The current level as integer (For difficulty modifiers)
     * @param ship_x - The current horizontal (x-axis) position of the player
     * @param ship_y - The current vertical (y-axis) posiyion of the player
     * @param scene - The current Phaser.Scene
     */
    createAsteroids(amount, level, ship_x, ship_y, scene) {
        for (let i = 0; i < amount; i++) {
            let asteroid = new Asteroid(scene, level, 'asteroid', LevelScene.getRandomAsteroidTexture(), null, null, null, {
                x: ship_x,
                y: ship_y
            });
            this.asteroids.push(asteroid);
        }
    }

    /**
     * Create smaller asteroids based on larger parent asteroids (crumbling)
     * @param amount - Number of asteroids to create
     * @param level - The current level as integer (For difficulty modifiers)
     * @param ship_x - The current horizontal (x-axis) position of the player
     * @param ship_y - The current vertical (y-axis) position of the player
     * @param scene - The current Phaser.Scene
     * @param texture - The texture (bitmap) sprite will use
     * @param x - Initial x-axis start location
     * @param y - Initial y-axis start location
     * @param scale - Scaling factor of sprite
     */
    createChildAsteroids(amount, level, ship_x, ship_y, scene, texture, x, y, scale) {
        for (let i = 0; i < amount; i++) {
            let asteroid = new Asteroid(scene, level, 'childasteroid', texture, {
                x: x,
                y: y
            }, scale, (Util.getRandomInt(-80, 80) / 10) + 2, {x: ship_x, y: ship_y});
            this.childAsteroids.push(asteroid);
        }
    }

    /**
     * Create the more challenging comets
     * @param amount - Number of asteroids to create
     * @param level - The current level as integer (For difficulty modifiers)
     * @param ship_x - The current horizontal (x-axis) position of the player
     * @param ship_y - The current vertical (y-axis) position of the player
     * @param scene - The current Phaser.Scene
     */
    createComets(amount, level, ship_x, ship_y, scene) {
        for (let i = 0; i < amount; i++) {
            let comet = new Comet(scene, level, 'comet', 'comet1', null, null, null, {x: ship_x, y: ship_y});
            this.comets.push(comet);
        }
    }


    /**
     * Update the current game logic. Check for input events and collisions.
     * @method update
     */
    update() {
        if (this.active) {
            if (this.alive) {
                this.checkInput();
                this.ship.update();
                this.checkCollisionsAndUpdate();
                this.updateUI();
            }
            else {
                this.updateCelestialObjects();
            }
            this.checkLevelConditions(this);
        }
    }

    /**
     * Check user input and react to the respective keystrokes
     */
    checkInput() {
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
    }

    /**
     * Update the movement of all active comets and asteroids
     */
    updateCelestialObjects() {
        for (let asteroid of this.asteroids) {
            asteroid.update();
        }
        for (let childAsteroid of this.childAsteroids) {
            childAsteroid.update();
        }
        for (let comet of this.comets) {
            comet.update();
        }
    }

    /**
     * Check for collisions and update movement
     */
    checkCollisionsAndUpdate() {
        for (let asteroid of this.asteroids) {
            asteroid.update();
            this.physics.world.collide(this.ship.sprite, asteroid.sprite, this.onShipCollisionEvent, null, this);
            for (let laser of this.ship.lasers.lasers) {
                this.physics.world.overlap(asteroid.sprite, laser, this.onLaserAsteroidCollisionEvent, null, this);
            }
            for (let rocket of this.ship.rockets.rockets) {
                this.physics.world.overlap(asteroid.sprite, rocket, this.onRocketCollisionEvent, null, this);
            }
        }

        for (let childAsteroid of this.childAsteroids) {
            childAsteroid.update();
            this.physics.world.collide(this.ship.sprite, childAsteroid.sprite, this.onShipCollisionEvent, null, this);
            for (let laser of this.ship.lasers.lasers) {
                this.physics.world.overlap(childAsteroid.sprite, laser, this.onLaserChildAsteroidCollisionEvent, null, this);
            }
            for (let rocket of this.ship.rockets.rockets) {
                this.physics.world.overlap(childAsteroid.sprite, rocket, this.onRocketCollisionEvent, null, this);
            }
        }

        for (let comet of this.comets) {
            comet.update();
            this.physics.world.collide(this.ship.sprite, comet.sprite, this.onShipCollisionEvent, null, this);
            for (let laser of this.ship.lasers.lasers) {
                this.physics.world.overlap(comet.sprite, laser, this.onLaserCometCollisionEvent, null, this);
            }
            for (let rocket of this.ship.rockets.rockets) {
                this.physics.world.overlap(comet.sprite, rocket, this.onRocketCollisionEvent, null, this);
            }
        }
    }

    /**
     * Update UI changes
     */
    updateUI() {
        if (this.ui.rockets.length > this.ship.rocketsAvailable) {
            this.ui.decreaseRockets(1);
        }
    }

    /**
     * Check for winning or losing scenarios and either display a game over message or continue to the next level
     * @param self - The current scene
     */
    checkLevelConditions(self) {
        //win
        if (this.objecttracker.asteroids < 1 && this.objecttracker.childasteroids < 1 && this.objecttracker.comets < 1) {
            this.time.delayedCall(1000, function () {
                self.level++;
                self.scene.start('level' + self.level);
            });
        }

        //lose
        if (this.lives < 1) {
            this.active = false;
            this.ui.gameoverMessage("All of your ships were destroyed!!")
        }

        if (this.ship.rocketsAvailable < 1 && this.ship.rockets.rockets.length < 1 && this.objecttracker.comets > 0 && this.alive) {
            this.active = false;
            this.ui.gameoverMessage("No rockets left to kill the remaining comet(s)");
        }

    }

    /**
     * Called when a ship collides with an asteroid or comet.
     * Destroys current ship if ship is not invulnerable.
     * @method onShipCollisionEvent
     */
    onShipCollisionEvent() {
        if (!this.ship.invulnerable) {
            this.alive = false;
            this.ship.explode();
            this.lives--;
            this.ui.decreaseLives(1);
            this.shipSpawn(this, 3000);
        }
    }

    /**
     * Destroy the asteroid  when colliding with lasers and create new asteroid fragments (childAsteroids)
     * @param asteroidSprite - The respective asteroid sprite that is in collision
     * @param laser - The laser sprite responsible for said destruction
     */
    onLaserAsteroidCollisionEvent(asteroidSprite, laser) {
        this.explosion(asteroidSprite.x, asteroidSprite.y, asteroidSprite.scaleX * 2);
        let modifier = 0;
        if (asteroidSprite.scaleX < 0.5) {
            modifier = 2;
        } else {
            modifier = 3;
        }
        this.createChildAsteroids(modifier, this.level, this.ship.sprite.x, this.ship.sprite.y, this, asteroidSprite.texture.key, asteroidSprite.x, asteroidSprite.y, (asteroidSprite.scaleX / modifier));
        this.objecttracker.childasteroids += modifier;
        laser.destroy();
        asteroidSprite.destroy();
        this.objecttracker.asteroids--;
        this.ship.lasers.removeElement(laser);
    }

    /**
     * Destroy asteroid fragments on collision with lasers
     * @param asteroidSprite - The asteroid fragment sprite
     * @param laser - The laser sprite
     */
    onLaserChildAsteroidCollisionEvent(asteroidSprite, laser) {
        this.explosion(asteroidSprite.x, asteroidSprite.y, asteroidSprite.scaleX * 2);
        laser.destroy();
        asteroidSprite.destroy();
        this.objecttracker.childasteroids--;
        this.ship.lasers.removeElement(laser);
    }

    /**
     * Lasers are not strong enough to destroy comets, only leaving an explosion of impact
     * @param cometSprite - Sprite of comet
     * @param laser - Sprite of laser
     */
    onLaserCometCollisionEvent(cometSprite, laser) {
        this.explosion(laser.x, laser.y, cometSprite.scaleX * 0.5);
        laser.destroy();
        this.ship.lasers.removeElement(laser);
    }

    /**
     * Destruction of asteroids/comets due to rockets
     * @param sprite - The asteroid/comet sprite
     * @param rocket - The rocket sprite
     */
    onRocketCollisionEvent(sprite, rocket) {
        this.explosion(sprite.x, sprite.y, sprite.scaleX * 2);
        if (sprite.name === 'asteroid') {
            this.objecttracker.asteroids--;
        }
        if (sprite.name === 'childasteroid') {
            this.objecttracker.childasteroids--;

        }
        if (sprite.name === 'comet') {
            this.objecttracker.comets--;
        }

        rocket.destroy();
        sprite.destroy();
        this.ship.rockets.removeElement(rocket);
    }

    /**
     * Create an animated explosion
     * @param x - x-position
     * @param y - y-position
     * @param scale - scale
     */
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
                self.ship = new PlayerShip(self, self.ship.rocketsAvailable);
                self.alive = true;
            });
        }
    }

    /**
     * Return a random asteroid texture from array
     * @returns {string} - return value
     */
    static getRandomAsteroidTexture() {
        let textures = ['asteroid1', 'asteroid2'];
        return textures[Util.getRandomInt(0, 1)];
    }

    /**
     * Return a random background image
     * @returns {string} - return value
     */
    static getRandomBackgroundImage() {
        let images = ['bg1', 'bg2', 'bg3'];
        return images[Util.getRandomInt(0, 2)];
    }
}