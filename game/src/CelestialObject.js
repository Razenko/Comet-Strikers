import Util from './Util.js'

export default class CelestialObject extends Phaser.GameObjects.Sprite {
    constructor(scene, object_type, level, ship_x, ship_y) {
        super(scene);
        this.scene = scene;
        this.level = level;
        this.object_type = object_type;
        this.ship_x = ship_x;
        this.ship_y = ship_y;
        this.celestialObject = null;
        this.util = new Util();
        this.create();

    }

    create() {
        let spawnPoint = this.getSafeSpawnpoint();
        this.celestialObject = this.scene.physics.add.image(spawnPoint.x, spawnPoint.y, 'asteroid1');
        this.celestialObject.setCircle(70);
        this.celestialObject.setScale(this.util.getRandomInt(3, 7) / 10);
        this.celestialObject.setMaxVelocity(200);
        this.celestialObject.setVelocity(this.util.getRandomInt(-100, 100), this.util.getRandomInt(-100, 100));
        this.celestialObject.setBounce(1, 1);

        this.celestialObject.setCollideWorldBounds(false);

        if (this.celestialObject.x >= (this.ship_x - 150) && this.celestialObject.x <= (this.ship_x + 150)) {
            if (this.celestialObject.x > this.ship_x) {
                this.celestialObject.x += 100;
            } else {
                this.celestialObject.x -= 100
            }
        }
        if (this.celestialObject.y >= (this.ship_y - 150) && this.celestialObject.y <= (this.ship_y + 150)) {
            if (this.celestialObject.y > this.ship_y) {
                this.celestialObject.y += 100;
            } else {
                this.celestialObject.y -= 100
            }
        }
    }


    getSafeSpawnpoint() {
        let x = this.util.getRandomInt(50, 750);
        let y = this.util.getRandomInt(50, 450);
        if (x >= (this.ship_x - 150) && x <= (this.ship_x + 150)) {
            if (x > this.ship_x) {
                x += 100;
            } else {
                x -= 100;
            }
        }
        if (y >= (this.ship_y - 150) && y <= (this.ship_y + 150)) {
            if (y > this.ship_y) {
                y += 100;
            } else {
                y -= 100;
            }
        }

        return {x, y}
    }

    update() {
        this.celestialObject.angle += 1;
        this.scene.physics.world.wrap(this.getCelestialObject(), 64);
    }

    getCelestialObject() {
        return this.celestialObject;
    }
}