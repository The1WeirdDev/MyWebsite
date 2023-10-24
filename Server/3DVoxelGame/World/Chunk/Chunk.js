const Block = require("./Block");

class Chunk {
    world = null;
    x = 0;
    z = 0;

    block_data = [];

    static chunk_width = 16;
    static chunk_height = 144;
    static chunk_layer_squared = Chunk.chunk_width * Chunk.chunk_width;

    constructor(world, x, z) {
        this.world = world;
        this.x = x;
        this.z = z;

        this.block_data = new Array(Chunk.chunk_width * Chunk.chunk_width * Chunk.chunk_height);
        this.block_data.fill(0, 0, this.block_data.length);
    }

    GenerateWorldData() {
        var global_x = this.x * Chunk.chunk_width;
        var global_z = this.z * Chunk.chunk_width;

        for (var x = 0; x < Chunk.chunk_width; x++) {
            for (var z = 0; z < Chunk.chunk_width; z++) {
                var global_block_x = x + global_x;
                var global_block_z = z + global_z;
                var perlin = this.world.simplex.noise((global_block_x + 0.25) / 80, (global_block_z + 0.25) / 80);
                var height = Math.floor(perlin * 30) + 80;

                for (var y = 0; y < height; y++) {
                    if (y == 0)
                        this.SetBlock(x, y, z, Block.bedrock);
                    else if (y < height - 3)
                        this.SetBlock(x, y, z, Block.stone);
                    else if (y < height - 1)
                        this.SetBlock(x, y, z, Block.dirt);
                    else
                        this.SetBlock(x, y, z, Block.grass);
                }
            }
        }
    }

    static IsBlockInChunk(x, y, z) {
        if (x < 0 || y < 0 || z < 0 || x >= Chunk.chunk_width || y >= Chunk.chunk_height || z >= Chunk.chunk_width)
            return false;
        return true;
    }

    GetBlock(x, y, z, check_surroundings = false) {
        if (Chunk.IsBlockInChunk(x, y, z))
            return this.block_data[(Chunk.chunk_layer_squared * y) + (x * Chunk.chunk_width) + z];

        if (check_surroundings && !(y < 0 || y >= Chunk.chunk_height)) {
            var offset_x = Math.floor(x / Chunk.chunk_width);
            var offset_z = Math.floor(z / Chunk.chunk_width);
            var new_chunk_x = this.x + offset_x;
            var new_chunk_z = this.z + offset_z;
            var chunk = this.world.GetChunk(new_chunk_x, new_chunk_z);

            if (chunk) {
                var bx = Math.abs(x - (offset_x * Chunk.chunk_width));
                var bz = Math.abs(z - (offset_z * Chunk.chunk_width));
                return chunk.GetBlock(bx, y, bz);
            }
        }
        return 1;
    }
    SetBlock(x, y, z, id) {
        if (Chunk.IsBlockInChunk(x, y, z))
            this.block_data[(Chunk.chunk_layer_squared * y) + (x * Chunk.chunk_width) + z] = id;
    }
}

module.exports = Chunk;