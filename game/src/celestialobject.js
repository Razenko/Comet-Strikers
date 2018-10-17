import Util from './util.js'

/**
 * @classdesc
 * Class representing a celestial object (asteroid or comet)
 * @class CelestialObject
 * @extends Phaser.GameObjects.Sprite
 * @constructor scene - The current Phaser.Scene
 * @constructor object_type - The object type (asteroid or comet, boolean)
 * @constructor level - The current level as integer (for difficulty modifiers)
 * @constructor ship_x - The ship's x-axis
 * @constructor ship_y - The ship's y-axis
 */
export default class CelestialObject extends Phaser.GameObjects.Sprite {
    constructor(scene, level, texture, spawnpoint, scale, rotation, ship) {
        super(scene);
        this._scene = scene;
        this._level = level;
        // this._object_type = object_type;
        // this._spawnpoint = spawnpoint;
        // this._scale = scale;
        // this._ship_x = ship_x;
        // this._ship_y = ship_y;
        this._sprite = null;
        // this._rotation = rotation;
        this._spriteConfig = {
            texture: texture,
            spawnpoint: spawnpoint,
            scale: scale,
            sizeBoundaries: {min: 35, max: 65},
            rotation: rotation,
            ship: ship
        }
        //this.create();
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

    // //Object_type
    // get object_type() {
    //     return this._object_type;
    // }
    //
    // set object_type(value) {
    //     this._object_type = value;
    // }
    //
    // //Spawnpoint
    // get spawnpoint() {
    //     return this._spawnpoint;
    // }
    //
    // set spawnpoint(value) {
    //     this._spawnpoint = value;
    // }
    //
    // //Scale
    // get scale() {
    //     return this._scale;
    // }
    //
    // set scale(value) {
    //     this._scale = value;
    // }
    //
    // //Rotation
    // get rotation() {
    //     return this._rotation;
    // }
    //
    // set rotation(value) {
    //     this._rotation = value;
    // }

    //Level
    get level() {
        return this._level;
    }

    set level(value) {
        this._level = value;
    }

    //
    // //Ship_x
    // get ship_x() {
    //     return this._ship_x;
    // }
    //
    // set ship_x(value) {
    //     this._ship_x = value;
    // }
    //
    // //Ship_y
    // get ship_y() {
    //     return this._ship_y;
    // }
    //
    // set ship_y(value) {
    //     this._ship_y = value;
    // }

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
        // const sizeBoundaries = { //Minimum and maximum size of the sprite in percentages based on original image
        //     min: 35,
        //     max: 65
        // };
        if (this.spriteConfig.spawnpoint == null) {
            this.spriteConfig.spawnpoint = CelestialObject.getSafeSpawnpoint(this.spriteConfig.ship.x, this.spriteConfig.ship.y);
        }
        if (this.spriteConfig.scale == null) {
            this.spriteConfig.scale = Util.getRandomInt(this.spriteConfig.sizeBoundaries.min, this.spriteConfig.sizeBoundaries.max) / 100;
        }
        if (this.spriteConfig.rotation == null) {
            this.spriteConfig.rotation = Util.getRandomInt(-20, 20) / 10;
        }
        this.sprite = this.scene.physics.add.image(this.spriteConfig.spawnpoint.x, this.spriteConfig.spawnpoint.y, this.spriteConfig.texture);
        this.sprite.setCircle(70);
        this.sprite.setScale(this.spriteConfig.scale);
        this.sprite.setMaxVelocity(200);
        this.sprite.setVelocity(Util.getRandomInt(-100, 100), Util.getRandomInt(-100, 100));
        this.sprite.setBounce(1, 1);
        this.sprite.setCollideWorldBounds(false);
    }

    /**
     * Update the position and rotation of the asteroid or comet.
     */
    update() {
        this.sprite.angle += this.spriteConfig.rotation;
        this.scene.physics.world.wrap(this.sprite, 64);
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