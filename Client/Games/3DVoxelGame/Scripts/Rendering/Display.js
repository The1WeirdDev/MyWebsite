class Display {
    static Init() {
        gl.clearColor(0, 0.8, 1, 1.0);
        gl.cullFace(gl.FRONT)
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        //gl.polygonMode(gl.GL_FRONT_AND_BACK, gl.GL_FILL);
    }
    static Update() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    static GetAspectRatio() {
        return canvas.width / canvas.height;
    }
}