class NonLocalPlayerShader extends Shader {
    constructor() {
        super();
        var vertex_data = `precision mediump float; \nattribute vec3 position; \n uniform mat4 projection_matrix; uniform mat4 view_matrix; uniform mat4 transformation_matrix; void main(){ gl_Position = projection_matrix * view_matrix * transformation_matrix * vec4(position, 1.0); } `;
        var fragment_data = `precision mediump float; \nvoid main(){ gl_FragColor = vec4(0.1, 0.5, 0.8, 1.0); }`;
        this.Create(vertex_data, fragment_data);

        this.view_matrix_location = this.GetUniformLocation("view_matrix");
        this.projection_matrix_location = this.GetUniformLocation("projection_matrix");
        this.transformation_matrix_location = this.GetUniformLocation("transformation_matrix");

        this.BindAttribute(0, "position");
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