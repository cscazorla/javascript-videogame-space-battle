import Polygon from './polygon.js'
import Vector2 from './vector2.js'

export default class Bullet extends Polygon {
    constructor(_ctx, stageProps, position, _direction, _color) {
        super(
            _ctx,
            stageProps,
            position,
            [
                { x: 1, y: 1 },
                { x: 1, y: -1 },
                { x: -1, y: -1 },
                { x: -1, y: 1 },
            ],
            2
        )

        this.velocity = _direction.getScaled(900)
        this.rellocate_when_out_of_boundaries = false

        this.color = _color
    }

    updatePosition = function (dt) {
        this.accelerate(dt, Vector2.createZero(), 0)
    }
}
