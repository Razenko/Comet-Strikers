export default class UIElements extends Phaser.GameObjects.Sprite {
    constructor(scene, startlives, startrockets, livespos, rocketspos, livestexture, rocketstexture, scale) {
        super(scene);
        this._scene = scene;
        this._rockets = [];
        this._lives = [];
        this._spriteConfig = {
            livestexture: livestexture,
            rocketstexture: rocketstexture,
            livespos: livespos,
            rocketspos: rocketspos,
            scale: scale,
        }
    }
    get scene() {
        return this._scene;
    }

    set scene(value) {
        this._scene = value;
    }

    get spriteConfig() {
        return this._spriteConfig;
    }

    set spriteConfig(value) {
        this._spriteConfig = value;
    }

    create(startlives, startrockets){


    }
}


