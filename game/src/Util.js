export default class Util {

    getAnglePos(distance, angle, x, y) {
        let radians = (angle + 180) * Math.PI / 180;
        let position = {
            x: x + Math.cos(radians) * distance,
            y: y + Math.sin(radians) * distance
        };

        return position;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * Math.floor((max + 1) - min) + min);
    }
}