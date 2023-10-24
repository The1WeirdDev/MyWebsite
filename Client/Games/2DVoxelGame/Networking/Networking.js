class Networking {
    static socket = null;
    static is_connected = false;
    static server_socket = null;

    static ConnectToServer() {
        Networking.server_socket = io(window.location.origin, {
            transports: ["polling", "websockets"]
        });

        Networking.server_socket.on("connect", (socket) => {
            console.log("Connected");
            Networking.is_connected = true;

            Networking.server_socket.on("disconnect", () => {
                console.log("Disconnected");
                Networking.Disconnect();
            });

            Networking.SendPacket("Test", "Ben");
        });
    }
    static Disconnect() {
        if (Networking.is_connected) {
            Networking.server_socket.disconnect();
            Networking.server_socket = null;
            Networking.is_connected = false;
        }
    }

    static SendPacket(type, name) {
        if (Networking.is_connected) {
            Networking.server_socket.emit(type, name);
        }
    }
}