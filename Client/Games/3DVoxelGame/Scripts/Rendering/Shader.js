class Shader {
    program_id = null;
    vertex_shader_id = null;
    fragment_shader_id = null;

    Create(vertex_data, fragment_data) {
        this.vertex_shader_id = this.CreateShader(gl.VERTEX_SHADER, vertex_data);
        this.fragment_shader_id = this.CreateShader(gl.FRAGMENT_SHADER, fragment_data);
        this.program_id = gl.createProgram();

        gl.attachShader(this.program_id, this.vertex_shader_id);
        gl.attachShader(this.program_id, this.fragment_shader_id);

        gl.linkProgram(this.program_id);
        gl.validateProgram(this.program_id);

        gl.detachShader(this.program_id, this.vertex_shader_id);
        gl.detachShader(this.program_id, this.fragment_shader_id);
    }

    CreateShader(type, data) {
        var shader = gl.createShader(type);

        gl.shaderSource(shader, data);
        gl.compileShader(shader);

        var message = gl.getShaderInfoLog(shader);
        if (message.length > 0) {
            throw new Error(`Could not compile ${(type == gl.VERTEX_SHADER ? 'vertex' : 'fragment')} shader because of ${message}`);
        }
        return shader;
    }

    Start() {
        gl.useProgram(this.program_id);
    }

    Stop() {
        gl.useProgram(null);
    }

    BindAttribute(attribute, name) {
        gl.bindAttribLocation(this.program_id, attribute, name);
    }

    GetUniformLocation(name) {
        return gl.getUniformLocation(this.program_id, name);
    }

    LoadMatrix4x4(location, value) {
        gl.uniformMatrix4fv(location, false, value);
    }
}