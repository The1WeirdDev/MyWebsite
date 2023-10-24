class Display{
    static OnWindowResize(){
        canvas.width = innerWidth;
        canvas.height = innerHeight - 59;
        gl.viewport(0, 0, canvas.width, canvas.height);

        Game.aspect_ratio = canvas.width / canvas.height;
        Game.CreateProjectionMatrix();
    }

    static GetAspectRatio(){
        return canvas.width / canvas.height;
    }
}