const Player = require("./3DVoxelGame/Player");
const World = require("./3DVoxelGame/World/World.js");
const Chunk = require("./3DVoxelGame/World/Chunk/Chunk.js");

class Network {
    static players = [];
    static world = null;

    static Init() {
        Network.world = new World("TestWorld");
        console.log("Initialized Network Class");
    }

    static OnSocketConnected(socket) {
        var player = new Player(this, socket);
        Network.players.push(player);

        console.log(socket.id + " Connected");
        Network.BroadcastWithException("PlayerJoined", [player.user_id], player.user_id);

        socket.on("GetPlayerList", () => {
            var list = [];
            for (var i = 0; i < Network.players.length; i++) {
                var plr = Network.players[i];
                if (plr.user_id != player.user_id) {
                    list.push(Network.players[i].user_id);
                }
            }
            socket.emit("SetPlayerList", list);
        });

        socket.on("SetBlock", (x, y, z, id) => {
            var chunk_x = Math.floor(x / Chunk.chunk_width);
            var block_y = Math.floor(y);
            var chunk_z = Math.floor(z / Chunk.chunk_width);

            var chunk = this.world.GetChunk(chunk_x, chunk_z);
            if (chunk) {
                if (block_y >= 1) {
                    this.world.SetBlock(x, block_y, z, id);
                    Network.Broadcast("ReceivedChunkData", [chunk_x, chunk_z, chunk.block_data]);
                }
            }
        });

        socket.on("GetChunk", (x, z) => {
            var chunk = Network.world.GetChunk(x, z);
            if (!chunk)
                chunk = Network.world.CreateChunk(x, z);

            socket.emit("ReceivedChunkData", x, z, chunk.block_data);
        });

        socket.on("SetPosition", (x, y, z) => {
            player.SetPosition(x, y, z);
            Network.BroadcastWithException("SetPlayerPosition", [player.user_id, x, y, z], player.user_id);
        })

        socket.on("disconnect", () => {
            Network.OnSocketDisconnected(player);
        });
    }

    static Broadcast(type, data) {
        for (var i = 0; i < Network.players.length; i++) {
            var player = Network.players[i];
            var socket = player.socket;

            socket.emit(type, ...data);
        }
    }

    static BroadcastWithException(type, data, user_id) {
        for (var i = 0; i < Network.players.length; i++) {
            var player = Network.players[i];
            var socket = player.socket;

            if (player.user_id != user_id)
                socket.emit(type, ...data);
        }
    }

    static OnSocketDisconnected(player) {
        console.log(player.socket.id + " Disconnected");
        Network.Broadcast("PlayerLeft", player.user_id);
        var index = Network.players.indexOf(player);

        if (index >= 0) {
            Network.players.splice(index, 1);
        }
    }
}

module.exports = Network;