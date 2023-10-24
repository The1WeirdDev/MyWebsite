class ChunkShader extends Shader {
    constructor() {
        super();
        var vertex_data = `
        precision mediump float; \n
        attribute vec3 position; attribute vec2 texture_coord;
        varying vec2 _texture_coord;\n uniform mat4 projection_matrix;
        uniform mat4 view_matrix; uniform mat4 transformation_matrix;
        void main(){
            _texture_coord = vec2(texture_coord.x / 16.0, texture_coord.y / 16.0);
            gl_Position = projection_matrix * view_matrix * transformation_matrix * vec4(position, 1.0);
        } `;
        //var vertex_data = `precision mediump float; \nattribute vec3 position; attribute vec2 texture_coord;varying vec2 _texture_coord;\n uniform mat4 projection_matrix; uniform mat4 view_matrix; void main(){ _texture_coord = texture_coord;gl_Position = projection_matrix * view_matrix * vec4(position, 1.0); } `;
        var fragment_data = `precision mediump float; varying vec2 _texture_coord; uniform sampler2D texture_id;\nvoid main(){ gl_FragColor = texture2D(texture_id, _texture_coord); }`;
        this.Create(vertex_data, fragment_data);

        this.view_matrix_location = this.GetUniformLocation("view_matrix");
        this.projection_matrix_location = this.GetUniformLocation("projection_matrix");
        this.transformation_matrix_location = this.GetUniformLocation("transformation_matrix");

        this.BindAttribute(0, "position");
        this.BindAttribute(1, "texture_coord");
    }
    LoadProjectionMatrix(matrix) {
        this.LoadMatrix4x4(this.projection_matrix_location, matrix);
    }
    LoadViewMatrix(matrix) {
        this.LoadMatrix4x4(this.view_matrix_location, matrix);
    }
    LoadTransformationMatrix(matrix) {
        this.LoadMatrix4x4(this.transformation_matrix_location, matrix);
    }

    PreDraw() {
        //This function Starts the shader program and loads the uniforms

        /*
        We do not load the projection matrix during this phase
        It is only changed rarely like when the game is started and when the window is resized
        */
        this.Start();
        //this.LoadProjectionMatrix(Game.projection_matrix);
        this.LoadViewMatrix(Game.player.GetViewMatrix());
    }
}