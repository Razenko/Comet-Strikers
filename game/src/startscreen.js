import MusicPlayer from './musicplayer.js'

/**
 * @classdesc
 * Display game instructions and a start button.
 */
export default class StartScreen extends Phaser.Scene {
    constructor(startlevel) {
        super({
            key: 'startscreen'
        });
        this._startlevel = startlevel;
    }

    //Startlevel
    get startlevel() {
        return this._startlevel;
    }

    /**
     * Preload assets.
     */
    preload() {
        this.load.image('bg_start', './game/assets/textures/bg_start.jpg');
        this.load.image('btn_start', './game/assets/textures/btn_start.png');
        this.load.binary('theme', './game/assets/music/theme.sid');
        this.load.plugin('SIDPlayerPlugin', './lib/js/plugins/sidplayer.min.js', true);
    }


    /**
     * Display screen and start button, with a song playing in the background.
     */
    create() {
        let self = this;
        this.add.image(400, 300, 'bg_start');
        let button = this.add.sprite(400, 520, 'btn_start').setInteractive();
        button.on('pointerdown', function (pointer) {
            self.scene.start('level' + self.startlevel);
        });
        let musicplayer = new MusicPlayer(this);
        musicplayer.play('theme');
    }
}