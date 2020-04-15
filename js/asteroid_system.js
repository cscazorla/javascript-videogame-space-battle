import Asteroid from './asteroid.js'
import Vector2 from './vector2.js'

export default class AsteroidsSystem {
    constructor(ctx, number_of_asteroids, stageProps) {
        this.ctx = ctx
        this.stageProps = stageProps
        this.number_of_asteroids = number_of_asteroids

        this.asteroids = []
        for (var i = 0; i < this.number_of_asteroids; i++) {
            var x = Math.floor(Math.random() * this.stageProps.width)
            var y = Math.floor(Math.random() * this.stageProps.height)
            var scale = Math.floor(Math.random() * 70 + 30)

            var w = Math.random()
            var vx = Math.random() * 100 - 50
            var vy = Math.random() * 100 - 50
            this.generate_asteroid(
                new Vector2(x, y),
                3,
                scale,
                w,
                new Vector2(vx, vy)
            )
        }
    }

    generate_asteroid = function (position, _lifes, _scale, w, velocity) {
        var vertexes = Math.floor(Math.random() * 250 + 50)
        var angle_delta = (2 * Math.PI) / vertexes
        var points = []
        for (var j = 0; j < vertexes; j++) {
            var angle = angle_delta * j
            points.push({
                x: Math.cos(angle) + Math.abs(Math.random() * 0.05),
                y: Math.sin(angle) + Math.abs(Math.random() * 0.1),
            })
        }

        var asteroid = new Asteroid(
            this.ctx,
            this.stageProps,
            position,
            points,
            _scale,
            _lifes,
            w,
            velocity
        )
        this.asteroids.push(asteroid)
    }

    updatePosition = function (dt) {
        for (var asteroid of this.asteroids) {
            asteroid.accelerate(dt, Vector2.createZero(), 0)
        }
    }

    render = function () {
        for (var asteroid of this.asteroids) {
            asteroid.draw('grey', true, 'white')
        }
    }

    hit = function (index) {
        var asteroid = this.asteroids[index]
        asteroid.lifes--

        if (asteroid.lifes > 0) {

            let av = asteroid.velocity
            let avP = asteroid.velocity.getPerpendicular()
            let avPE = avP.getScaled(1.2)

            this.generate_asteroid(
                asteroid.position,
                asteroid.lifes,
                asteroid.scale * 0.6,
                asteroid.w * 1.4,
                asteroid.velocity.getPerpendicular().getScaled(1.2)
            )

            this.generate_asteroid(
                asteroid.position,
                asteroid.lifes,
                asteroid.scale * 0.6,
                asteroid.w * 1.4,
                asteroid.velocity.getPerpendicularR().getScaled(1.2)
            )
        }

        this.asteroids.splice(index, 1)
    }
}
