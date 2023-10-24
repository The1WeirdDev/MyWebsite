class NonLocalPlayer extends Entity {
    user_id = null;
    position = null;

    player_mesh = null;
    transformation_matrix = null;

    constructor(user_id) {
        super();
        this.user_id = user_id;
        this.position = new Vector3();

        this.player_mesh = new PlayerMesh();

        this.player_mesh.CreateMesh([
            0, 0, 0,
            1, 0, 0,
            0, 1, 0,
            1, 1, 0,

            0, 0, 1,
            0, 1, 1,
            1, 0, 1,
            1, 1, 1,

            1, 1, 0,
            1, 1, 1,
            0, 1, 0,
            0, 1, 1,

            0, 0, 0,
            0, 0, 1,
            1, 0, 0,
            1, 0, 1,

            0, 0, 0,
            0, 1, 0,
            0, 0, 1,
            0, 1, 1,

            1, 0, 1,
            1, 1, 1,
            1, 0, 0,
            1, 1, 0,

        ], [0, 1, 2, 2, 1, 3,
            4, 5, 6, 6, 5, 7,
            8, 9, 10, 10, 9, 11,
            12, 13, 14, 14, 13, 15,
            16, 17, 18, 18, 17, 19,
            20, 21, 22, 22, 21, 23
        ]);
        this.SetPosition(0, 20, 0);
    }

    Update() { }
    Draw() {
        Game.non_local_player_shader.LoadTransformationMatrix(this.transformation_matrix);
        this.player_mesh.Draw();
    }
    SetPosition(x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

        this.transformation_matrix = mat4.create();
        mat4.translate(this.transformation_matrix, this.transformation_matrix, [this.position.x, this.position.y, this.position.z]);
    }

    GetTransformationMatrix() {
        return this.transformation_matrix;
    }
}