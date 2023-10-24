class ScriptLoader{
    static scripts_loaded = [];
    static LoadedScriptsDiv = null;
    
    static Init(){
        ScriptLoader.LoadedScriptsDiv = document.createElement("div");
        document.body.appendChild(ScriptLoader.LoadedScriptsDiv);
        ScriptLoader.LoadedScriptsDiv.setAttribute("id", "LoadedScripts");
    }
    
    static LoadScript(location, onload){
        var script = document.createElement("script");
        ScriptLoader.LoadedScriptsDiv.appendChild(script);
        script.onload = function(){
            ScriptLoader.scripts_loaded.push(script);

            if(onload)
                onload();
        };
        script.src = location;
    }
}