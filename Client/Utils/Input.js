class Input {
    static keys = null;

    static inputs_to_add = [];
    static inputs_to_remove = [];

    static normalized_mouse_x = 0;
    static normalized_mouse_y = 0;

    static Init() {
        Input.keys = new Array(256);
    }
    static Update() {
        for (var i = 0; i < 256; i++) {
            if (Input.keys[i] == 2)
                Input.keys[i] = 1;
        }

        for (var i = 0; i < Input.inputs_to_add.length; i++) {
            var input = Input.inputs_to_add[i];

            Input.keys[input] = 2;
            Input.inputs_to_add.shift();
        }

        for (var i = 0; i < Input.inputs_to_remove.length; i++) {
            var input = Input.inputs_to_remove[i];

            Input.keys[input] = 0;
            Input.inputs_to_remove.shift();
        }
    }

    static OnKeyPress(event) {
        if (event.repeat)
            return;

        var key_code = event.keyCode;
        Input.inputs_to_add.push(key_code);
    }
    static OnKeyUp(event) {
        var key_code = event.keyCode;
        Input.inputs_to_remove.push(key_code);
    }

    static OnMouseMoveEvent(e) {
        const canvas = gl.canvas;
        const rect = canvas.getBoundingClientRect();
        const mouse_x = e.clientX;
        const mouse_y = e.clientY;
        const linear_x = mouse_x / canvas.width;
        const linear_y = mouse_y / canvas.height;
        var normalized_x = (linear_x * 2) - 1;
        var normalized_y = ((linear_y * 2) - 1) * -1;
        Input.normalized_mouse_x = normalized_x;
        Input.normalized_mouse_y = normalized_y;
    }
}