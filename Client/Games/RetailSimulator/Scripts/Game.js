class Game {
    static default_shader = null;
    static store = null;

    static Init() {
        Game.default_shader = new DefaultShader();
        Game.mesh = new NonTexturedMesh();
        Game.mesh.CreateMesh([0, 0, 0, 1, 1, 0, 1, 1], [0, 1, 2, 2, 1, 3]);

        Game.camera_size = 15;

        Game.aspect_ratio = canvas.width / canvas.height;
        Game.CreateProjectionMatrix();

        Game.camera = new Camera(0, 0);
        Game.store = new Store("Store1");

        Game.store.Init();

        Game.camera.x = Game.store.map_width / 2;
        Game.camera.y = Game.store.map_height / 2;
        
        Mouse.Init();
        Time.Init();
    }

    static CreateProjectionMatrix() {
        Game.projection_matrix = mat4.create();
        Game.projection_matrix = mat4.ortho(Game.projection_matrix, -Game.camera_size * Game.aspect_ratio, Game.camera_size * Game.aspect_ratio, -Game.camera_size, Game.camera_size, -1, 1);
    }

    static Update() {
        Time.Update();
        Mouse.Update();
        Game.camera.Update();
        Game.store.Update();
    }

    static Draw() {
        Game.default_shader.Start();
        Game.default_shader.LoadProjectionMatrix(Game.projection_matrix);
        Game.default_shader.LoadViewMatrix(Game.camera.view_matrix);
        Game.mesh.Draw();
        Game.store.Draw();
    }
}