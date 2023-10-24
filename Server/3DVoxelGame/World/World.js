const Chunk = require("./Chunk/Chunk.js");
const SimplexNoise = require("./../../Libs/SimplexNoise");
class World {
    chunks = null;
    simplex = null;

    name = "";
    constructor(name) {
        this.name = name;

        this.simplex = new SimplexNoise(Math);
        this.chunks = new Map();
    }

    GetChunk(x, z) {
        var chunk = this.chunks.get(`${x},${z}`);
        return chunk;
    }

    CreateChunk(x, z) {
        var chunk = new Chunk(this, x, z);
        this.chunks.set(`${x},${z}`, chunk);
        chunk.GenerateWorldData();
        return chunk;
    }

    GetBlock(x, y, z) {
        if (y < 0 || y >= Chunk.chunk_height)
            return 0;

        var floor_x = Math.floor(x);
        var floor_y = Math.floor(y);
        var floor_z = Math.floor(z);
        var chunk_x = Math.floor(x / Chunk.chunk_width);
        var chunk_z = Math.floor(z / Chunk.chunk_width);

        var chunk = this.GetChunk(chunk_x, chunk_z);
        if (chunk) {
            return chunk.GetBlock(floor_x - (chunk_x * Chunk.chunk_width), floor_y, floor_z - (chunk_z * Chunk.chunk_width));
        }

        return 0;
    }

    SetBlock(x, y, z, id) {
        if (y < 0 || y >= Chunk.chunk_height)
            return 0;

        var floor_x = Math.floor(x);
        var floor_y = Math.floor(y);
        var floor_z = Math.floor(z);
        var chunk_x = Math.floor(x / Chunk.chunk_width);
        var chunk_z = Math.floor(z / Chunk.chunk_width);

        var chunk = this.GetChunk(chunk_x, chunk_z);
        if (chunk) {
            var block_x = floor_x - (chunk_x * Chunk.chunk_width);
            var block_z = floor_z - (chunk_z * Chunk.chunk_width);
            chunk.SetBlock(block_x, floor_y, block_z, id);
        }
    }
}
module.exports = World;