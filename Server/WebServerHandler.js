//These are headers for the client
const fs = require("fs");

function CapitalizeGameName(name) {
    if (typeof name == "string")
        return (name[0].toUpperCase() + (name.substring(1, name.length)));
    return "";
}
function IsGameName(name) {
    return (name == "Snake" || name == "RetailSimulator" || name == "Tetris" || name == "2DVoxelGame" || name == "3DVoxelGame" || name == "DoomStyle");
}

function IsEmulatorName(name) {
    return (name == "Chip8" || name == "Gameboy");
}

class WebServerHandler {
    static default_headers = { "Content-Type": "text/html" };
    static server = null;

    static Init(server) {
        WebServerHandler.server = server;
        server.get("*", WebServerHandler.OnGet);
    }

    static OnGet(req, res) {
        //fetch("https://slither.io").then((data)=>{
        //    console.log(data);
        //});

        try {
            //TODO : make code look better
            var new_url = req.url;
            if (new_url.startsWith("/")) new_url = new_url.slice(1);
            if (new_url == "") {
                //Redirect to home page
                res.redirect("/home"); return;
            }
            else if (new_url == "home") {
                //Home
                new_url = "Client/Home/Home.html";
            }
            else if (new_url.startsWith("proxy/")) {
                var url = new_url.substring(6, new_url.length);
                console.log(url);
                WebServerHandler.SendProxyData(url, res);
                return;
            }
            else {
                var split_url = new_url.split("/");
                var part_1 = split_url[0];

                //For Games
                if (part_1 == "games") {
                    var game_name = CapitalizeGameName(split_url[1]);

                    if (IsGameName(game_name)) {
                        if (split_url[2] == null || split_url.length < 2)
                            new_url = `Client/Games/${game_name}/${game_name}.html`;
                        else
                            new_url = `Client/Games/${game_name}/${split_url[1]}`;
                    } else if (game_name == "" || game_name.length < 2) {
                        new_url = `Client/Games/Games/Games.html`;
                    } else {
                        console.log(new_url);
                        res.writeHead(200, WebServerHandler.headers);
                        res.write("<html><h1>404 Not Found</h1></html>");
                        res.end();
                        return;
                    }
                }
                else if (part_1 == "editors") {
                    new_url = `Client/CodeEditors/Javascript/JavascriptEditor.html`;
                }
                else if (part_1 == "emulators") {
                    var game_name = CapitalizeGameName(split_url[1]);

                    if (IsEmulatorName(game_name)) {
                        if (split_url[2] == null || split_url.length < 2)
                            new_url = `Client/Emulators/${game_name}/${game_name}.html`;
                        else
                            new_url = `Client/Emulators/${game_name}/${split_url[1]}`;
                    } else if (game_name == "" || game_name.length < 2) {
                        new_url = `Client/Emulators/Emulators/Emulators.html`;
                    }
                }
            }

            WebServerHandler.SendFileToUser(new_url, res);
        }
        catch (exception) {
            console.log(exception);
        }
    }
    static SendProxyData(location, res) {
        try {
            fetch(`https://${location}`).then(function(response) {
                // The API call was successful!
                return response.text();
            }).then(function(data) {
                // This is the JSON from our response
                //console.log(data);
                res.writeHead(200, WebServerHandler.default_headers);
                res.write(data);
                //}
                res.end();
            }).catch(function(err) {
                // There was an error
                console.warn('Something went wrong.', err);

                res.writeHead(200, WebServerHandler.default_headers);
                res.write("ERRROR");
                //}
                res.end();
            });
        }
        catch (exception) {

        }
    }
    static SendFileToUser(location, res) {
        try {
            fs.readFile(location, (err, data) => {
                if (err) {
                    res.writeHead(404, WebServerHandler.default_headers);
                    res.write("<html><h1>error 404 page not found</h1></html>");
                } else {
                    res.writeHead(200, WebServerHandler.default_headers);
                    res.write(data);
                }
                res.end();
            });
        } catch (exception) { }
    }
};

module.exports = WebServerHandler;