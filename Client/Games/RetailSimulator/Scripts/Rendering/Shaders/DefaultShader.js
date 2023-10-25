class DefaultShader extends Shader {
    //Will be renamed to Tile Shader

    constructor() {
        super();

        var vertex_data = `#version 300 es
        precision mediump float;
        
        uniform mat4 projection_matrix;
        uniform mat4 view_matrix;
        uniform mat4 transformation_matrix;
        uniform int tile_texture;
        
        in vec2 position;
        in vec2 texture_coord;
        out vec2 _texture_coord;
        
        void main(){
            _texture_coord = vec2(texture_coord.x + (float(tile_texture % 32) * 0.03125) + (0.0125 / 1024.0), texture_coord.y + (floor(float(tile_texture) / 32.0) * 0.03125) + (0.0125 / 1024.0));
            gl_Position = projection_matrix * view_matrix * transformation_matrix * vec4(position, 0, 1.0);
        } `;
        var fragment_data = `#version 300 es
        precision mediump float; 
        uniform sampler2D texture_id;
        
        in vec2 _texture_coord; 
        out vec4 frag_color;
        
        void main(){ 
            frag_color = texture(texture_id, _texture_coord)
            ;/*gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);*/
        }`;
        this.Create(vertex_data, fragment_data);

        this.projection_matrix_location = this.GetUniformLocation("projection_matrix");
        this.view_matrix_location = this.GetUniformLocation("view_matrix");
        this.transformation_matrix_location = this.GetUniformLocation("transformation_matrix");
        this.tile_texture_location = this.GetUniformLocation("tile_texture");
        
        this.BindAttribute(0, "position");
        this.BindAttribute(1, "texture_coord");
    }
    LoadProjectionMatrix(matrix) {
        Shader.LoadMatrix4x4(this.projection_matrix_location, matrix);
    }
    LoadViewMatrix(matrix) {
        Shader.LoadMatrix4x4(this.view_matrix_location, matrix);
    }
    LoadTransformationMatrix(matrix) {
        Shader.LoadMatrix4x4(this.transformation_matrix_location, matrix);
    }

    PreDraw() {
        //This function Starts the shader program and loads the uniforms

        /*
        We do not load the projection matrix during this phase
        It is only changed rarely like when the game is started and when the window is resized
        */
        this.Start();
        //this.LoadProjectionMatrix(Game.projection_matrix);
        //this.LoadViewMatrix(Game.player.GetViewMatrix());
    }
}