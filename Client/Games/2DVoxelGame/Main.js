var canvas = null;
var gl = null;

function Init() {
    canvas = Engine.CreateCanvas(1280, 720);
    gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: false });

    Game.Init();
    addEventListener("beforeunload", (event) => { Game.CleanUp(); });
    setInterval(Update, 1000 / 60);
    console.log("Initialized");
}
function Update() {
    Engine.CenterCanvas(canvas);
    Game.Update();
    Draw();
}

function Draw() {
    Game.Draw();
}

Engine.AddScriptToLoad("/Client/Games/2DVoxelGame/Display/Display.js");
Engine.AddScriptToLoad("/Client/Games/2DVoxelGame/Display/Shader.js");
Engine.AddScriptToLoad("/Client/Games/2DVoxelGame/Display/Mesh.js");
Engine.AddScriptToLoad("/Client/Games/2DVoxelGame/Display/Texture.js");

Engine.AddScriptToLoad("/Client/Games/2DVoxelGame/Networking/Networking.js");

Engine.AddScriptToLoad("/Client/Games/2DVoxelGame/World/World.js");
Engine.AddScriptToLoad("/Client/Games/2DVoxelGame/World/Chunk.js");
Engine.AddScriptToLoad("/Client/Games/2DVoxelGame/World/Block.js");
Engine.AddScriptToLoad("/Client/Games/2DVoxelGame/World/ChunkMesh.js");

Engine.AddScriptToLoad("/Client/Utils/Mathf.js");
Engine.AddScriptToLoad("/Client/Utils/Vector.js");
Engine.AddScriptToLoad("/Client/Utils/Time.js");
Engine.AddScriptToLoad("/Client/Utils/Input.js");
Engine.AddScriptToLoad("/Client/Utils/Perlin.js");

Engine.AddScriptToLoad("/Client/Games/2DVoxelGame/Game.js");
Engine.InitCallback = Init;
Engine.Init();