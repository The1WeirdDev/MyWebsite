const canvas = document.getElementById("GameCanvas");
const gl = canvas.getContext("webgl2", { premultipliedAlpha: false, antialias: false });

function Start() {
    Init();
    AddEventListeners();
    Update();
    //setInterval(Update, 1000 / 5);
}

function AddEventListeners() {
    window.addEventListener("resize", (e) => {
        Display.OnWindowResize();
    });

    window.addEventListener("mousemove", Mouse.OnMouseMove);
    
    document.body.onmousedown = Mouse.OnMouseDown;
    document.body.onmouseup = Mouse.OnMouseUp;
}
function Init() {
    Display.OnWindowResize();

    Game.Init();
}

function Update() {
    Game.Update();
    Draw();
    requestAnimationFrame(Update);
}
function Draw() {
    gl.clearColor(0.8, 0.8, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    Game.Draw();
}

window.onload = Start;