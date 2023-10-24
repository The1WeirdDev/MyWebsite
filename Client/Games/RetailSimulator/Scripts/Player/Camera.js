class Camera{
    constructor(x, y){
        this.x = x;
        this.y = y;

        this.view_matrix = mat4.create();
    }

    Update(){
        if(Mouse.IsButtonDown(2)){
            this.x -= Mouse.delta_x * 0.05;
            this.y -= Mouse.delta_y * 0.05;
        }
        this.view_matrix = mat4.create();
        mat4.translate(this.view_matrix, this.view_matrix, [-this.x, -this.y, 0]);
        
        if(Mouse.IsButtonPressed(0)){
            var x = Math.floor(this.x + (Mouse.normalized_x * Game.camera_size * Display.GetAspectRatio()));
            var y = Math.floor(this.y + (Mouse.normalized_y * Game.camera_size));
            
            var tile = Game.store.GetTile(x, y);
            if(tile){
                tile.tile = 1;
            }
        }
    }
}