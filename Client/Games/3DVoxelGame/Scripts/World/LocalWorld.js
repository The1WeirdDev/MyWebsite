class LocalWorld extends World{
    chunks_meshes_to_create = [];

    texture_id = null;

    constructor() {
        super(WorldType.Client);
    }

    Init() {
        this.chunks = new Map();

        this.texture_id = Texture.LoadTexture(gl, "Client/Res/texture_pack.png");
        this.chunks_meshes_to_create = new Array();
    }
    Update() {
        var chunk_x = Math.floor(Game.player.position.x / Chunk.chunk_width);
        var chunk_z = Math.floor(Game.player.position.z / Chunk.chunk_width);
        for (var x = chunk_x - 10; x <= chunk_x + 10; x++) {
            for (var z = chunk_z - 10; z <= chunk_z + 10; z++) {
                var chunk = this.GetChunk(x, z);
                if (!chunk) {
                    chunk = this.CreateChunk(x, z);
                }
                chunk.Update();
            }
        }

        for (var i = 0; i < this.chunks_meshes_to_create.length; i++) {
            this.chunks_meshes_to_create[i].CreateMeshData();
        }

        this.chunks_meshes_to_create = [];
    }
    Draw() {
        Game.chunk_shader.Start();

        var chunk_x = Math.floor(Game.player.position.x / Chunk.chunk_width);
        var chunk_z = Math.floor(Game.player.position.z / Chunk.chunk_width);
        for (var x = chunk_x - 10; x <= chunk_x + 10; x++) {
            for (var z = chunk_z - 10; z <= chunk_z + 10; z++) {
                var chunk = this.chunks.get(`${x},${z}`);
                if(chunk)
                    chunk.Draw();
            }
        }
        //Game.chunk_shader.Stop();
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

        return 1;
    }

    SetBlock(x, y, z, id, regenerate_chunk = true) {
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

            if (regenerate_chunk) {
                this.AddChunkToRecreateListIfNot(chunk);

                if (block_x == Chunk.chunk_width - 1)
                    this.AddChunkToRecreateListIfNot(this.GetChunk(chunk_x + 1, chunk_z));

                if (block_x == 0)
                    this.AddChunkToRecreateListIfNot(this.GetChunk(chunk_x - 1, chunk_z));

                if (block_z == Chunk.chunk_width - 1)
                    this.AddChunkToRecreateListIfNot(this.GetChunk(chunk_x, chunk_z + 1));

                if (block_z == 0)
                    this.AddChunkToRecreateListIfNot(this.GetChunk(chunk_x, chunk_z - 1));
            }
        }
    }

    GetChunk(x, z) {
        var chunk = this.chunks.get(`${x},${z}`);
        return chunk;
    }
    CreateChunk(x, z) {
        var chunk = new Chunk(this, x, z);
        this.chunks.set(`${x},${z}`, chunk);
        chunk.CreateBlockData();

        this.AddChunkToRecreateListIfNot(chunk);
        this.AddChunkToRecreateListIfNot(this.GetChunk(x + 1, z));
        this.AddChunkToRecreateListIfNot(this.GetChunk(x - 1, z));
        this.AddChunkToRecreateListIfNot(this.GetChunk(x, z + 1));
        this.AddChunkToRecreateListIfNot(this.GetChunk(x, z - 1));
        return chunk;
    }

    AddChunkToRecreateListIfNot(chunk) {
        if (chunk == null)
            return;

        var index = this.chunks_meshes_to_create.indexOf(chunk);
        if (index < 0)
            this.chunks_meshes_to_create.push(chunk);
    }
}