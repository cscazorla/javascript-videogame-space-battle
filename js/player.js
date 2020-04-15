import Bullet from './bullet.js'
import Polygon from './polygon.js'
import ParticleEffect from './particle_effect.js'
import Vector2 from './vector2.js'

export default class Player extends Polygon {
    constructor(_ctx, stageProps, position, _points, _color) {
        super(_ctx, stageProps, position, _points, 6)

        this.color = _color
        this.health = 5
        this.dead = false

        this.aiming = Vector2.createZero()
        this.unit_aiming = Vector2.createZero()
        this.aiming_magnitude = 0
        this.thruster = Vector2.createZero()
        this.unit_thruster = Vector2.createZero()

        this.shoot_cadency = 5
        this.shoot_cadency_counter = 0
        this.gamepad_axes_threshold = 0.1
        this.bullets_shot = []

        this.particle_effect = new ParticleEffect(
            this.ctx,
            this.position,
            this.unit_aiming,
            15
        )
    }

    render = function () {
        // Particle effect
        this.particle_effect.render()

        // Draw Polygon
        this.draw(!this.dead ? this.color : 'grey', true, 'white')

        // Aim
        if (!this.dead) {
            this.ctx.beginPath()
            this.ctx.fillStyle = 'red'
            this.ctx.arc(
                this.position.x + this.unit_aiming.x * this.scale * 2.1,
                this.position.y + this.unit_aiming.y * this.scale * 2.1,
                2,
                0,
                2 * Math.PI
            )
            this.ctx.fill()
        }

        // Bullets_shot
        for (var i = 0; i < this.bullets_shot.length; i++) {
            let bullet = this.bullets_shot[i]
            bullet.draw(bullet.color)
        }
    }

    updatePosition = function (dt, _acceleration, _aiming) {
        // Acceleration due to the left stick
        var checkedValues = this.checkGamepadDeadZone(
            _acceleration.x,
            _acceleration.y
        )

        let acceleration = new Vector2(checkedValues.x, checkedValues.y)

        this.thruster = acceleration.getNegated()

        this.accelerate(dt, acceleration, 0)

        var acceleration_magnitude = acceleration.magnitude

        this.unit_thruster = new Vector2(
            this.thruster.x / acceleration_magnitude,
            this.thruster.y / acceleration_magnitude
        )

        // Update position and direction of the Particle Effect
        if (acceleration_magnitude > 0) {
            this.particle_effect.start(
                {
                    x: this.position.x + this.unit_thruster.x * this.scale * 0.5,
                    y: this.position.y + this.unit_thruster.y * this.scale * 0.5,
                },
                { x: this.thruster.x, y: this.thruster.y }
            )
        } else {
            this.particle_effect.removeParticles()
        }

        // Aiming due to the right stick
        var checkedValues = this.checkGamepadDeadZone(_aiming.x, _aiming.y)

        this.aiming = new Vector2(checkedValues.x, checkedValues.y)

        this.aiming_magnitude = this.aiming.magnitude

        this.unit_aiming = this.aiming.getNormalized()
    }

    checkGamepadDeadZone = function (_x, _y) {
        var percentage_x =
            (Math.abs(_x) - this.gamepad_axes_threshold) /
            (1 - this.gamepad_axes_threshold)
        var percentage_y =
            (Math.abs(_y) - this.gamepad_axes_threshold) /
            (1 - this.gamepad_axes_threshold)

        if (percentage_x < 0) percentage_x = 0
        if (percentage_y < 0) percentage_y = 0

        var x = percentage_x * (_x > 0 ? 1 : -1)
        var y = percentage_y * (_y > 0 ? 1 : -1)

        return { x: x, y: y }
    }

    shoot = function () {
        // We only shoot if we are aiming at something
        if (this.aiming_magnitude > 0) {
            if (this.shoot_cadency_counter < this.shoot_cadency) {
                this.shoot_cadency_counter++
            } else {
                this.shoot_cadency_counter = 0
                var x = this.position.x + this.unit_aiming.x * 10
                var y = this.position.y + this.unit_aiming.y * 10
                var a = new Bullet(
                    this.ctx,
                    this.stageProps,
                    new Vector2(x,y),
                    this.unit_aiming,
                    this.color
                )
                this.bullets_shot.push(a)
            }
        }
    }

    shot = function () {
        this.health--

        if (this.health <= 0) this.gameOver()
    }

    gameOver = function () {
        this.dead = true
        // Game.players.splice(this.number - 1, 1)
    }
}
