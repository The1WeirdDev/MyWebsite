class Keyboard {
    static keys = [];
    static keys_to_update = [];

    static Init() {
        Keyboard.keys = new Array(400);
        Keyboard.keys = Keyboard.keys.fill(0, Keyboard.keys.length, 0);
    }
    static Update() {
        for (var i = 0; i < 400; i++) {
            if (Keyboard.keys[i] == 2)
                Keyboard.keys[i] = 1;
        }

        for (var i = 0; i < Keyboard.keys_to_update.length; i++) {
            var key = Keyboard.keys_to_update[i];

            Keyboard.keys[key[0]] = key[1];
        }

        Keyboard.keys_to_update.length = 0;

    }

    static IsKeyPressed(key) {
        if (key >= 0 && key < 400)
            return Keyboard.keys[key] == 2;

        return false;
    }

    static IsKeyDown(key) {
        if (key == 27) {
            Keyboard.keys = Keyboard.keys.fill(0, Keyboard.keys.length, 0);
            return;
        }
        if (key >= 0 && key < 400)
            return Keyboard.keys[key] > 0;

        return false;
    }

    static OnKeyPress(e) {
        Keyboard.keys_to_update.push([e.keyCode, 2]);
    }
    static OnKeyUp(e) {
        Keyboard.keys_to_update.push([e.keyCode, 0]);
    }
}