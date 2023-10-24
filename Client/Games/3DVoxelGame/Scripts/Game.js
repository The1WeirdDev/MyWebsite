class Game {
    static player = null;
    static chunk_shader = null;
    static non_local_player_shader = null;
    static world = null;

    static projection_matrix = null;

    static Init() {
        Display.Init();
        Keyboard.Init();
        Mouse.Init();

        Game.chunk_shader = new ChunkShader();
        Game.non_local_player_shader = new NonLocalPlayerShader();

        Game.world = new ServerWorld();
        Game.world.Init();

        Game.player = new LocalPlayer();
        Game.player.Init();

        canvas.width = innerWidth;
        canvas.height = innerHeight - 59;
        gl.viewport(0, 0, canvas.width, canvas.height);

        Game.projection_matrix = mat4.create();

        Game.AddEventListeners();
        Game.CreateAndLoadProjectionMatrix();

        if (Game.world.world_type == WorldType.Server) {
            Networking.Init();
        }
        UIManager.Init();
        Time.Init();
    }

    static Update() {
        Display.Update();
        Keyboard.Update();
        Mouse.Update();
        Time.Update();
        UIManager.Update();

        Game.world.Update();
        Game.player.Update();
    }

    static Draw() {
        Game.chunk_shader.PreDraw();
        Game.world.Draw();

        if (Game.world.world_type == WorldType.Server) {
            Game.non_local_player_shader.PreDraw();
            Networking.Draw();
        }

        Game.player.Draw();
        //Frustom.IsPointInsideViewFrustom(0, 0, 0, Game.player.view_matrix);
    }

    static CreateAndLoadProjectionMatrix() {
        Game.projection_matrix = mat4.perspective(Game.projection_matrix, Mathf.ToRadians(80), Display.GetAspectRatio(), 0.001, 1000);

        Game.non_local_player_shader.Start();
        Game.non_local_player_shader.LoadProjectionMatrix(Game.projection_matrix);

        Game.chunk_shader.Start();
        Game.chunk_shader.LoadProjectionMatrix(Game.projection_matrix);

        Game.world.CreateFrustomMatrix();
        //Game.chunk_shader.Stop();

        //Game.non_local_player_shader.Start();
        //Game.non_local_player_shader.LoadProjectionMatrix(matrix2);
        //Game.non_local_player_shader.Stop();
    }

    static AddEventListeners() {
        window.addEventListener("resize", function() {
            canvas.width = innerWidth;
            canvas.height = innerHeight - 59;
            gl.viewport(0, 0, canvas.width, canvas.height);

            Game.CreateAndLoadProjectionMatrix();
        });

        window.addEventListener("keydown", function(e) {
            if (e.repeat)
                return;
            Keyboard.OnKeyPress(e);
        });
        window.addEventListener("keyup", function(e) {
            if (e.repeat)
                return;
            Keyboard.OnKeyUp(e);
        });
        window.addEventListener("mousedown", (e) => {
            Mouse.OnMouseDown(e);
        });
        window.addEventListener("mouseup", (e) => {
            Mouse.OnMouseUp(e);
        });
        window.addEventListener("mousemove", (e) => {
            const {
                movementX,
                movementY
            } = e;
            movement_x = movementX;
            movement_y = movementY;
            Mouse.OnMouseMove(e);
        });


        canvas.oncontextmenu = function(e) {
            e.preventDefault();
        };
    }
}