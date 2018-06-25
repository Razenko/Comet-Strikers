import Util from './Util.js'
import PlayerShip from './PlayerShip.js'
import CelestialObject from './CelestialObject.js'

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

    preload() {
        this.load.image('bg', './game/assets/earth1.jpg');
        this.load.image('ship', './game/assets/ship.png');
        this.load.image('blue', './game/assets/blue_particle.png');
        this.load.image('asteroid1', './game/assets/asteroid1.png');
    }

    create() {
        this.add.image(400, 300, 'bg');
        this.ship = new PlayerShip(this);
        //this.shipSpawn(this, 0);
        this.createAsteroids(4 + this.level, 1, this.level, this.ship.getPlayerShip().x, this.ship.getPlayerShip().y, this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    createAsteroids(amount, type, level, ship_x, ship_y, scene) {
        for (let i = 0; i < amount; i++) {
            let asteroid = new CelestialObject(scene, type, level, ship_x, ship_y);
            this.asteroids.push(asteroid);
        }
    }

    update() {
        if (this.alive) {
            if (this.cursors.up.isDown) {
                this.ship.Accelrate();
            }
            else if (this.cursors.down.isDown) {
                this.ship.DeAccelrate();
            }
            else {
                this.ship.NoAcceleration();
            }

            if (this.cursors.left.isDown) {
                this.ship.TurnLeft();

            }
            else if (this.cursors.right.isDown) {
                this.ship.TurnRight();


            }
            else {
                this.ship.Neutral();

            }

            if (this.space.isDown) {
                this.ship.Fire()
            } else {
                this.ship.StopFire();
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


    onShipCollisionEvent() {
        // let respawntimer = this.time.addEvent({
        //     delay: 4000,
        //     callback: this.RespawnEvent,
        //     callbackScope: this,
        //     repeat: 1,
        //     startAt: 2000
        // })
        if (!this.ship.getVulnerablityState()) {
            this.alive = false;
            this.ship.Explode();
            this.lives--;
            this.shipSpawn(this);
        }
    }

    shipSpawn(self){
        if (this.lives > 0) {
            this.time.delayedCall(3000, function () {
                self.ship = new PlayerShip(self);
                self.alive = true;
                //self.invulnerable = true;
                self.ship.setVulnerabilityState(true)
            });

            this.time.delayedCall(5000, function () {
                //self.invulnerable = false;
                self.ship.setVulnerabilityState(false)
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