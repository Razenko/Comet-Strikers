import Util from './util.js'

/**
 * Musicplayer class to play Commodore 64 SID tunes.
 * @classdesc
 * Uses the SID player plugin to play C64 based SID tunes.
 * Is used in-game to play random background songs.
 * @constructor scene - The current level scene.
 */
export default class MusicPlayer {
    constructor(scene) {
        this._scene = scene;
        this._plugin = null;
        this._songlist = null;
        this.create();
    }

    /**
     * Getters and setters.
     */

    //Scene
    get scene() {
        return this._scene;
    }

    set scene(value) {
        this._scene = value;
    }

    //Songlist
    get songlist() {
        return this._songlist;
    }

    set songlist(value) {
        this._songlist = value;
    }

    //Plugin
    get plugin() {
        return this._plugin
    }

    set plugin(value) {
        this._plugin = value;
    }


    /**
     * Create a songlist, enable the SID player plugin and set default volume.
     */
    create() {
        this.songlist = ['tune1', 'tune2', 'tune3', 'tune4'];
        this.plugin = this.scene.plugins.get('SIDPlayerPlugin');
        this.plugin.setvolume(1);
    }

    /**
     * Play a song.
     * @param song - Song to be played
     */
    play(song) {
        this.plugin.loadLocal(this.scene.cache.binary.get(song));
    }

    /**
     * Play a random song from the songlist array.
     */
    playRandom() {
        this.play(this.songlist[Util.getRandomInt(0, this.songlist.length - 1)]);
    }
}