import MusicPlayer from "./musicplayer.js";

/**
 * Display a static image when the player has won the game.
 */
export default class WinLevel extends Phaser.Scene {
    constructor(level) {
        super({
            key: 'level' + level
        });
    }

    /**
     * Preload assets.
     */
    preload() {
        this.load.image('win', './game/assets/textures/win.jpg');
        this.load.image('btn_restart', './game/assets/textures/btn_restart.png');
        this.load.binary('win', './game/assets/music/win.sid');
        this.load.plugin('SIDPlayerPlugin', './lib/js/plugins/sidplayer.min.js', true);
    }

    /**
     * Create the screen, together with a restart button and a background song.
     */
    create() {
        this.add.image(400, 300, 'win');
        let button = this.add.sprite(400, 480, 'btn_restart').setInteractive();
        button.on('pointerdown', function (pointer) {
            window.location.reload(false);
        });
        let musicplayer = new MusicPlayer(this);
        musicplayer.play('win');
    }
}