import Particle from './particle.js'

export default class ParticleEffect {
    constructor(ctx, _position, _direction, _resolution) {
        this.ctx = ctx
        this.position = _position
        this.direction = _direction
        this.perp_direction = { x: -_direction.y, y: _direction.x }

        this.resolution = _resolution
        this.slope = 0.4
        this.colors = []

        this.particles = []

        this.colors = this.generateColor('#ff0000', '#f2ff00', this.resolution)

        this.start(this.position, this.direction)
    }

    render = function () {
        for (var i = 0; i < this.particles.length; i++) {
            var particle = this.particles[i]
            particle.render()
        }
    }

    octectToHex = function (c) {
        var s = '0123456789abcdef'
        var i = parseInt(c)
        if (i == 0 || isNaN(c)) return '00'
        i = Math.round(Math.min(Math.max(0, i), 255))
        return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16)
    }

    convertRGBToHex = function (rgb) {
        return (
            this.octectToHex(rgb[0]) +
            this.octectToHex(rgb[1]) +
            this.octectToHex(rgb[2])
        )
    }

    /* Remove '#' in color hex string */
    trimSharpFromString = function (s) {
        return s.charAt(0) == '#' ? s.substring(1, 7) : s
    }

    convertHexToRGB = function (hex) {
        var color = []
        color[0] = parseInt(this.trimSharpFromString(hex).substring(0, 2), 16)
        color[1] = parseInt(this.trimSharpFromString(hex).substring(2, 4), 16)
        color[2] = parseInt(this.trimSharpFromString(hex).substring(4, 6), 16)
        return color
    }

    generateColor = function (colorStart, colorEnd, colorCount) {
        // The beginning of your gradient
        var start = this.convertHexToRGB(colorEnd)

        // The end of your gradient
        var end = this.convertHexToRGB(colorStart)

        // The number of colors to compute
        var len = colorCount

        // Alpha blending amount
        var alpha = 0.0

        var colors = []

        for (var i = 0; i < len; i++) {
            var c = []
            alpha += 1.0 / len

            c[0] = start[0] * alpha + (1 - alpha) * end[0]
            c[1] = start[1] * alpha + (1 - alpha) * end[1]
            c[2] = start[2] * alpha + (1 - alpha) * end[2]

            colors.push('#' + this.convertRGBToHex(c))
        }

        return colors
    }

    start = function (position, direction) {
        this.removeParticles()
        this.x = position.x
        this.y = position.y
        this.direction = direction

        var noise_threshold = 5
        for (var i = 0; i < this.resolution; i++) {
            var horizontal_x = this.x + i * this.direction.x
            var horizontal_y = this.y + i * this.direction.y

            for (var j = -this.slope * i; j < this.slope * i; j++) {
                var x = horizontal_x + j * this.perp_direction.x
                var y = horizontal_y + j * this.perp_direction.y

                // Adding some noise
                var noise = Math.abs(i * j)

                if (noise >= noise_threshold) noise = noise_threshold
                x += Math.random() * noise
                y += Math.random() * noise

                this.particles.push(new Particle(this.ctx, x, y, this.colors[i]))
            }
        }
    }

    removeParticles = function () {
        this.particles = []
    }
}
