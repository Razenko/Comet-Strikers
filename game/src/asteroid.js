import CelestialObject from './celestialobject.js'

export default class Asteroid extends CelestialObject {
    constructor(scene, object_type, level, spawnpoint, scale, rotation, ship_x, ship_y) {
        super(scene, object_type, level, spawnpoint, scale, rotation, ship_x, ship_y);
        // this._scene = scene;
        // this._level = level;
        // this._object_type = object_type;
        // this._ship_x = ship_x;
        // this._ship_y = ship_y;
        // this._sprite = null;
        this.create();
    }
}