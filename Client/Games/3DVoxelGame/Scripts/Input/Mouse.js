class Mouse {
    static mouse_x;
    static mouse_y;
    static last_mouse_x;
    static last_mouse_y;
    static mouse_delta_x;
    static mouse_delta_y;

    static Init() {
        Mouse.mouse_x = 0;
        Mouse.mouse_y = 0;
        Mouse.last_mouse_x = 0;
        Mouse.last_mouse_y = 0;
        Mouse.mouse_delta_x = 0;
        Mouse.mouse_delta_y = 0;
    }

    static Update() {
        Mouse.mouse_delta_x = movement_x;// Mouse.mouse_x - Mouse.last_mouse_x;
        Mouse.mouse_delta_y = movement_y;// Mouse.mouse_y - Mouse.last_mouse_y;
        Mouse.last_mouse_x = Mouse.mouse_x;
        Mouse.last_mouse_y = Mouse.mouse_y;
        movement_x = 0;
        movement_y = 0;

        if (!document.hasFocus()) {
            Mouse.mouse_delta_x = 0;
            Mouse.mouse_delta_y = 0;
            movement_x = 0;
            movement_y = 0;
        }
    }

    static OnMouseDown(e) {
        if (e.button == 2)
            Game.player.PlaceOrDestroyBlock(false, 1);
        else if (e.button == 0)
            Game.player.PlaceOrDestroyBlock(true, 0);
    }
    static OnMouseUp(e) {


    }
    static OnMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        var linear_x = (x / canvas.clientWidth);
        var linear_y = (y / canvas.clientHeight);
        var normalized_x = linear_x * 2 - 1;
        var normalized_y = (linear_y * 2 - 1) * -1;

        Mouse.mouse_x = x;
        Mouse.mouse_y = y;
        Mouse.normalized_x = normalized_x;
        Mouse.normalized_y = normalized_y;
        Game.player.GetMouseInput();
        //player.GetMouseInput();
        //console.log("Moved");
    }
}