function LoadScriptLoader(onload) {
    var script_loader = document.createElement("script");
    document.body.appendChild(script_loader);
    script_loader.onload = function() {
        ScriptLoader.Init();

        if (onload)
            onload();
    }
    script_loader.src = "/Client/Engine/ScriptLoader.js";
}

class Engine {
    static libraries_to_load_left = 0;
    static scripts_to_load_left = 0;
    static scripts_to_load = [];

    static called_initialize = false;
    static InitCallback = null;

    static CreateCanvas(width, height) {
        var canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        canvas.style.position = "absolute";
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
    static CheckIfAllowedToInitialize() {
        if (Engine.scripts_to_load.length == 0 && Engine.libraries_to_load_left == 0) {
            if (Engine.InitCallback != null && Engine.called_initialize == false) {
                Engine.InitCallback();
                Engine.called_initialize = true;
            }
        }
    }
    static Init() {
        Engine.LoadLibraries();

        for (var i = 0; i < Engine.scripts_to_load.length; i++) {
            Engine.scripts_to_load_left++;
            ScriptLoader.LoadScript(Engine.scripts_to_load[i], function() {
                Engine.OnUserScriptLoaded(Engine.scripts_to_load[i]);
            });
        }
    }
    static AddScriptToLoad(location) {
        Engine.scripts_to_load.push(location);
    }
    static LoadLibraries() {
        Engine.libraries_to_load_left = 1;
        ScriptLoader.LoadScript("/Client/Libs/Momentum.js", Engine.OnLibraryLoaded);
    }
    static OnLibraryLoaded() {
        Engine.libraries_to_load_left--;
    }
    static OnUserScriptLoaded(location) {
        var index = Engine.scripts_to_load.indexOf(location);
        if (index) {
            Engine.scripts_to_load.splice(index, 1);
            Engine.CheckIfAllowedToInitialize();
        }
    }
    static CenterCanvas(canvas) {
        //canvas.style.left = `${(innerWidth - canvas.width) / 2}px`;
        //canvas.style.top = `${(innerHeight - canvas.height) / 2}px`;
    }
}