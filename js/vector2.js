export default class Vector2 {
    constructor(x, y) {
        this.coords = [x, y]
    }

    get x() {
        return this.coords[0]
    }

    set x(x) {
        this.coords[0] = x
    }

    get y() {
        return this.coords[1]
    }

    set y(y) {
        this.coords[1] = y
    }

    get magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    toString() {
        return (
            '(' +
            this.coords[0].toFixed(2) +
            ',' +
            this.coords[1].toFixed(2) +
            ')'
        )
    }

    getNegated() {
        return new Vector2(-this.x, -this.y)
    }

    getPerpendicular() {
        return new Vector2(-this.y, this.x)
    }

    getPerpendicularR() {
        return new Vector2(this.y, -this.x)
    }

    getNormalized() {
        let magnitude = this.magnitude
        let x = this.x / magnitude
        let y = this.y / magnitude
        return new Vector2(x, y)
    }

    getScaled(number) {
        return new Vector2(this.x * number, this.y * number)
    }

    // Returns the vector projection of onto other_vector.
    getProjection(other_vector) {

    }

    // Linearly interpolate between a and b.
    // t goes from 0 to 1
    static lerp(v1, v2, t) {
        t = t < 0 ? 0 : t
        t = t > 1 ? 1 : t
        let out = []
        out[0] = v1.x + (v2.x - v1.x) * t
        out[1] = v1.y + (v2.y - v1.y) * t

        return new Vector2(out[0], out[1])
    }

    static createFromPolarRadians(length, radians) {
        let x = length * Math.cos(radians)
        let y = length * Math.sin(radians)
        return new this(x, y)
    }

    static createFromPolarDegrees(length, degrees) {
        return this.createFromPolarRadians(length, (degrees * Math.PI) / 180)
    }

    static createZero() {
        return new this(0, 0)
    }
}
