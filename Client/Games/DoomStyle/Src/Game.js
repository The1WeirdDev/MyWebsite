class Game {
    static map = [
        1, 1, 1, 1, 1, 1, 1,1,1,1, 1,
        1, 1, 1, 0, 0, 0, 0,0,1,0, 1,
        1, 0, 0, 0, 0, 0, 0,0,0,0, 1,
        1, 0, 0, 0, 0, 0, 0,0,0,0, 1,
        1, 0, 0, 0, 0, 0, 0,0,0,0, 1,
        1, 0, 0, 0, 0, 0, 0,0,0,0, 1,
        1, 0, 1, 0, 0, 0, 0,0,1,0, 1,
        1, 0, 0, 0, 0, 0, 0,0,0,0, 1,
        1, 0, 0, 0, 0, 0, 0,0,0,0, 1,
        1, 1, 1, 1, 1, 1, 1,1,1,1, 1,
    ];
    static map_width = 11;
    static map_height = 10;
    static dir = 0;
    static position = {x: 4, y: 4};
    static keys = null;

    static fov = (Math.PI / 180) * 60;
    
    static OnMouseMove(e){
        Game.dir += movement_x * 0.5;
    }

    static Init() {
        Game.keys = new Array(400);
        Game.keys.fill(0, 0, Game.keys.length);

        
        window.addEventListener("mousemove", (e) => {
            const {
                movementX,
                movementY
            } = e;
            movement_x = movementX;
            movement_y = movementY;
            Game.OnMouseMove(e);
        });

        window.addEventListener("keydown", (e) =>{
            if(e.repeat)return;

            Game.keys[e.keyCode] = 1;
        });
        
        window.addEventListener("keyup", (e) =>{
            if(e.repeat)return;

            Game.keys[e.keyCode] = 0;
        });
    }
    static Update() {

    }
    static Draw() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        DrawRect(0, 0, canvas.width, canvas.height, "black");
        
        var horizontal = Game.keys[68] - (Game.keys[65] * 2);
        var vertical = Game.keys[87] - (Game.keys[83] * 2);
        
        Game.position.x += Math.sin((Game.dir + 90)* (Math.PI / 180)) * horizontal * 0.01;
        Game.position.y += Math.cos((Game.dir + 90)* (Math.PI / 180)) * horizontal * 0.01;
        Game.position.x += Math.sin(Game.dir * (Math.PI / 180)) * vertical * 0.01;
        Game.position.y += Math.cos(Game.dir * (Math.PI / 180)) * vertical * 0.01;
        
        var screen_size_x = innerWidth;//Math.floor(innerWidth * 0.8);
        var ss = innerWidth / screen_size_x;
        var angle = Game.dir * (Math.PI / 180);

        for (var x = 0; x < screen_size_x; x++) {
            var floor = 0;
            var size = 0;
            var hitwall = false;
            var s = 0;
            var depth = 0;
            
            var ray_angle = (angle - Game.fov / 2) + (x / screen_size_x) * Game.fov;

            var sin_angle = Math.sin(ray_angle);
            var cos_angle = Math.cos(ray_angle);
            
            while (hitwall == false && s < 20) {
                s += 0.05;
                //console.log((Math.sin(ray_angle) * s) + " " + (Math.cos(ray_angle) * s))
                var _x = Math.floor(Game.position.x + (sin_angle * s));
                var _y = Math.floor(Game.position.y + (cos_angle * s));
                //console.log(_x + " " + _y);

                if (Game.GetBlock(_x, _y) == 1) {
                    depth = s * Math.cos((Game.dir * (Math.PI / 180)) - ray_angle);
                    size = Math.floor((innerHeight / depth));
                    floor = Math.floor((innerHeight - size) / 2);
                    hitwall = true;
                }
            }
            var col = Math.max(110, 255 - depth * 15);
            DrawRect(x * ss, 0, ss, floor, `rgb(100, 100, 100)`);
            DrawRect(x * ss, floor, ss, size, `rgb(${col}, ${col}, ${col})`);
            DrawRect(x * ss, floor + size, ss, (innerHeight - (floor + size)), `rgb(100, 100, 100)`);
        }

    }
    
    static GetBlock(x, y) {
        if (x < 0 || y < 0 || x >= Game.map_width || y >= Game.map_height){
            //console.log(`Out of bounds ${x} ${y}`);
            return 0;
        }
        return Game.map[(y * Game.map_width) + x];
    }
}