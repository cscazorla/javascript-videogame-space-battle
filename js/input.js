const Input = {
    KEYCODE_MAP: {
        P1_LEFT: 37,
        P1_UP: 38,
        P1_RIGHT: 39,
        P1_DOWN: 40,
        P1_FIRE: 32,
        P2_LEFT: 65,
        P2_UP: 87,
        P2_RIGHT: 68,
        P2_DOWN: 83,
        P2_FIRE: 81,
    },

    // stores the state of a given keycode
    KEY_STATES: {},

    init: function () {
        this.controllers = {}

        // Keyboard
        // this.configureKeys()

        // document.addEventListener('keydown', function (e) {
        //     Input.changeKey(e.keyCode, 1)
        // })
        // document.addEventListener('keyup', function (e) {
        //     Input.changeKey(e.keyCode, 0)
        // })

        // Gamepad
        
    },

    configureKeys() {
        for (let key in this.KEYCODE_MAP) {
            this.KEY_STATES[this.KEYCODE_MAP[key]] = 0
        }
    },

    changeKey: function (key, value) {
        this.KEY_STATES[key] = value
    },

    isPressed(key = '') {
        key = key.toUpperCase()
        code = this.KEYCODE_MAP[key]
        if (this.KEY_STATES[code] !== undefined) {
            return this.KEY_STATES[code]
        }
    },

    gamepadHandler(event, connecting) {
        var gamepad = event.gamepad

        if (connecting) {
            
        } else {
            console.log(
                'Gamepad disconnected from index %d: %s',
                event.gamepad.index,
                event.gamepad.id
            )
            delete this.controllers[gamepad.index]
        }
    },

}
