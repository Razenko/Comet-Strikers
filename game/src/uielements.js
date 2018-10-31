/**
 * Display UI elements such as ships left, rockets left and various other messages.
 */
export default class UIElements extends Phaser.GameObjects.Sprite {
    constructor(scene, startlives, startrockets, livespos, rocketspos, livestexture, rocketstexture, scale, distance) {
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
            distance: distance
        };

        this.create(startlives, startrockets, this.spriteConfig);
    }

    /**
     * Getters and setters
     */

    //Scene
    get scene() {
        return this._scene;
    }

    set scene(value) {
        this._scene = value;
    }

    //Spriteconfig
    get spriteConfig() {
        return this._spriteConfig;
    }

    set spriteConfig(value) {
        this._spriteConfig = value;
    }

    //Rockets
    get rockets() {
        return this._rockets;
    }

    set rockets(value) {
        this._rockets = value;
    }

    //Lives
    get lives() {
        return this._lives;
    }

    set lives(value) {
        this._lives = value;
    }

    /**
     * Create the initial UI overlay
     * @param startlives - The number of available ships the player is starting with
     * @param startrockets - The number of available rockets the player is starting with
     * @param spriteconfig - Sprite properties
     */
    create(startlives, startrockets, spriteconfig) {
        this.lives = this.createIcons(startlives, spriteconfig.livespos, spriteconfig.livestexture, spriteconfig.scale, spriteconfig.distance);
        this.rockets = this.createIcons(startrockets, spriteconfig.rocketspos, spriteconfig.rocketstexture, spriteconfig.scale, spriteconfig.distance)

    }

    /**
     * Create a number of icons such as ships or rockets
     * @param amount - Amount
     * @param position - Position
     * @param texture - Icon texture (bitmap)
     * @param scale - Scale
     * @param spacing - Space between each icon
     * @returns {Array} - Return the array of icons
     */
    createIcons(amount, position, texture, scale, spacing) {
        let distance = 0;
        let temparray = [];
        for (let i = 0; i < amount; i++) {
            let icon = this.sprite = this.scene.physics.add.image(position.x + distance, position.y, texture);
            icon.setScale(scale);
            icon.setDepth(1);
            distance += (spacing + icon.width);
            temparray.push(icon);
        }
        return temparray;
    }

    /**
     * Decrease the number of ships (lives) a player has left (as icons)
     * @param amount - Amount to delete
     */
    decreaseLives(amount) {
        for (let i = 0; i < amount; i++) {
            this.lives[this.lives.length - 1].destroy();
            this.lives.pop();
        }
    }

    /**
     * Decrease the number of rockets a player has left (as icons)
     * @param amount - Amount to delete
     */
    decreaseRockets(amount) {
        for (let i = 0; i < amount; i++) {
            this.rockets[this.rockets.length - 1].destroy();
            this.rockets.pop();
        }
    }

    /**
     * Display the game over message
     * @param message - Custom message underneath main gameover bitmap
     */
    gameoverMessage(message) {
        let image = this.scene.physics.add.image(400, 270, 'gameover');
        image.setDepth(1);
        if (message != null) {
            let text = this.scene.add.text(350 - (message.length * 4), 320, message, {
                fontFamily: 'Arial',
                fontSize: 24,
                color: '#ffea00'
            });
            text.setDepth(1);
        }
    }

    /**
     * Display the current level
     * @param message - Current level
     */
    displayLevel(message) {
        if (message != null) {
            let text = this.scene.add.text(370, 10, message, {fontFamily: 'Arial', fontSize: 24, color: '#ffea00'});
            text.setDepth(1);
        }
    }
}


