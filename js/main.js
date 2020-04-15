import Game from './game.js'

var game = null
var canvas = null



document.addEventListener('keydown', (event) => {
    if (event.keyCode == 83) {
        game.start_game = true
    }
})

window.onload = function () {
    canvas = document.getElementById('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.margin = 'auto'

    game = new Game(canvas)
    
}
