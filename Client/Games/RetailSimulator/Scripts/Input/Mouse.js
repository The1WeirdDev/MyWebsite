class Mouse{
    static Init(){
        Mouse.position_x = 0;
        Mouse.position_y = 0;
        Mouse.last_position_x = 0;
        Mouse.last_position_y = 0;
        Mouse.delta_x = 0;
        Mouse.delta_y = 0;
        Mouse.mouse_events = []

        Mouse.buttons = new Array(8);
        Mouse.buttons.fill(0, 0, 8);
    }

    static Update(){
        Mouse.delta_x = Mouse.position_x - Mouse.last_position_x;
        Mouse.delta_y = (Mouse.position_y - Mouse.last_position_y) * -1;
        Mouse.last_position_x = Mouse.position_x;
        Mouse.last_position_y = Mouse.position_y;

        Mouse.normalized_x = Mathf.Clamp(((Mouse.position_x / innerWidth) * 2) - 1, -1, 1);
        Mouse.normalized_y = -1 * Mathf.Clamp(((Mouse.position_y / (innerHeight - 59)) * 2) - 1, -1, 1);
        
        for(var i = 0; i < Mouse.buttons.length; i++)
            if(Mouse.buttons[i] == 2)
                Mouse.buttons[i] = 1;

        for(var i = 0; i < Mouse.mouse_events.length; i++){
            var event = Mouse.mouse_events[i];
            Mouse.buttons[event.mouse_button] = event.state;
        }
        Mouse.mouse_events = [];
    }

    static IsButtonPressed(button){
        if(button >= 0 && button < 8)
            return Mouse.buttons[button] == 2;
        return false;
    }
    
    static IsButtonDown(button){
        if(button >= 0 && button < 8)
            return Mouse.buttons[button] > 0;
        return false;
    }
    
    static IsButtonUp(button){
        if(button >= 0 && button < 8)
            return Mouse.buttons[button] == 0;
        return false;
    }
    
    static OnMouseMove(e){
        Mouse.position_x = e.clientX;
        Mouse.position_y = e.clientY - 59;
        //Mouse.delta_x = Mouse.position_x - Mouse.last_position_x;
        //Mouse.delta_y = (Mouse.position_y - Mouse.last_position_y) * -1;
        //Mouse.last_position_x = Mouse.position_x;
        //Mouse.last_position_y = Mouse.position_y;
    }
    
    static OnMouseDown(e){
        if(e.button == 0 || e.button == 2)
            Mouse.mouse_events.push({mouse_button:e.button, state: 2});
    }
    
    static OnMouseUp(e){
        if(e.button == 0 || e.button == 2)
            Mouse.mouse_events.push({mouse_button:e.button, state: 0});
    }
}