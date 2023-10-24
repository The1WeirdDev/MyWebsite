const TileType = {
    None: 0,
    Wall: 1,
    Floor: 2,
};
class Tile {
    static square_mesh = null;
    static textured_square_mesh = null;

    static CreateMeshes() {
        Tile.square_mesh = new NonTexturedMesh();
        Tile.square_mesh.CreateMesh([0, 0, 0, 1, 1, 0, 1, 1], [0, 1, 2, 2, 1, 3]);
        Tile.textured_square_mesh = new TexturedMesh();
        Tile.textured_square_mesh.CreateMesh([0, 0, 0, 1, 1, 0, 1, 1],         [0, 0, 0, 0.125, 0.125, 0, 0.125, 0.125], [0, 1, 2, 2, 1, 3]);
        Tile.textured_square_flipped_mesh = new TexturedMesh();
        Tile.textured_square_flipped_mesh.CreateMesh([1, 1, 1, 0, 0, 1, 0, 0], [0, 0, 0, 0.125, 0.125, 0, 0.125, 0.125], [0, 1, 2, 2, 1, 3]);
    }
    
    constructor(x, y, tile_type, tile, cost) {
        this.x = x;
        this.y = y;
        this.cost = cost;
        
        this.type = tile_type;
        this.tile = tile;
        this.rotation = 0;

        this.UpdateMatrix();
    }

    UpdateMatrix(){
        this.matrix = mat4.create();
        mat4.translate(this.matrix, this.matrix, [this.x, this.y, 0]);
        mat4.rotate(this.matrix, this.matrix, Mathf.ToRadians(this.rotation * 90), [0, 1, 0]);
    }

    Update() { }
    Draw() {
        Game.default_shader.LoadTransformationMatrix(this.matrix);
        Shader.LoadInt(Game.default_shader.tile_texture_location, this.tile);
        Tile.textured_square_flipped_mesh.Draw();
    }

    SetTileType(type){
        this.type = type;

        switch(type){
            case TileType.Wall:
                //Check What texture it should be
                var left = Game.store.GetTile(this.x - 1, this.y, true);
                var right = Game.store.GetTile(this.x + 1, this.y, true);
                var down = Game.store.GetTile(this.x, this.y - 1, true);
                var up = Game.store.GetTile(this.x, this.y + 1, true);

                this.tile = 0;
                if(left.type == TileType.Wall && right.type == TileType.Wall){
                    this.tile = 16;
                    this.rotation = 0;
                    this.UpdateMatrix();
                }
                else if(up.type == TileType.Wall && down.type == TileType.Wall){
                    this.tile = 0;
                    this.rotation = 0;
                    this.UpdateMatrix();
                }
                
                break;
        }
    }
}