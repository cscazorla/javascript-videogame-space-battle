export default class Particle {
    constructor(ctx, _x, _y, _color) {
        this.ctx = ctx
        this.x = _x
        this.y = _y
        this.color = _color
    }

    render = function () {
        this.ctx.beginPath()
        this.ctx.fillStyle = this.color
        this.ctx.arc(this.x, this.y, 1, 0, Math.PI * 2, true)
        this.ctx.fill()
    }
}
