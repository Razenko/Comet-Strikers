/**
 * Utility class. Provides commonly used functions in various elements of the game.
 */
export default class Util {

    /**
     * Get coordinates based on the angle and position of another object.
     * @param distance - The distance between the original point of origin and the desired position
     * @param angle - The angle of the original object
     * @param x - The x-axis of the original object
     * @param y - The y-axis of the original object
     * @returns {{x: *, y: *}}
     */
    static getAnglePos(distance, angle, x, y) {
        let radians = (angle + 180) * Math.PI / 180;
        let position = {
            x: x + Math.cos(radians) * distance,
            y: y + Math.sin(radians) * distance
        };

        return position;
    }

    /**
     * Generate a random integer based on a minimum and maximum value.
     * @param min - Minimum value
     * @param max - Maximum value
     * @returns {number}
     */
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * Math.floor((max + 1) - min) + min);
    }
}