const TileType = {
    None: 0,
    Wall: 1,
    Floor: 2,
};

var textures_in_row = 32;

const TileEvents = {
    NearbyTileChanged: 0
}
class Tile {
    static square_mesh = null;
    static textured_square_mesh = null;

    static CreateMeshes() {
        var texture_size = 32 / 1024;
        Tile.square_mesh = new NonTexturedMesh();
        Tile.square_mesh.CreateMesh([0, 0, 0, 1, 1, 0, 1, 1], [0, 1, 2, 2, 1, 3]);
        
        Tile.textured_square_mesh = new TexturedMesh();
        Tile.textured_square_flipped_mesh = new TexturedMesh();

        Tile.textured_square_mesh.CreateMesh([0, 0, 0, 1, 1, 0, 1, 1],         [0, 0, 0, texture_size, texture_size, 0, texture_size, texture_size], [0, 1, 2, 2, 1, 3]);
        Tile.textured_square_flipped_mesh.CreateMesh([1, 1, 1, 0, 0, 1, 0, 0], [0, 0, 0, texture_size, texture_size, 0, texture_size, texture_size], [0, 1, 2, 2, 1, 3]);
    }
    
    constructor(x, y, tile_type, tile, cost) {
        this.x = x;
        this.y = y;
        this.cost = cost;
        
        this.type = tile_type;
        this.tile = tile;
        this.rotation = 0;

        this.events = [];

        this.UpdateMatrix();
    }

    UpdateMatrix(){
        var rotation = Mathf.ToRadians(this.rotation * 90);
        var offset_x = 0;
        var offset_y = 0;
        if(this.rotation == 1){
            offset_x = 1;
            offset_y = 0;
        }
        else if(this.rotation == 2){
            offset_x = 1;
            offset_y = 1;
        }
        else if(this.rotation == 3){
            offset_x = 0;
            offset_y = 1;
        }
        this.matrix = mat4.create();
        mat4.translate(this.matrix, this.matrix, [this.x + offset_x, this.y + offset_y, 0]);
        //mat4.translate(this.matrix, this.matrix, [this.x + (this.rotation == 1 ? 1 : 0), this.y + (this.rotation == 3 ? 1 : 0), 0]);
        mat4.rotate(this.matrix, this.matrix, rotation, [0, 0, 1]);
    }

    Update() { 
        for(var i = 0; i < this.events.length; i++){
            var event = this.events[i];
            switch(event){
            case TileEvents.NearbyTileChanged:
                switch(this.type){
                    case TileType.Wall:
                        //Get Nearby Tiles
                        var left = Game.store.GetTile(this.x - 1, this.y, true).type == TileType.Wall ? 1 : 0;
                        var right = Game.store.GetTile(this.x + 1, this.y, true).type == TileType.Wall ? 1 : 0;
                        var down = Game.store.GetTile(this.x, this.y - 1, true).type == TileType.Wall ? 1 : 0;
                        var up = Game.store.GetTile(this.x, this.y + 1, true).type == TileType.Wall ? 1 : 0;
                        var surrounding = (left << 3) | (right << 2) | (down << 1) | up;
                        //Check What texture it should be

                        switch(surrounding){
                            case 0b0000:
                                this.tile = 0;
                                this.rotation = 0;
                                break;
                            case 0b0010:
                                this.tile = 0;
                                this.rotation = 0;
                                break;
                            case 0b0001:
                                this.tile = 0;
                                this.rotation = 0;
                                break;
                            case 0b1111:
                                this.tile = textures_in_row * 3;
                                this.rotation = 0;
                                break;
                            case 0b1110:
                                this.tile = textures_in_row * 2;
                                this.rotation = 2;
                                break;
                            case 0b1011:
                                this.tile = textures_in_row * 2;
                                this.rotation = 1;
                                break;
                            case 0b1100:
                                this.tile = 0;
                                this.rotation = 1;
                                break;
                            case 0b0011:
                                this.tile = 0;
                                this.rotation = 0;
                                break;
                            case 0b0110:
                                this.tile = textures_in_row;
                                this.rotation = 3;
                                break;
                            case 0b0111:
                                this.tile = textures_in_row * 2;
                                this.rotation = 3;
                                break;
                            case 0b1010:
                                this.tile = textures_in_row;
                                this.rotation = 2;
                                break;
                            case 0b0101:
                                this.tile = textures_in_row;
                                this.rotation = 0;
                                break;
                            case 0b1001:
                                this.tile = textures_in_row;
                                this.rotation = 1;
                                break;
                            case 0b1000:
                                this.tile = 0;
                                this.rotation = 1;
                                break;
                            case 0b0100:
                                this.tile = 0;
                                this.rotation = 1;
                                break;
                            case 0b1101:
                                this.tile = textures_in_row * 2;
                                this.rotation = 0;
                                break;
                            default:
                                this.tile = textures_in_row * 3;
                                this.rotation = 0;
                                break;
                        }
                        break;
                    case TileType.Floor:
                        this.tile = 1;
                        this.rotation = 1;
                        break;
                }

                this.UpdateMatrix();
                break;
            }
        }

        this.events = [];
    }
    Draw() {
        Game.default_shader.LoadTransformationMatrix(this.matrix);
        Shader.LoadInt(Game.default_shader.tile_texture_location, this.tile);
        Tile.textured_square_mesh.Draw();
    }

    ToggleEvent(){
        this.events.push(TileEvents.NearbyTileChanged);
    }

    SetTileType(type, toggle_neary_tiles = false){
        this.type = type;
        this.ToggleEvent();

        if(toggle_neary_tiles == false)return;

        var left = Game.store.GetTile(this.x - 1, this.y);
        var right = Game.store.GetTile(this.x + 1, this.y);
        var down = Game.store.GetTile(this.x, this.y - 1);
        var up = Game.store.GetTile(this.x, this.y + 1);

        if(left)left.ToggleEvent();
        if(right)right.ToggleEvent();
        if(down)down.ToggleEvent();
        if(up)up.ToggleEvent();
    }
}