const express = require("express");
const http = require("http");
const socket_io = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket_io(server);
const port = 7777;

const Network = require("./Network");
const WebServerHandler = require("./WebServerHandler");


io.on("connect", (socket) => {
    //Socket io Server for games and apps
    console.log("Connected");
    Network.OnSocketConnected(socket);
});

server.listen(port, (error) => {
    //For the http server
    if (error)
        console.log(`Error starting server on port ${port}`);
    else {
        console.log(`Starting server on port ${port}`);
        WebServerHandler.Init(app);
        Network.Init();
    }
});
