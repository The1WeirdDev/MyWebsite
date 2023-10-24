class Chunk {
    world = null;
    chunk_x = 0;
    chunk_y = 0;

    mesh = null;
    vertices = [];
    indices = [];
    texture_data = [];
    face_index = 0;

    block_data = [];

    constructor(world, x, y) {
        this.world = world;
        this.chunk_x = x;
        this.chunk_y = y;
    }

    Init() {
        this.block_data = new Array(this.world.chunk_size * this.world.chunk_size);
        this.block_data.fill(0, 0, this.block_data.length);

        this.matrix = mat4.create();
        this.global_chunk_x = this.chunk_x * this.world.chunk_size;
        this.global_chunk_y = this.chunk_y * this.world.chunk_size;
        mat4.translate(this.matrix, this.matrix, [this.global_chunk_x, this.global_chunk_y, 0]);

        this.InitializeBlockData();

        this.CreateMeshData();

        this.CreateMesh();
    }

    GetBlock(x, y) {
        if (x < 0 || y < 0 || x >= this.world.chunk_size || y >= this.world.chunk_size)
            return 0;

        return this.block_data[(y * this.world.chunk_size) + x];
    }

    SetBlock(x, y, id) {
        if (x < 0 || y < 0 || x >= this.world.chunk_size || y >= this.world.chunk_size)
            return;

        this.block_data[(y * this.world.chunk_size) + x] = id;
    }

    InitializeBlockData() {
        for (var x = 0; x < this.world.chunk_size; x++) {
            //TODO : Perlin Noise
            var perlin_val = perlin.get((x + this.global_chunk_x + 0.01) / (this.world.chunk_size * 0.5), 0.01);
            var height = Math.floor(perlin_val * 10) + 10;

            for (var y = 0; y < this.world.chunk_size; y++) {
                var global_y = this.global_chunk_y + y;
                if (global_y < height) {
                    if (global_y < height - 4)
                        this.SetBlock(x, y, 2);
                    else if (global_y < height - 1)
                        this.SetBlock(x, y, 3);
                    else
                        this.SetBlock(x, y, 1);
                }
            }
        }
    }
    CreateMeshData() {
        for (var x = 0; x < this.world.chunk_size; x++) {
            for (var y = 0; y < this.world.chunk_size; y++) {
                if (this.GetBlock(x, y) != 0)
                    this.CreateFace(x, y, this.world.blocks[this.GetBlock(x, y)].texture);
            }
        }
    }
    CreateFace(x, y, texture) {
        this.vertices.push(x + 0);
        this.vertices.push(y);

        this.vertices.push(x + 0);
        this.vertices.push(y + 1);

        this.vertices.push(x + 1);
        this.vertices.push(y);

        this.vertices.push(x + 1);
        this.vertices.push(y + 1);

        var texture_size = 1 / 16;
        var texture_x = texture % 16;
        var texture_y = Math.floor(texture / 16);
        this.texture_data.push((texture_x + 1) * texture_size * 0.99);
        this.texture_data.push((texture_y + 1) * texture_size * 0.99);
        this.texture_data.push((texture_x + 1) * texture_size * 0.99);
        this.texture_data.push((texture_y) * texture_size);
        this.texture_data.push((texture_x) * texture_size);
        this.texture_data.push((texture_y + 1) * texture_size * 0.99);
        this.texture_data.push((texture_x) * texture_size);
        this.texture_data.push((texture_y) * texture_size);

        this.indices.push(this.face_index + 0);
        this.indices.push(this.face_index + 1);
        this.indices.push(this.face_index + 2);
        this.indices.push(this.face_index + 2);
        this.indices.push(this.face_index + 1);
        this.indices.push(this.face_index + 3);
        this.face_index += 4;
    }

    CreateMesh() {
        this.mesh = new ChunkMesh();
        this.mesh.CreateMesh(this.vertices, this.indices, this.texture_data);
    }
    CleanUp() { }
    Update() { }
    Draw() {
        Game.shader.LoadMatrix4(Game.shader.transformation_matrix_location, this.matrix);
        this.mesh.Draw();
    }
}