import Util from './util.js'

/**
 * @classdesc
 * Class representing a celestial object (asteroid or comet)
 * @class CelestialObject
 * @extends Phaser.GameObjects.Sprite
 * @constructor scene - The current Phaser.Scene
 * @constructor level - The current level as integer (for difficulty modifiers)
 * @constructor name - The name of the object
 * @constructor texture - The texture to be used as sprite
 * @constructor spawnpoint - A predefined spawnpoint, set null for random spawn location.
 * @constructor scale - A predefined scale, set null for random scale.
 * @constructor rotation - The speed of rotation, set null for random rotation value.
 * @constructor ship - The location of the ship.
 */
export default class CelestialObject extends Phaser.GameObjects.Sprite {
    constructor(scene, level, name, texture, spawnpoint, scale, rotation, ship) {
        super(scene);
        this._scene = scene;
        this._level = level;
        this._name = name;
        this._sprite = null;
        this._spriteConfig = {
            texture: texture,
            spawnpoint: spawnpoint,
            scale: scale,
            sizeBoundaries: {min: 0, max: 100},
            rotation: rotation,
            ship: ship
        }
    }

    /**
     Getters and setters
     */

    //Scene
    get scene() {
        return this._scene;
    }

    set scene(value) {
        this._scene = value;
    }

    //SpriteConfig
    get spriteConfig() {
        return this._spriteConfig;
    }

    set spriteConfig(value) {
        this._spriteConfig = value;
    }

    //Level
    get level() {
        return this._level;
    }

    set level(value) {
        this._level = value;
    }

    //Name
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    //Sprite
    get sprite() {
        return this._sprite;
    }

    set sprite(value) {
        this._sprite = value;
    }

    /**
     * Create a new asteroid or comet
     */
    create() {
        if (this.spriteConfig.spawnpoint == null) {
            this.spriteConfig.spawnpoint = CelestialObject.getSafeSpawnpoint(this.spriteConfig.ship.x, this.spriteConfig.ship.y); //Create random spawnpoint if none is given
        }
        if (this.spriteConfig.scale == null) {
            this.spriteConfig.scale = Util.getRandomInt(this.spriteConfig.sizeBoundaries.min, this.spriteConfig.sizeBoundaries.max) / 100; //Create random sprite scale if none is given (within predetermined boundaries)
        }
        if (this.spriteConfig.rotation == null) {
            this.spriteConfig.rotation = Util.getRandomInt(-20, 20) / 10; //Create random rotation value if none is given
        }
        this.sprite = this.scene.physics.add.image(this.spriteConfig.spawnpoint.x, this.spriteConfig.spawnpoint.y, this.spriteConfig.texture); //Create sprite
        this.sprite.name = this.name;
        this.sprite.setCircle(70); //Set boundaries for collision detection
        this.sprite.setScale(this.spriteConfig.scale);
        this.sprite.setMaxVelocity(200); //Set maximum velocity (speed)
        this.sprite.setVelocity(CelestialObject.getValidRandomVelocity(), CelestialObject.getValidRandomVelocity()); //Create a random velocity value within predetermined parameters.
        this.sprite.setBounce(1, 1); //Give it some weight
        this.sprite.setCollideWorldBounds(false); //Disallow colliding with the edges of the playing field
    }

    /**
     * Update the position and rotation of the asteroid or comet.
     */
    update() {
        this.sprite.angle += this.spriteConfig.rotation; //Update the rotation
        this.scene.physics.world.wrap(this.sprite, 64); //Keep it within the playing field
    }

    /**
     * Get a valid randomized velocity value (to prevent very slow movement)
     * @returns {number} - Random integer
     */
    static getValidRandomVelocity() {
        let velocity = 0;
        while (velocity > -50 && velocity < 50) {
            velocity = Util.getRandomInt(-100, 100);
        }

        return velocity;
    }


    /**
     * Get a safe spawnpoint for the asteroid or comet so that it does not overlap the player's position.
     * @param ship_x
     * @param ship_y
     * @returns {{x: *, y: *}}
     */
    static getSafeSpawnpoint(ship_x, ship_y) {
        let x = Util.getRandomInt(50, 750);
        let y = Util.getRandomInt(50, 450);
        if (x >= (ship_x - 150) && x <= (ship_x + 150)) {
            if (x > ship_x) {
                x += 100;
            } else {
                x -= 100;
            }
        }
        if (y >= (ship_y - 150) && y <= (ship_y + 150)) {
            if (y > ship_y) {
                y += 100;
            } else {
                y -= 100;
            }
        }

        return {x, y}
    }
}