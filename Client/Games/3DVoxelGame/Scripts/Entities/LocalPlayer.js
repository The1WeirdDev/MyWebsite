class LocalPlayer extends Entity {
    movement_direction;
    velocity = 0;
    gravity = -20.81;

    speed = 4.5;
    running_speed_multiplier = 1.3;
    movement_multiplier = 1.0;

    is_grounded = false;

    blocks_in_inventory = [1, 2, 3, 5, 6, 7];
    block_index = 0;

    GetBlock() {
        return this.blocks_in_inventory[this.block_index];
    }

    NextBlock() {
        this.block_index++;
        if (this.block_index >= this.blocks_in_inventory.length) {
            this.block_index = 0;
        }
    }

    PreviousBlock() {
        this.block_index--;
        if (this.block_index < 0) {
            this.block_index = this.blocks_in_inventory.length - 1;
        }
    }

    Init() {
        this.movement_direction = new Vector2();
        this.position.y = Chunk.chunk_height;

        canvas.addEventListener("click", async () => {
            await canvas.requestPointerLock({
                unadjustedMovement: true,
            });

            document.addEventListener("pointerlockchange", (e) => {
                cursor_locked = document.pointerLockElement != null;
            }, false);
        });
        document.body.style.cursor = 'none';
        /*
        view_matrix_frustom is just the view matrix without pitch rotation
        */

    }
    Update() {
        //If player isnt in chunk or the chunk doesnt have block data then we shouldn't check
        //for movement
        var chunk_x = Math.floor(this.position.x / Chunk.chunk_width);
        var chunk_z = Math.floor(this.position.z / Chunk.chunk_width);
        var chunk = Game.world.GetChunk(chunk_x, chunk_z);

        if (chunk) {
            if (chunk.generated_block_data) {
                this.CheckForMovement();
            }
        }

        this.CalculateMatrices();

        if (Keyboard.IsKeyPressed(69)) {
            this.NextBlock();
        }
        if (Keyboard.IsKeyPressed(82)) {
            this.PreviousBlock();
        }

        if (Game.world.world_type == WorldType.Server)
            Networking.SendPacket("SetPosition", [this.position.x, this.position.y, this.position.z]);
    }
    PlaceOrDestroyBlock(destroy, ben) {
        var id = this.blocks_in_inventory[this.block_index];
        var reach = 0;
        var max_reach = 8;
        var increment = 0.15;

        var yaw = Mathf.ToRadians(this.rotation.y);
        var pitch = Mathf.ToRadians(this.rotation.x);

        var last_pos_x = this.position.x;
        var last_pos_y = this.position.y;
        var last_pos_z = this.position.z;

        while (reach <= max_reach) {
            //Getting position
            var pos_x = this.position.x + ((Math.cos(pitch) * Math.sin(yaw)) * reach);
            var pos_y = this.position.y + 1 - (Math.sin(pitch) * reach);
            var pos_z = this.position.z - ((Math.cos(pitch) * Math.cos(yaw)) * reach);

            //Checking if block is there
            var block_id = Game.world.GetBlock(pos_x, pos_y, pos_z);
            var block = Game.world.GetBlockFromId(block_id);

            if (block.is_renderable && pos_y >= 1) {
                if (destroy) {
                    if (block.is_breakable == false)
                        return;

                    if (Game.world.world_type == WorldType.Client)
                        Game.world.SetBlock(pos_x, pos_y, pos_z, id);
                    else if (Networking.is_connected) {
                        var chunk_x = Math.floor(pos_x / Chunk.chunk_width);
                        var chunk_z = Math.floor(pos_z / Chunk.chunk_width);
                        var chunk = Game.world.GetChunk(chunk_x, chunk_z);
                        if (chunk) {
                            if (chunk.created)
                                Networking.SendPacket("SetBlock", [pos_x, pos_y, pos_z, 0]);
                        }
                    }
                    break;
                } else {
                    //We floor the blocks test position and the players to make sure it isnt placing blocks inside itself
                    var floored_last_x = Math.floor(last_pos_x);
                    var floored_last_y = Math.floor(last_pos_y);
                    var floored_last_z = Math.floor(last_pos_z);
                    if (!(floored_last_x == Math.floor(this.position.x) && floored_last_z == Math.floor(this.position.z) && (floored_last_y == Math.floor(this.position.y) || floored_last_y == Math.floor(this.position.y + 1)))) {
                        if (Game.world.world_type == WorldType.Client)
                            Game.world.SetBlock(last_pos_x, last_pos_y, last_pos_z, id);
                        else if (Networking.is_connected) {
                            var chunk_x = Math.floor(pos_x / Chunk.chunk_width);
                            var chunk_z = Math.floor(pos_z / Chunk.chunk_width);
                            var chunk = Game.world.GetChunk(chunk_x, chunk_z);
                            if (chunk) {
                                if (chunk.created)
                                    Networking.SendPacket("SetBlock", [last_pos_x, last_pos_y, last_pos_z, id]);
                            }
                        }
                        break;
                    }
                }
            }

            last_pos_x = pos_x;
            last_pos_y = pos_y;
            last_pos_z = pos_z;
            reach += increment;
        }
    }
    CheckForMovement() {
        var width = 0.15;
        var y_check = 0.3;
        var height = 0.6;

        this.movement_direction.x = 0;
        this.movement_direction.y = 0;

        this.movement_multiplier = 1.0;

        if (Keyboard.IsKeyDown(16)) {
            this.movement_multiplier = this.running_speed_multiplier;
        }

        var movement_amount = this.speed * this.movement_multiplier * Time.delta_time;

        if (Keyboard.IsKeyDown(83)) {
            this.movement_direction.x -= Math.sin(Mathf.ToRadians(this.rotation.y)) * movement_amount;
            this.movement_direction.y += Math.cos(Mathf.ToRadians(this.rotation.y)) * movement_amount;
        }
        if (Keyboard.IsKeyDown(87)) {
            this.movement_direction.x += Math.sin(Mathf.ToRadians(this.rotation.y)) * movement_amount;
            this.movement_direction.y -= Math.cos(Mathf.ToRadians(this.rotation.y)) * movement_amount;
        }
        if (Keyboard.IsKeyDown(65)) {
            this.movement_direction.x += Math.sin(Mathf.ToRadians(this.rotation.y - 90)) * movement_amount;
            this.movement_direction.y -= Math.cos(Mathf.ToRadians(this.rotation.y - 90)) * movement_amount;
        }

        if (Keyboard.IsKeyDown(68)) {
            this.movement_direction.x += Math.sin(Mathf.ToRadians(this.rotation.y + 90)) * movement_amount;
            this.movement_direction.y -= Math.cos(Mathf.ToRadians(this.rotation.y + 90)) * movement_amount;

        }
        this.velocity += this.gravity * Time.delta_time;

        var floored_x = Math.floor(this.position.x);
        var floored_y = Math.floor(this.position.y);
        var floored_z = Math.floor(this.position.z);

        if (this.movement_direction.GetMagnitude() > 0) {
            var closest_left = -1;
            var closest_right = 1;
            var closest_forwards = 1;
            var closest_backwards = -1;
            var min_1 = -1;
            var min_2 = -2;
            var max_1 = 1;
            var max_2 = 1;

            //Left Right
            if (this.movement_direction.x > 0) {
                for (var x = floored_x; x < floored_x + 5; x++) {
                    if (Game.world.GetBlock(x, this.position.y - y_check, this.position.z)) {
                        closest_right = x - this.position.x - this.movement_direction.x - width;
                        max_1 = closest_right;
                        break;
                    }
                }
                for (var x = floored_x; x < floored_x + 5; x++) {
                    if (Game.world.GetBlock(x, this.position.y - y_check + 1, this.position.z)) {
                        closest_right = x - this.position.x - this.movement_direction.x - width;
                        max_2 = closest_right;
                        break;
                    }
                }
                var amount = Math.min(max_1, max_2);
                if ((amount > 0))
                    this.position.x += Mathf.Clamp(this.movement_direction.x, 0, amount);
            }
            else if (this.movement_direction.x < 0) {
                for (var x = floored_x; x > floored_x - 5; x--) {
                    if (Game.world.GetBlock(x, this.position.y - y_check, this.position.z)) {
                        closest_left = x - this.position.x - this.movement_direction.x + 1 + width;
                        min_1 = closest_left;
                        break;
                    }
                }
                for (var x = floored_x; x > floored_x - 5; x--) {
                    if (Game.world.GetBlock(x, this.position.y - y_check + 1, this.position.z)) {
                        closest_left = x - this.position.x - this.movement_direction.x + 1 + width;
                        min_2 = closest_left;
                        break;
                    }
                }
                var amount = Math.max(min_1, min_2);
                if ((amount < 0))
                    this.position.x += Mathf.Clamp(this.movement_direction.x, amount, 0);
            }

            //Forwards backwards
            if (this.movement_direction.y > 0) {
                for (var z = floored_z; z < floored_z + 5; z++) {
                    if (Game.world.GetBlock(this.position.x, this.position.y, z)) {
                        closest_forwards = z - this.position.z - this.movement_direction.y - width;
                        max_1 = closest_forwards;
                        break;
                    }
                }
                for (var z = floored_z; z < floored_z + 5; z++) {
                    if (Game.world.GetBlock(this.position.x, this.position.y + 1, z)) {
                        closest_forwards = z - this.position.z - this.movement_direction.y - width;
                        max_2 = closest_forwards;
                        break;
                    }
                }
                var amount = Math.min(max_1, max_2);
                if ((amount > 0))
                    this.position.z += Mathf.Clamp(this.movement_direction.y, 0, amount);
            }
            else if (this.movement_direction.y < 0) {
                for (var z = floored_z; z > floored_z - 5; z--) {
                    if (Game.world.GetBlock(this.position.x, this.position.y, z)) {
                        closest_backwards = z - this.position.z - this.movement_direction.y + 1 + width;
                        min_1 = closest_backwards;
                        break;
                    }
                }
                for (var z = floored_z; z > floored_z - 5; z--) {
                    if (Game.world.GetBlock(this.position.x, this.position.y + 1, z)) {
                        closest_backwards = z - this.position.z - this.movement_direction.y + 1 + width;
                        min_2 = closest_backwards;
                        break;
                    }
                }
                var amount = Math.max(min_1, min_2);
                if ((amount < 0))
                    this.position.z += Mathf.Clamp(this.movement_direction.y, amount, 0);
            }
        }
        var closest_up = 1;
        var closest_down = -1;
        var movement_velocity = this.velocity * Time.delta_time;
        if (this.velocity > 0) {
            for (var y = floored_y; y < floored_y + 5; y++) {
                if (Game.world.GetBlock(this.position.x, y, this.position.z)) {
                    closest_up = y - this.position.y - movement_velocity - 0.1 - 1;
                    break;
                }
            }
        } else {
            for (var y = floored_y; y > floored_y - 5; y--) {
                if (Game.world.GetBlock(this.position.x, y, this.position.z)) {
                    closest_down = y - movement_velocity - this.position.y + 1 + height;
                    break;
                }
            }
        }
        this.is_grounded = false;
        if (closest_down > 0) {
            if (Keyboard.IsKeyDown(32)) {
                this.Jump();
                movement_velocity = this.velocity * Time.delta_time;
            } else {
                this.is_grounded = true;
                this.velocity = 0;
                movement_velocity = 0;
            }
        }
        if (this.velocity < 0 && closest_down < 0)
            this.position.y += Mathf.Clamp(movement_velocity, closest_down, 0);
        else if (this.velocity > 0 && closest_up > 0)
            this.position.y += Mathf.Clamp(movement_velocity, 0, closest_up);
        else {
            this.is_grounded = true;
            this.velocity = 0;
        }
    }

    Jump() {
        this.velocity = Math.sqrt(2.0 * -2.0 * this.gravity);
    }
    Draw() {
    }

    GetMouseInput() {
        if (document.hasFocus == false)
            return;

        this.rotation.y += movement_x * 0.05;
        this.rotation.x += movement_y * 0.05;

        if (this.rotation.y < 360)
            this.rotation.y += 360;
        if (this.rotation.y >= 360)
            this.rotation.y -= 360;

        this.rotation.x = Mathf.Clamp(this.rotation.x, -90, 90);
    }

    CalculateMatrices() {
        this.view_matrix = mat4.create();
        this.view_matrix_frustom = mat4.create();

        var yaw = Mathf.ToRadians(this.rotation.y);
        var pitch = Mathf.ToRadians(this.rotation.x);

        //TODO : Learn more about project and clip matrices to not have frustom culling be so bad
        var offset_x = (-Math.sin(yaw) * 100);
        var offset_z = (Math.cos(yaw) * 100);
        //console.log(this.position.x + " " + offset_x);
        mat4.rotate(this.view_matrix, this.view_matrix, Mathf.ToRadians(this.rotation.x), [1, 0, 0]);
        //mat4.rotate(this.view_matrix_frustom, this.view_matrix_frustom, Mathf.ToRadians(this.rotation.x), [1, 0, 0]);

        mat4.rotate(this.view_matrix, this.view_matrix, Mathf.ToRadians(this.rotation.y), [0, 1, 0]);
        mat4.rotate(this.view_matrix_frustom, this.view_matrix_frustom, Mathf.ToRadians(this.rotation.y), [0, 1, 0]);

        mat4.translate(this.view_matrix, this.view_matrix, [-this.position.x, -this.position.y - 1, -this.position.z]);
        mat4.translate(this.view_matrix_frustom, this.view_matrix_frustom, [-(this.position.x + offset_x), 0, -(this.position.z + offset_z)]);
        //this.view_matrix = matrix;

        //Game.chunk_shader.Start();
        //Game.chunk_shader.LoadTransformationMatrix(matrix);
        //Game.chunk_shader.LoadViewMatrix(this.view_matrix);
        //Game.chunk_shader.Stop();

        //shader.Start();
        //Game.chunk_shader.LoadTransformationMatrix(matrix);
        //shader.LoadMatrix4x4(shader.view_matrix_location, matrix);
        //shader.Stop();

        //Game.non_local_player_shader.Start();
        //Game.non_local_player_shader.LoadTransformationMatrix(matrix);
        //Game.non_local_player_shader.Stop();
    }

    GetViewMatrix() {
        return this.view_matrix;
    }
}