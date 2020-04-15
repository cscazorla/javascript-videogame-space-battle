import Vector2 from './vector2.js'

export default class Polygon {
    constructor(
        ctx,
        stageProps,
        position,
        points,
        scale,
        max_acceleration = 300,
        max_speed = 1000,
        max_alpha = 10,
        max_omega = 10
    ) {
        this.ctx = ctx
        this.stageProps = stageProps
        this.points = points
        this.scale = scale

        this.debug = false
        this.rellocate_when_out_of_boundaries = true

        // Linear
        this.position = position
        this.velocity = Vector2.createZero()
        this.max_acceleration = max_acceleration
        this.max_speed = max_speed

        // Angular
        this.theta = 0
        this.max_alpha = max_alpha
        this.max_omega = max_omega
        this.w = 0 // Omega

        this.collider_center = { x: 0, y: 0 }
        this.collider_radius = 0

        this.calculateCollider()
    }

    getPointsInWorldCoordinates(original_points) {
        var points = []
        for (var i = 0; i < original_points.length; i++) {
            var local_points = original_points[i]

            points.push({
                x: this.position.x + local_points.x * this.scale,
                y: this.position.y + local_points.y * this.scale,
            })
        }
        return points
    }

    calculateCollider() {
        var center_x = 0,
            center_y = 0,
            total_points = this.points.length

        var point = []

        for (point of this.points) {
            center_x += point.x
            center_y += point.y
        }

        this.collider_center = {
            x: Math.floor(center_x / total_points),
            y: Math.floor(center_y / total_points),
        }

        // Distance from the geometric center to each vertex
        var magnitude = 0,
            x = 0,
            y = 0
        for (var points of this.points) {
            x = points.x - this.collider_center.x
            y = points.y - this.collider_center.y
            magnitude += Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        }
        this.collider_radius = magnitude / total_points
    }

    accelerate(dt, acceleration, alpha) {
        // Linear
        this.velocity.x += acceleration.x * dt * this.max_acceleration
        this.velocity.y += acceleration.y * dt * this.max_acceleration

        if (this.velocity.x > this.max_speed) this.velocity.x = this.max_speed
        if (this.velocity.x < -this.max_speed) this.velocity.x = -this.max_speed
        if (this.velocity.y > this.max_speed) this.velocity.y = this.max_speed
        if (this.velocity.y < -this.max_speed) this.velocity.y = -this.max_speed

        var delta_x = this.velocity.x * dt
        var delta_y = this.velocity.y * dt
        this.move(delta_x, delta_y)

        // Angular
        this.w += alpha * dt * this.max_alpha
        if (this.w > this.max_omega) this.w = this.max_omega

        var delta_theta = this.w * dt
        this.rotate(delta_theta)

        this.checkSpaceBoundaries()
    }

    move(delta_x, delta_y) {
        this.position.x += delta_x
        this.position.y += delta_y
    }

    rotate(theta) {
        this.theta += theta

        var temp = 0
        // If I don't use the temp value x is being updated too early,
        // such that y is calculated based on the new value of x instead of the old value.
        for (var point of this.points) {
            temp = Math.cos(theta) * point.y + Math.sin(theta) * point.x
            point.x = Math.cos(theta) * point.x - Math.sin(theta) * point.y
            point.y = temp
        }
    }

    draw(color = 'red', border = false, border_color = 'white') {
        this.ctx.beginPath()
        this.ctx.fillStyle = color
        this.ctx.lineWidth = 1

        var points = this.getPointsInWorldCoordinates(this.points)
        var initial_point = points[0]
        this.ctx.moveTo(initial_point.x, initial_point.y)
        for (var i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y)
        }
        this.ctx.lineTo(initial_point.x, initial_point.y)
        this.ctx.fill()

        if (border) {
            this.ctx.beginPath()
            this.ctx.strokeStyle = border_color
            this.ctx.lineWidth = 2

            var points = this.getPointsInWorldCoordinates(this.points)
            var initial_point = points[0]
            this.ctx.moveTo(initial_point.x, initial_point.y)
            for (var i = 1; i < points.length; i++) {
                this.ctx.lineTo(points[i].x, points[i].y)
            }
            this.ctx.lineTo(initial_point.x, initial_point.y)
            this.ctx.stroke()
        }

        // Collider
        if (this.debug) {
            var collider_center_wc = this.getPointsInWorldCoordinates([
                this.collider_center,
            ])[0]
            this.ctx.beginPath()
            this.ctx.fillStyle = 'red'
            this.ctx.arc(
                collider_center_wc.x,
                collider_center_wc.y,
                2,
                0,
                2 * Math.PI
            )
            this.ctx.fill()

            this.ctx.beginPath()
            this.ctx.strokeStyle = 'red'
            collider_center_wc = this.getPointsInWorldCoordinates([
                this.collider_center,
            ])[0]
            this.ctx.arc(
                collider_center_wc.x,
                collider_center_wc.y,
                this.collider_radius * this.scale,
                0,
                2 * Math.PI
            )
            this.ctx.stroke()
        }
    }

    checkSpaceBoundaries = function () {
        if (this.rellocate_when_out_of_boundaries) {
            // Right wall
            if (this.position.x > this.stageProps.width) {
                this.position.x = 0
            }

            // Left wall
            if (this.position.x < 0) {
                this.position.x = this.stageProps.width
            }

            // Top wall
            if (this.position.y < 0) {
                this.position.y = this.stageProps.height
            }

            // Bottom wall
            if (this.position.y > this.stageProps.height) {
                this.position.y = 0
            }
        }
    }

    /**
     * TO DO
     * ¿Meter temas de vectores y coordenadas para calcular distancias, etc?
     */
    collidesWithAnotherPolygon = function (other) {
        var me_collider_center = this.getPointsInWorldCoordinates([
            this.collider_center,
        ])[0]
        var other_collider_center = other.getPointsInWorldCoordinates([
            other.collider_center,
        ])[0]
        // if (Math.abs())
    }
}
