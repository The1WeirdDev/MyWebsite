const canvas = document.getElementById("GameCanvas");
const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: false });

var movement_x = 0, movement_y = 0;
var cursor_locked = false;
var simplex = new SimplexNoise(Math);
function Main() {
    Init();
    //setInterval(Update, 1000 / 15);
    Update();
    /*
    Pretty sure javascript just discards all of its resources
    */
}

function Init() {
    Game.Init();
}

function Update() {
    Game.Update();
    Draw();

    requestAnimationFrame(Update);
}
function Draw() {
    Game.Draw();
}

Main();
/*
const canvas = document.getElementById("GameCanvas");
const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: false });

var movement_x = 0, movement_y = 0;
var cursor_locked = false;
var simplex = new SimplexNoise(Math);

var shader = null;
var mesh = null;
var proj_matrix = mat4.create();

const fieldOfViewInRadians = Mathf.ToRadians(80);
const near = 0.01;
const far = 1000.0;
const f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
const rangeInv = 1 / (near - far);
const aspect_ratio = (16 / 9);

var player = null;

function Main() {
    Init();
    //setInterval(Update, 1000 / 15);
    Update();
}

function Init() {
    Display.Init();
    Keyboard.Init();
    Time.Init();
    Mouse.Init();

    shader = new ChunkShader();
    mesh = new BasicMesh();
    mesh.CreateMesh([0, 0, -5, 0, 1, -5, 1, 0, -5, 1, 1, -5], [0, 0, 0, 1, 1, 0, 1, 1], [0, 1, 2, 2, 1, 3]);

    player = new LocalPlayer();

    proj_matrix[0] = f / aspect_ratio;
    proj_matrix[1] = 0;
    proj_matrix[2] = 0;
    proj_matrix[3] = 0;
    proj_matrix[4] = 0;
    proj_matrix[5] = f;
    proj_matrix[6] = 0;
    proj_matrix[7] = 0;
    proj_matrix[8] = 0;
    proj_matrix[9] = 0;
    proj_matrix[10] = (near + far) * rangeInv;
    proj_matrix[11] = -1;
    proj_matrix[13] = 0;
    proj_matrix[14] = near * far * rangeInv * 2;
    proj_matrix[15] = 0;
    //Game.Init();
    console.log(shader.projection_matrix_location);
    console.log(shader.view_matrix_location);
    window.addEventListener("mousemove", (e) => {
        const {
            movementX,
            movementY
        } = e;
        movement_x = movementX;
        movement_y = movementY;
        Mouse.OnMouseMove(e);
    });
    player.Init();
}

function Update() {
    //Game.Update();
    Display.Update();
    Keyboard.Update();
    Mouse.Update();
    Time.Update();
    player.Update();
    Draw();

    requestAnimationFrame(Update);
}
function Draw() {
    proj_matrix = mat4.perspective(proj_matrix, Mathf.ToRadians(75), (16 / 9), 0.01, 1000);
    //var m = mat4.create();
    var m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    shader.Start();
    shader.LoadMatrix4x4(shader.projection_matrix_location, proj_matrix);
    mesh.Draw();
    shader.Stop();
    //Game.Draw();
}

Main();
*/