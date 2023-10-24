class Game {
    static shader = null;
    static skybox_shader = null;

    static world = null;

    static local_player = null;

    static vertex_shader_data_default = `
        precision mediump float;
        attribute vec2 position;
        attribute vec2 texture_coord;
        varying vec2 _texture_coord;
        
        uniform mat4 projection_matrix;
        uniform mat4 view_matrix;
        uniform mat4 transformation_matrix;

        void main() {
            //_texture_coord = vec2(texture_coord.x * 0.999, texture_coord.y * 0.999);
            _texture_coord = texture_coord;
            //gl_Position = projectionMatrix * viewMatrix * transformationMatrix * vec4(position, 0, 1);
            gl_Position = projection_matrix * view_matrix * transformation_matrix * vec4(position, 0, 1);
        }
    `;

    static vertex_shader_skybox_default = `
        precision mediump float;
        attribute vec2 position;
        attribute vec2 texture_coord;
        varying vec2 _texture_coord;

        void main(){
            _texture_coord = texture_coord;
            gl_Position = vec4(position, 0, 1);
        }
    `;

    static fragment_shader_data_default = `
        precision mediump float;
        varying vec2 _texture_coord;
        uniform sampler2D textureID;
        void main() {
            //gl_FragColor = vec4(1, 0, 0, 1.0);
            //gl_FragColor = texture2D(textureID, _texture_coord);
            gl_FragColor = texture2D(textureID, _texture_coord);
        }
    `;

    static Init() {
        Networking.ConnectToServer();
        Game.shader = new Shader(Game.vertex_shader_data_default, Game.fragment_shader_data_default);
        Game.shader.projection_matrix_location = Game.shader.GetUniformLocation("projection_matrix");
        Game.shader.view_matrix_location = Game.shader.GetUniformLocation("view_matrix");
        Game.shader.transformation_matrix_location = Game.shader.GetUniformLocation("transformation_matrix");

        Game.skybox_shader = new Shader()
        var inverse_aspect_ratio = canvas.height / canvas.width;
        var viewport_size = 35;

        Game.shader.Start();

        var matrix = mat4.create();
        mat4.ortho(matrix, -viewport_size, viewport_size, -viewport_size * inverse_aspect_ratio, viewport_size * inverse_aspect_ratio, 0, 1);
        Game.shader.LoadMatrix4(Game.shader.projection_matrix_location, matrix);
        Game.shader.LoadMatrix4(Game.shader.transformation_matrix_location, mat4.create());
        Game.shader.Stop();

        Display.Init();
        Time.Init();

        Game.world = new World();
        Game.world.Init();

        Game.local_player = new LocalPlayer();
        Game.local_player.Init();

        Input.Init();

        document.addEventListener("keydown", function(event) {
            Input.OnKeyPress(event);
        });
        document.addEventListener("keyup", function(event) {
            Input.OnKeyUp(event);
        });
        gl.canvas.addEventListener("mousedown", (e) => {
            console.log(e);
        });

        gl.canvas.addEventListener("mouseup", (e) => {
            console.log(e);
        });
        gl.canvas.addEventListener("mousemove", (e) => {
            Input.OnMouseMoveEvent(e);
        });

    }
    static CleanUp() {
        Game.local_player.CleanUp();
        Game.world.CleanUp();
        game.shader.CleanUp();
    }
    static Update() {
        Time.Update();
        Input.Update();
        Game.world.Update();
        Game.local_player.Update();
    }
    static Draw() {
        Display.Update();

        Game.world.Draw();
        Game.local_player.Draw();
    }
}