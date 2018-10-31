/**
 * Display a static image when the player has won the game.
 */
export default class WinLevel extends Phaser.Scene {
    constructor(level) {
        super({
            key: 'level' + level
        });
    }

    preload() {
        this.load.image('win', './game/assets/win.jpg');
    }

    create() {
        this.add.image(400, 300, 'win');
    }
}