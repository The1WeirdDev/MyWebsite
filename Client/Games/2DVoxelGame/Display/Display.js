class Display {
    static background_color = null;

    static Init() {
        Display.background_color = new Vector3(0, 0.5, 1);
    }
    static Update() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.clearColor(Display.background_color.x, Display.background_color.y, Display.background_color.z, 1);
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    static Draw() {

    }
}