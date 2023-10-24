class LocalPlayer extends Player {
    mesh = null;
    speed = 15;
    player_width = 0.8;
    jump_height = 2.5;
    gravity = -30.81;

    is_grounded = false;

    Init() {
        var perlin_val = perlin.get((0.01) / (Game.world.chunk_size * 0.5), 0.01);
        var height = Math.floor(perlin_val * 10) + 10;
        this.position.x = 0;
        this.position.y = height;
        this.mesh = new Mesh();
        this.mesh.CreateMesh([0, 0, 0, 1, 1, 0, 1, 1], [0, 1, 2, 2, 1, 3]);

        this.movement_dir_x = 0;
        this.velocity = 0;
    }

    CleanUp() {
        this.mesh.CleanUp();
    }

    GetBlock(x, y) {
        return Game.world.GetBlock(x, y);
    }
    Update() {
        var plr_x = this.position.x;
        var plr_y = this.position.y;
        var block_x = Math.floor(plr_x);
        var block_y = Math.floor(plr_y);

        var bottom = (plr_y - Math.floor(plr_y));
        var top = (Math.floor(plr_y) + 1 - plr_y);

        this.is_grounded = false;
        if (this.GetBlock(plr_x, plr_y - 0.05) == 0 && this.GetBlock(plr_x + this.player_width, plr_y - 0.05) == 0) {
            this.velocity += this.gravity * Time.delta_time;
        } else {
            this.is_grounded = true;
        }

        //Getting the block closest to the floor
        var floor_block = 0;
        for (var y = block_y; y >= 0; y--) {
            if (this.GetBlock(block_x, y) != 0) {
                floor_block = y + 1;
                break;
            }
        }
        var distance_to_ground = plr_y - floor_block;
        var movement_velocity = Mathf.Clamp(this.velocity * Time.delta_time, -distance_to_ground, 0.75);

        if (this.GetBlock(plr_x, plr_y + movement_velocity) != 0 || this.GetBlock(plr_x + this.player_width, plr_y + movement_velocity) != 0) {
            this.is_grounded = true;
        }

        if (this.is_grounded) {
            this.velocity = 0;
            if (Input.keys[32] == 2) {
                this.velocity = Math.sqrt(-2.0 * this.gravity * this.jump_height);
            }
            movement_velocity = this.velocity * Time.delta_time;
        }

        this.position.y += movement_velocity;

        this.movement_dir_x = 0;
        if (Input.keys[65] > 0)
            this.movement_dir_x -= 1;
        if (Input.keys[68] > 0)
            this.movement_dir_x += 1;

        if (this.movement_dir_x != 0) {
            var movement_amount = Mathf.Clamp(this.movement_dir_x * this.speed * Time.delta_time, -4.5, 4.5);

            //Gets closest blocks distance to player
            var distance = 5;
            if (this.movement_dir_x < 0) {
                for (var x = block_x; x >= block_x - 5; x--) {
                    if (this.GetBlock(x, plr_y + 0.1) != 0) {
                        distance = (plr_x - x) - 1;
                        break;
                    }
                }
            } else {
                var side_plr_x = plr_x + 0.8;
                for (var x = Math.floor(side_plr_x); x <= block_x + 5; x++) {
                    if (this.GetBlock(x, plr_y) != 0) {
                        distance = (x - side_plr_x) - 0.05;
                        break;
                    }
                }
            }

            //Limits movement amount so player cant walk into the blocks
            movement_amount = Mathf.Clamp(movement_amount, -distance, distance);
            if (this.GetBlock(plr_x + movement_amount, plr_y + 0.05) == 0) {
                this.position.x += movement_amount;
            }
        }

        this.CheckChunks();
    }

    DoWhenGrounded() {
        if (Input.keys[32] == 2) {
            this.velocity += Math.sqrt(-2 * this.gravity * this.jump_height);
        }

        var plr_x = this.position.x;
        var plr_y = this.position.y;

        var bottom = (plr_y - Math.floor(plr_y));
        var top = (Math.floor(plr_y) + 1 - plr_y);

        var movement_velocity = Mathf.Clamp(this.velocity * Time.delta_time, -bottom, bottom);
        if (this.GetBlock(plr_x, plr_y - 0.05 + movement_velocity) != 0) {
            this.velocity = 0;
        }
    }

    CheckChunks() {
        var plr_x = this.position.x;
        var plr_y = this.position.y;
        //Creating chunks if they arent there
        var chunk_x = Math.floor(plr_x / Game.world.chunk_size);
        var chunk_y = Math.floor(plr_y / Game.world.chunk_size);

        for (var x = chunk_x - 3; x < chunk_x + 3; x++) {
            for (var y = chunk_y - 3; y < chunk_y + 3; y++) {
                var chunk = Game.world.GetChunk(x, y);
                if (chunk == null) {
                    Game.world.CreateChunk(x, y);
                }
            }
        }
    }
    Draw() {
        Game.shader.Start();
        Game.shader.LoadMatrix4(Game.shader.view_matrix_location, this.GetViewMatrix());
        Game.shader.LoadMatrix4(Game.shader.transformation_matrix_location, this.GetTransformationMatrix());

        this.mesh.Draw();
    }

    GetTransformationMatrix() {
        var matrix = mat4.create();
        mat4.translate(matrix, matrix, [this.position.x, this.position.y, 0]);
        mat4.scale(matrix, matrix, [this.player_width, 1, 1]);
        return matrix;
    }

    GetViewMatrix() {
        var matrix = mat4.create();
        mat4.translate(matrix, matrix, [-this.position.x, -this.position.y, 0]);
        return matrix;
    }
} 