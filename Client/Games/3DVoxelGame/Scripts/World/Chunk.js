const BlockDirection = {
    Up: 0,
    Down: 1,
    East: 2,
    West: 3,
    North: 4,
    South: 5
}

class Chunk {
    world = null;
    x = 0;
    z = 0;
    global_x = 0;
    global_z = 0;

    block_data = null;
    generated_block_data = false;
    created_mesh_data = false;

    //MeshData
    vertices = [];
    texture_coords = [];
    indices = [];
    mesh = null;
    vertex_index = 0;
    created = false;

    static chunk_width = 16;
    static chunk_height = 144;
    static chunk_layer_squared = Chunk.chunk_width * Chunk.chunk_width;

    constructor(world, x, z) {
        this.world = world;
        this.x = x;
        this.z = z;
        this.global_x = this.x * Chunk.chunk_width;
        this.global_z = this.z * Chunk.chunk_width;

        this.block_data = new Array(Chunk.chunk_width * Chunk.chunk_height * Chunk.chunk_width);
        this.block_data.fill(0, 0, this.block_data.length);

        this.mesh = new ChunkMesh();
        this.transformation_matrix = mat4.create();
        this.transformation_matrix = mat4.translate(this.transformation_matrix, this.transformation_matrix, [this.global_x, 0, this.global_z]);
    }

    CreateBlockData() {
        /*
        This is called for local worlds
        */
        for (var x = 0; x < Chunk.chunk_width; x++) {
            for (var z = 0; z < Chunk.chunk_width; z++) {
                var global_x = x + this.global_x;
                var global_z = z + this.global_z;
                var perlin = simplex.noise((global_x + 0.25) / 20, (global_z + 0.25) / 20);
                var height = Math.floor(perlin * 5) + 5;
                for (var y = 0; y < height; y++) {
                    this.SetBlock(x, y, z, 1);
                }
            }
        }
        this.generated_block_data = true;
    }

    SetChunkData(data) {
        this.block_data = data;
        this.generated_block_data = true;
    }

    CreateMeshData() {
        this.vertices = [];
        this.texture_coords = [];
        this.indices = [];
        this.vertex_index = 0;

        for (var x = 0; x < Chunk.chunk_width; x++) {
            for (var z = 0; z < Chunk.chunk_width; z++) {
                for (var y = 0; y < Chunk.chunk_height; y++) {
                    var block = this.GetBlock(x, y, z);//Int value
                    var current_block = this.world.GetBlockFromId(block);//Block class
                    if (block != 0) {
                        if (this.GetBlock(x, y + 1, z) == 0)
                            this.AddFace(x, y, z, current_block.top_texture, BlockDirection.Up);

                        if (this.GetBlock(x, y - 1, z, true) == 0)
                            this.AddFace(x, y, z, current_block.bottom_texture, BlockDirection.Down);

                        if (this.GetBlock(x, y, z + 1, true) == 0)
                            this.AddFace(x, y, z, current_block.front_texture, BlockDirection.North);

                        if (this.GetBlock(x, y, z - 1, true) == 0)
                            this.AddFace(x, y, z, current_block.back_texture, BlockDirection.South);

                        if (this.GetBlock(x + 1, y, z, true) == 0)
                            this.AddFace(x, y, z, current_block.left_texture, BlockDirection.East);

                        if (this.GetBlock(x - 1, y, z, true) == 0)
                            this.AddFace(x, y, z, current_block.right_texture, BlockDirection.West);
                    }
                }
            }
        }

        this.created_mesh_data = true;
    }

    CreateMesh() {
        if (this.created) {
            this.mesh.CleanUp();
        }

        this.mesh.CreateMesh(this.vertices, this.texture_coords, this.indices);
        this.created = true;
    }

    AddFace(x, y, z, texture, direction) {
        switch (direction) {
            case BlockDirection.North: {
                this.vertices.push(x + 1);
                this.vertices.push(y + 1);
                this.vertices.push(z + 1);

                this.vertices.push(x + 1);
                this.vertices.push(y + 0);
                this.vertices.push(z + 1);

                this.vertices.push(x + 0);
                this.vertices.push(y + 1);
                this.vertices.push(z + 1);
                this.vertices.push(x + 0);
                this.vertices.push(y + 0);
                this.vertices.push(z + 1);
                break;
            }
            case BlockDirection.South: {
                this.vertices.push(x + 0);
                this.vertices.push(y + 1);
                this.vertices.push(z + 0);

                this.vertices.push(x + 0);
                this.vertices.push(y + 0);
                this.vertices.push(z + 0);

                this.vertices.push(x + 1);
                this.vertices.push(y + 1);
                this.vertices.push(z + 0);

                this.vertices.push(x + 1);
                this.vertices.push(y + 0);
                this.vertices.push(z + 0);
                break;
            }
            case BlockDirection.East: {

                this.vertices.push(x + 1);
                this.vertices.push(y + 1);
                this.vertices.push(z + 0);

                this.vertices.push(x + 1);
                this.vertices.push(y + 0);
                this.vertices.push(z + 0);

                this.vertices.push(x + 1);
                this.vertices.push(y + 1);
                this.vertices.push(z + 1);

                this.vertices.push(x + 1);
                this.vertices.push(y + 0);
                this.vertices.push(z + 1);
                break;
            }
            case BlockDirection.West: {
                this.vertices.push(x + 0);
                this.vertices.push(y + 1);
                this.vertices.push(z + 1);

                this.vertices.push(x + 0);
                this.vertices.push(y + 0);
                this.vertices.push(z + 1);

                this.vertices.push(x + 0);
                this.vertices.push(y + 1);
                this.vertices.push(z + 0);

                this.vertices.push(x + 0);
                this.vertices.push(y + 0);
                this.vertices.push(z + 0);
                break;
            }
            case BlockDirection.Up: {
                this.vertices.push(x + 0);
                this.vertices.push(y + 1);
                this.vertices.push(z + 0);

                this.vertices.push(x + 1);
                this.vertices.push(y + 1);
                this.vertices.push(z + 0);

                this.vertices.push(x + 0);
                this.vertices.push(y + 1);
                this.vertices.push(z + 1);

                this.vertices.push(x + 1);
                this.vertices.push(y + 1);
                this.vertices.push(z + 1);
                break;
            }
            case BlockDirection.Down: {
                this.vertices.push(x + 0);
                this.vertices.push(y + 0);
                this.vertices.push(z + 0);

                this.vertices.push(x + 0);
                this.vertices.push(y + 0);
                this.vertices.push(z + 1);

                this.vertices.push(x + 1);
                this.vertices.push(y + 0);
                this.vertices.push(z + 0);

                this.vertices.push(x + 1);
                this.vertices.push(y + 0);
                this.vertices.push(z + 1);
                break;
            }
            default: {
                console.log("Error this shouldnt be called");
                break;
            }
        }

        //var x_pos = texture * this.world.texture_size;
        var y_level = Math.floor(texture / 16);
        //var y_pos = y_level * this.world.texture_size;

        this.texture_coords.push(texture);
        this.texture_coords.push(y_level);
        this.texture_coords.push(texture);
        this.texture_coords.push(y_level + 1);
        this.texture_coords.push(texture + 1);
        this.texture_coords.push(y_level);
        this.texture_coords.push(texture + 1);
        this.texture_coords.push(y_level + 1);
        /*
        this.texture_coords.push(x_pos);
        this.texture_coords.push(y_pos);
        this.texture_coords.push(x_pos);
        this.texture_coords.push(y_pos + this.world.texture_size);
        this.texture_coords.push(x_pos + this.world.texture_size);
        this.texture_coords.push(y_pos);
        this.texture_coords.push(x_pos + this.world.texture_size);
        this.texture_coords.push(y_pos + this.world.texture_size);
        */

        this.indices.push(this.vertex_index + 0);
        this.indices.push(this.vertex_index + 1);
        this.indices.push(this.vertex_index + 2);
        this.indices.push(this.vertex_index + 2);
        this.indices.push(this.vertex_index + 1);
        this.indices.push(this.vertex_index + 3);
        this.vertex_index += 4;
    }

    Update() {

    }

    Draw() {
        //if (!this.mesh.created)
        //    return;
        Game.chunk_shader.LoadMatrix4x4(Game.chunk_shader.transformation_matrix_location, this.transformation_matrix);
        this.mesh.Draw();
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
                if (chunk.generated_block_data) {
                    var bx = Math.abs(x - (offset_x * Chunk.chunk_width));
                    var bz = Math.abs(z - (offset_z * Chunk.chunk_width));
                    return chunk.GetBlock(bx, y, bz);
                }
            }
        }
        return 1;
    }
    SetBlock(x, y, z, id) {
        if (Chunk.IsBlockInChunk(x, y, z))
            this.block_data[(Chunk.chunk_layer_squared * y) + (x * Chunk.chunk_width) + z] = id;
    }
}