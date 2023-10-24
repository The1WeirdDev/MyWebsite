const canvas = document.getElementById("GameCanvas");
const output_div = document.getElementById("OutputDiv");
const context = canvas.getContext("2d");

var size = 10;

var can_clock = true;

var cpu = null;

function Start() {
    Init();

    document.addEventListener('keydown', (e) => {
        if (e.repeat)
            return;

        //OnKeyEvent(e.key, 1);
    });

    document.addEventListener('keyup', (e) => {
        if (e.repeat)
            return;

        //OnKeyEvent(e.key, 0);
    });

    fetch('/Client/Emulators/Gameboy/Roms/DMG_ROM.gb').then(res => res.arrayBuffer()).then(arrayBuffer => {
        // use ArrayBuffer
        const view = new Uint8Array(arrayBuffer);
        for (var i = 0; i < arrayBuffer.byteLength; i++)
            cpu.SetMemVal(i, view[i]);
        
        console.log("Starting Emulation");
        can_clock = true;
        setInterval(Update, 1000 / 60);
    });
}

function Init() {
    cpu = new Cpu();
    cpu.Reset();
    
    canvas.width = 64 * size;
    canvas.height = 32 * size;
}

function Update() {
    cpu.Clock();
    Draw();
}

function Draw() {
    /*
    Potential Optimization
    Only redraw if screen data is modified
    */
    DrawRect("black", 0, 0, canvas.width, canvas.height);
}

function DrawRect(color, x, y, width, height){
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

Start();