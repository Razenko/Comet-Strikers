import Util from './Util.js'
import Laser from './Laser.js'

export default class PlayerShip extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene)
        this.scene = scene;
        this.ship = null;
        this.active = true;
        this.shipEmitter = null;
        this.emitterDeathZone = null;
        this.util = new Util();
        this.laser = new Laser(scene, 58);
        this.create();
    }

    create() {
        let particles = this.scene.add.particles('blue');
        this.shipEmitter = particles.createEmitter({
            speed: 1,
            scale: {start: 1, end: 0},
            alpha: 0.5,
            blendMode: 'ADD',
            //angle: { min: 60, max: 120, steps: 32 },
            lifespan: 1000,
            quantity: 1,
            //radial: true
            on: false
        });

        this.ship = this.scene.physics.add.image(400, 400, 'ship');
        this.ship.setDamping(true);
        this.ship.setDrag(0.99);
        this.ship.setMaxVelocity(200);
        this.ship.setVelocity(0, 0);
        this.ship.setBounce(1, 1);
        this.ship.angle = -90;
        this.ship.setCollideWorldBounds(false);
        this.emitterDeathZone = new Phaser.Geom.Circle(this.ship.x, this.ship.y, 50);
    }


    update() {
        this.scene.physics.world.wrap(this.ship, 32);
        let emitterPosition = this.util.getAnglePos(30, this.ship.angle, this.ship.x, this.ship.y);
        this.shipEmitter.setPosition(emitterPosition.x, emitterPosition.y);
        //this.shipEmitter.setAngle({min: this.ship.angle + 180, max: this.ship.angle + 180, steps: 32});
        this.shipEmitter.setAngle(this.ship.angle + 180);
        let deathzonePosition = this.util.getAnglePos(-20, this.ship.angle, this.ship.x, this.ship.y);
        this.emitterDeathZone.setPosition(deathzonePosition.x, deathzonePosition.y);
        this.shipEmitter.setDeathZone(new Phaser.GameObjects.Particles.Zones.DeathZone(this.emitterDeathZone, true));
        this.laser.update(this.ship.x, this.ship.y, this.ship.angle)
    }

    getPlayerShip() {
        return this.ship;
    }

    Accelrate() {
        if (this.active) {
            this.scene.physics.velocityFromRotation(this.ship.rotation, 200, this.ship.body.acceleration);
            this.shipEmitter.on = true;
        }

    }

    DeAccelrate() {
        if (this.active) {
            this.scene.physics.velocityFromRotation(this.ship.rotation, -50, this.ship.body.acceleration);
            this.shipEmitter.on = false;
        }
    }

    NoAcceleration() {
        this.ship.setAcceleration(0);
        this.shipEmitter.on = false;
    }

    TurnLeft() {
        if (this.active) {
            this.ship.setAngularVelocity(-300);
        }
    }

    TurnRight() {
        if (this.active) {
            this.ship.setAngularVelocity(300);
        }
    }

    Neutral() {
        this.ship.setAngularVelocity(0);
    }

    Fire(){
        this.laser.Fire();
    }

    StopFire(){
        this.laser.StopFire();
    }

    Explode() {
        let explosion_x = this.ship.x;
        let explosion_y = this.ship.y;

        this.ship.destroy();
        this.shipEmitter.on = false;



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
        })
        this.scene.time.delayedCall(2000, function() {
            explosion.on = false;
        });
    }
}