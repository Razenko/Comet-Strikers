export default class LevelScene extends Phaser.Scene {
    constructor(level) {
        super({
            key: 'LevelScene'
        });
        this.ship = null;
        this.shipEmitter = null;
        this.emitterDeathZone = null;
        this.velocityX = null;
        this.velocityY = null;
        //this.invertX = null;
        //this.invertY = null;
        this.cursors = null;
        this.space = null;

    }

    preload() {
        //this.load.setBaseURL('http://labs.phaser.io');

        //  this.load.image('sky', '../assets/skies/space3.png');
        this.load.image('logo', './game/assets/ship.png');
        this.load.image('blue', './game/assets/blue_particle.png');
    }

    create() {
        //this.add.image(400, 300, 'sky');

        let particles = this.add.particles('blue');

        this.shipEmitter = particles.createEmitter({
            speed: 300,
            scale: {start: 1, end: 0},
            alpha: 0.5,
            blendMode: 'ADD',
            //angle: { min: 60, max: 120, steps: 32 },
            lifespan: 3000,
            quantity: 200
        });
        this.velocityX = 1;
        this.velocityY = 2;


        this.ship = this.physics.add.image(400, 100, 'logo');
        this.ship.setDamping(true);
        this.ship.setDrag(0.99);
        this.ship.setMaxVelocity(200);
        this.ship.setVelocity(this.velocityX, this.velocityY);
        this.ship.setBounce(1, 1);
        this.ship.angle = -90;
        this.ship.setCollideWorldBounds(false);
        this.emitterDeathZone = new Phaser.Geom.Circle(this.ship.x, this.ship.y, 40);
        // this.invertX = false;
        // this.invertY = false;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        //this.shipEmitter.startFollow(this.ship, 0,0, true);


    }

    update() {

        if (this.cursors.up.isDown) {
            this.physics.velocityFromRotation(this.ship.rotation, 200, this.ship.body.acceleration);
            this.shipEmitter.on = true;
        }
        else if (this.cursors.down.isDown) {
            this.physics.velocityFromRotation(this.ship.rotation, -50, this.ship.body.acceleration);
            this.shipEmitter.on = false;
        }
        else {
            this.ship.setAcceleration(0);
            this.shipEmitter.on = false;
        }

        if (this.cursors.left.isDown) {
            this.ship.setAngularVelocity(-300);

        }
        else if (this.cursors.right.isDown) {
            this.ship.setAngularVelocity(300);

        }
        else {
            this.ship.setAngularVelocity(0);

        }
        this.physics.world.wrap(this.ship, 32);
        //this.shipEmitter.setBounds(this.ship);
        // var emitX = (Math.cos(this.ship.angle)* 50) - (Math.sin(this.ship.angle) * 50) + this.ship.x;
        // var emitY = (Math.cos(this.ship.angle)* 50) - (Math.sin(this.ship.angle) * 50) + this.ship.y;
        // var length = 20;
        // var realAngle = this.ship.angle + 180;
        //
        // var radians = realAngle * Math.PI / 180;
        //
        // var emitX = this.ship.x + Math.cos(radians) * length;
        // var emitY =

        let emitterPosition = this.getAnglePos(20, this.ship.angle, this.ship.x, this.ship.y);
        this.shipEmitter.setPosition(emitterPosition.x, emitterPosition.y);
        this.shipEmitter.setAngle({min: this.ship.angle + 180, max: this.ship.angle - 180, steps: 128});
        let deathzonePosition = this.getAnglePos(-20, this.ship.angle, this.ship.x, this.ship.y);
        this.emitterDeathZone.setPosition(deathzonePosition.x, deathzonePosition.y)

        this.shipEmitter.setDeathZone(new Phaser.GameObjects.Particles.Zones.DeathZone(this.emitterDeathZone, true));

        if (this.space.isDown) {
            console.log("Fire!");
        }
    }

    getAnglePos(distance, angle, x, y) {

        let realAngle = angle + 180;

        let radians = realAngle * Math.PI / 180;

        //var emitX = this.ship.x + Math.cos(radians) * distance;
        //var emitY = this.ship.y + Math.sin(radians) * distance;

        let position = {
            x: x + Math.cos(radians) * distance,
            y: y + Math.sin(radians) * distance
        };

        return position;
    }
}