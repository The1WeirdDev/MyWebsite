const WorldType = {
    Client: 0,
    Server: 1,
}

class World {
    name = "";

    chunks = [];
    blocks = [];

    texture_size = 16 / 256;

    world_type = null;

    constructor(type) {
        this.world_type = type;
        this.AddBlock(new Block("Air", false, false, 0, 0, 0, 0, 0, 0));
        this.AddBlock(new Block("Grass", true, true, 0, 2, 1, 1, 1, 1));
        this.AddBlock(new Block("Dirt", true, true, 2, 2, 2, 2, 2, 2));
        this.AddBlock(new Block("Stone", true, true, 3, 3, 3, 3, 3, 3));
        this.AddBlock(new Block("Bedrock", true, false, 4, 4, 4, 4, 4, 4));
        this.AddBlock(new Block("Test", true, true, 5, 5, 5, 5, 5, 5));
        this.AddBlock(new Block("Wood", true, true, 6, 6, 6, 6, 6, 6));
        this.AddBlock(new Block("Plank", true, true, 7, 7, 7, 7, 7, 7));
    }

    AddBlock(block) {
        this.blocks.push(block);
    }

    GetBlockFromId(id) {
        return this.blocks[id];
    }

    CreateFrustomMatrix() {
        this.frustom_matrix = mat4.create();
        this.frustom_matrix = mat4.perspective(this.frustom_matrix, Mathf.ToRadians(160), Display.GetAspectRatio(), 0.001, 1000);
    }
}