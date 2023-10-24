const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

var movement_x = 0, movement_y = 0;

function Init() {
    document.body.appendChild(canvas);
    OnResize();

    Game.Init();
    Update();

    window.onResize = function() {
        OnResize();
    }
}

function OnResize() {
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}

function GetAspectRatio() {
    return canvas.width / canvas.height;
}

function Update() {
    Game.Update();
    Draw();
    requestAnimationFrame(Update);
}
function Draw() {
    Game.Draw();
}

function DrawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function GetGlobalCoords(_x, _y) {
    return { x: (_x + 0.5) * 2, y: (_y + 0.5) * 2 };
}
function DrawRectangle(x, y, width, height, color) {
    var global = GetGlobalCoords(x, y);
    var global_x = global.x;
    var global_y = global.y;
    console.log(global_x + " " + global_y);
    DrawRect(global_x * canvas.width, global_y * canvas.height * GetAspectRatio(), width * canvas.width, height * canvas.height * GetAspectRatio(), color);
}
function DrawSquare(x, y, size, color) {
    DrawRect(x * canvas.width, y * canvas.height * GetAspectRatio(), size * canvas.width, size * canvas.height * GetAspectRatio(), color);
}

Init();