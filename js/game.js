import Starfield from './starfield.js'
import AsteroidsSystem from './asteroid_system.js'
import Player from './player.js'
import Vector2 from './vector2.js'

export default class Game {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.stageProps = {
            width: canvas.width,
            height: canvas.height,
        }

        this.t = new Date().getTime()
        this.dt = 0.02
        this.number_of_players = 0
        this.players = []
        this.players_colors = ['blue', 'green', 'yellow']
        this.start_game = false

        this.starfield = new Starfield(
            this.ctx,
            80,
            this.canvas.width,
            this.canvas.height
        )

        this.asteroids_system = new AsteroidsSystem(
            this.ctx,
            4,
            this.stageProps
        )

        window.addEventListener('gamepadconnected', this.addPlayer.bind(this))
        window.addEventListener(
            'gamepaddisconnected',
            this.removePlayer.bind(this)
        )

        this.choosePlayers()
    }

    addPlayer = function (event) {
        console.log(
            'Gamepad connected at index %d: %s. %d buttons, %d axes.',
            event.gamepad.index,
            event.gamepad.id,
            event.gamepad.buttons.length,
            event.gamepad.axes.length
        )

        this.number_of_players++
    }

    removePlayer = function (event) {
        console.log(
            'Gamepad disconnected from index %d: %s',
            event.gamepad.index,
            event.gamepad.id
        )
        this.number_of_players--
    }

    choosePlayers = function () {
        if (this.start_game) {
            this.start()
        } else {
            window.requestAnimationFrame(this.choosePlayers.bind(this))

            // Time elapsed in seconds since last call
            this.dt = (new Date().getTime() - this.t) / 1000
            this.t = new Date().getTime()
        }

        // Clean up
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Starfield
        this.starfield.move()
        this.starfield.render()
        this.asteroids_system.updatePosition(this.dt)
        this.asteroids_system.render()

        this.ctx.fillStyle = 'white'
        this.ctx.font = '20px serif'
        this.ctx.textAlign = 'center'

        this.ctx.fillText(
            'Press a button in the Gamepad and then press "S"',
            this.canvas.width / 2,
            this.canvas.height / 2 - 100
        )

        for (var i = 0; i < this.number_of_players; i++) {
            var msg = 'Player ' + (i + 1)
            this.ctx.fillText(
                msg,
                this.canvas.width / 2,
                this.canvas.height / 2 + i * 50
            )
        }
    }

    start = function () {
        var angle_separation = (2 * Math.PI) / this.number_of_players
        var radius = this.canvas.height * 0.4

        for (var i = 0; i < this.number_of_players; i++) {
            var points = [
                { x: 1, y: 2 },
                { x: 2, y: 1 },
                { x: 2, y: -1 },
                { x: 1, y: -2 },
                { x: -1, y: -2 },
                { x: -2, y: -1 },
                { x: -2, y: 1 },
                { x: -1, y: 2 },
            ]
            var _x =
                radius * Math.cos(angle_separation * i) + this.canvas.width / 2
            var _y =
                radius * Math.sin(angle_separation * i) + this.canvas.height / 2

            var player = new Player(
                this.ctx,
                this.stageProps,
                new Vector2(_x, _y),
                points,
                this.players_colors[i]
            )
            player.max_speed = 200
            this.players.push(player)
        }

        this.update()
    }

    update = function () {
        window.requestAnimationFrame(this.update.bind(this))

        // Time elapsed in seconds since last call
        this.dt = (new Date().getTime() - this.t) / 1000
        this.t = new Date().getTime()

        // Starfield
        this.starfield.move()
        this.asteroids_system.updatePosition(this.dt)

        // Players
        var gamepads = navigator.getGamepads()
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i]
            if (!player.dead) {
                // Movement
                let acceleration = new Vector2(
                    gamepads[i].axes[0],
                    gamepads[i].axes[1]
                )
                let aiming = new Vector2(
                    gamepads[i].axes[2],
                    gamepads[i].axes[3]
                )
                this.players[i].updatePosition(this.dt, acceleration, aiming)

                // Has touch any Asteroid?
                for (asteroid of this.asteroids_system.asteroids) {
                    var asteroid_geometric_center = asteroid.getPointsInWorldCoordinates(
                        [asteroid.collider_center]
                    )[0]
                    if (
                        player.x <=
                            asteroid_geometric_center.x + asteroid.scale &&
                        player.x >=
                            asteroid_geometric_center.x - asteroid.scale &&
                        player.y >=
                            asteroid_geometric_center.y - asteroid.scale &&
                        player.y <= asteroid_geometric_center.y + asteroid.scale
                    ) {
                        player.gameOver()
                    }
                }

                // Shoot
                if (gamepads[i].buttons[7].pressed) this.players[i].shoot()
            }

            // Bullets
            for (var j = 0; j < player.bullets_shot.length; j++) {
                var my_bullet = player.bullets_shot[j]

                my_bullet.updatePosition(this.dt)

                // Has hit any other player?
                for (var k = 0; k < this.players.length; k++) {
                    if (k != i) {
                        if (
                            my_bullet.position.x <
                                this.players[k].x + this.players[k].width / 2 &&
                            my_bullet.position.x >
                                this.players[k].x - this.players[k].width / 2 &&
                            my_bullet.position.y >
                                this.players[k].y - this.players[k].width / 2 &&
                            my_bullet.position.y <
                                this.players[k].y + this.players[k].width / 2
                        ) {
                            this.players[k].shot()
                            player.bullets_shot.splice(j, 1)
                        }
                    }
                }

                // Has hit any asteroid?
                for (
                    var k = 0;
                    k < this.asteroids_system.asteroids.length;
                    k++
                ) {
                    var asteroid = this.asteroids_system.asteroids[k]
                    var asteroid_geometric_center = asteroid.getPointsInWorldCoordinates(
                        [asteroid.collider_center]
                    )[0]

                    if (
                        my_bullet.position.x <
                            asteroid_geometric_center.x + asteroid.scale &&
                        my_bullet.position.x >
                            asteroid_geometric_center.x - asteroid.scale &&
                        my_bullet.position.y >
                            asteroid_geometric_center.y - asteroid.scale &&
                        my_bullet.position.y <
                            asteroid_geometric_center.y + asteroid.scale
                    ) {
                        player.bullets_shot.splice(j, 1)
                        this.asteroids_system.hit(k)
                    }
                }

                // Deleting bullets outside the world
                if (
                    my_bullet.position.x > this.canvas.width ||
                    my_bullet.position.x < 0 ||
                    my_bullet.position.y > this.canvas.height ||
                    my_bullet.position.y < 0
                ) {
                    player.bullets_shot.splice(j, 1)
                }
            }
        }

        // Rendering
        this.render()
    }

    render = function () {
        // Clean up
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Background
        this.starfield.render()

        // Asteroids
        this.asteroids_system.render()

        // Players
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].render()

            this.ctx.fillStyle = this.players[i].color
            this.ctx.textAlign = 'left'
            this.ctx.font = '40px serif'
            this.ctx.fillText(
                'Player ' +
                    this.players[i].number +
                    ': ' +
                    this.players[i].health,
                (this.canvas.width / this.players.length) * i,
                40
            )
        }
    }
}
