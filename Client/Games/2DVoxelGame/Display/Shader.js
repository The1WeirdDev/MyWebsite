class Shader {
    constructor(vertex_shader_data, fragment_shader_data) {
        this.CreateShader(vertex_shader_data, fragment_shader_data)
    }
    CreateShader(vertex_shader_data, fragment_shader_data) {
        this.vertex_shader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this.vertex_shader, vertex_shader_data);
        gl.compileShader(this.vertex_shader);

        var message = gl.getShaderInfoLog(this.vertex_shader);
        if (message.length > 0) {
            throw new Error(`Could not compile vertex shader ${message}`);
        }

        this.fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.fragment_shader, fragment_shader_data);
        gl.compileShader(this.fragment_shader);

        var message = gl.getShaderInfoLog(this.fragment_shader);
        if (message.length > 0) {
            throw new Error(`Could not compile fragment shader ${message}`);
        }

        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertex_shader);
        gl.attachShader(this.program, this.fragment_shader);
        gl.linkProgram(this.program);
        gl.validateProgram(this.program);

        gl.detachShader(this.program, this.vertex_shader);
        gl.detachShader(this.program, this.fragment_shader);
    }
    GetUniformLocation(name) {
        return gl.getUniformLocation(this.program, name);
    }
    BindAttribute(index, location) {
        gl.bindAttribLocation(this.program, index, location);
    }

    LoadMatrix4(location, matrix) {
        gl.uniformMatrix4fv(location, false, matrix);
    }

    Start() {
        gl.useProgram(this.program);
    }

    Stop() {
        gl.useProgram(null);
    }

    CleanUp() {
        //Unbinding Program
        gl.useProgram(null);

        //Deleting Shaders And Programs
        gl.deleteShader(this.vertex_shader);
        gl.deleteShader(this.fragment_shader);
        gl.deleteProgram(this.program)
    }
}