class Store {
    constructor(name) {
        this.name = name;
    }

    Init(){
        this.map_width = 100;
        this.map_height = 100;
        this.map = new Array(this.map_width * this.map_height);

        this.texture_id = Texture.LoadTexture(gl, "/Client/Games/RetailSimulator/Res/TextureAtlas.png");

        Tile.CreateMeshes();

        this.last_tick_time = 0;
        this.current_tick = 0;
        this.tick_rate = 0.05; // 20 Times a second

        this.blank_tile = new Tile(0, 0, TileType.None, 0, 0);

        for(var x = 0; x < this.map_width; x++){
            for(var y = 0; y < this.map_height; y++){
                this.map[(y * this.map_width) + x] = new Tile(x, y, TileType.None, 2, 0);
            }
        }

        for(var x = 0;x < 10; x++){
            for(var y = 0;y < 10; y++){
                if(x == 0 || y == 0 || x == 9 || y == 9)
                this.map[(y * this.map_width) + x].SetTileType(TileType.Wall);
            }
        }

        for(var x = 1;x < 9; x++){
            for(var y = 1;y < 9; y++){
                this.map[(y * this.map_width) + x].SetTileType(TileType.Floor);
            }
        }
    }

    GetTile(x, y, empty_if_out_of_bounds = false){
        if(x < 0 || y < 0 || x >= this.map_width || y >= this.map_height){
            if(empty_if_out_of_bounds)
                return this.blank_tile;
            return null;
        }
        return this.map[(y * this.map_width) + x];
    }
    
    Update(){
        if(Time.GetElapsedTime() - this.last_tick_time >= this.tick_rate){
            this.last_tick_time = Time.GetElapsedTime();

            this.Tick();
        }
    }
    Tick(){
        this.current_tick++;

        for(var i = 0; i < this.map.length; i++){
            this.map[i].Update();
        }
    }
    Draw(){
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture_id);
        for(var i = 0; i < this.map.length; i++){
            this.map[i].Draw();
        }
    }
}