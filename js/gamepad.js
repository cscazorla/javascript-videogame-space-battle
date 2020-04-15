var gamepadAPI = {
    controller: {},
    turbo: false,
    connect: function (evt) {
        gamepadAPI.controller = evt.gamepad
        gamepadAPI.turbo = true
        console.log('Gamepad connected.')
    },
    disconnect: function (evt) {
        gamepadAPI.turbo = false
        delete gamepadAPI.controller
        console.log('Gamepad disconnected.')
    },
    update: function () {},
    buttonPressed: function () {},
    buttons: [],
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: [],
}

window.addEventListener('gamepadconnected', gamepadAPI.connect)
window.addEventListener('gamepaddisconnected', gamepadAPI.disconnect)

document.addEventListener('keydown', (event) => {
    if (event.keyCode == 83) {
        Game.start_game = true
    }
})
