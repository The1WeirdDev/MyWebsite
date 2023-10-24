const Vector3 = require("./../Utils/Vector3");
const { v4: uuidv4 } = require('uuid');

class Player {
    network_object = null;
    socket = null;

    position = null;
    user_id = null;

    constructor(network_object, socket) {
        this.network_object = network_object;
        this.socket = socket;
        this.position = new Vector3();
        this.user_id = uuidv4();
        this.SetEvents();
    }

    SetEvents() {

    }

    SetPosition(x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }

    GetPosition() {
        return this.position;
    }
}

module.exports = Player;