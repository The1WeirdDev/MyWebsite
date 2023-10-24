class World {
    chunks = null;
    chunk_size = 25;

    Init() {
        this.chunks = new Array(0);
        this.blocks = new Array(0);
        this.texture_id = Texture.LoadTexture(gl, null);

        this.InitializeBlocks();

        this.CreateChunk(0, 0);
        this.CreateChunk(-1, 0);
    }
    CleanUp() { }

    InitializeBlocks() {
        this.blocks.push(new Block("Air", 0, false));
        this.blocks.push(new Block("Grass", 0));
        this.blocks.push(new Block("Dirt", 1));
        this.blocks.push(new Block("Stone", 2));
    }
    GetChunk(x, y) {
        for (let i = 0; i < this.chunks.length; i++) {
            let chunk = this.chunks[i];

            if (chunk.chunk_x == x && chunk.chunk_y == y)
                return chunk;
        }
        return null;
    }
    CreateChunk(x, y) {
        var chunk = new Chunk(this, x, y);
        chunk.Init();
        this.chunks.push(chunk);
        return chunk;
    }

    GetBlock(get_x, get_y) {
        var x = Math.floor(get_x);
        var y = Math.floor(get_y);

        var chunk_x = Math.floor(x / this.chunk_size);
        var chunk_y = Math.floor(y / this.chunk_size);

        var chunk = this.GetChunk(chunk_x, chunk_y);

        if (chunk) {
            var block_x = Math.abs(x - (chunk_x * this.chunk_size));
            var block_y = Math.abs(y - (chunk_y * this.chunk_size));

            return chunk.GetBlock(block_x, block_y);
        }

        return 0;
    }

    Update() {

    }
    Draw() {
        Game.shader.Start();
        Game.shader.LoadMatrix4(Game.shader.transformation_matrix_location, mat4.create());

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture_id);

        for (var i = 0; i < this.chunks.length; i++) {
            this.chunks[i].Draw();
        }

        Game.shader.Stop();
    }
}