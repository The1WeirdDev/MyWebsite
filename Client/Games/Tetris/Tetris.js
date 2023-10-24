//Snake
const canvas = document.getElementById("GameCanvas");
const context = canvas.getContext("2d");
const score_id = document.getElementById("Points");
const high_score_id = document.getElementById("HighPoints");

var current_score = 0;
var high_score = 0;

function IncreaseScore(points) {
    current_score += points;

    if (current_score > high_score)
        high_score = current_score;

    score_id.innerText = `Score : ${current_score}`;
    high_score_id.innerText = `High Score : ${high_score}`;
}
class Piece {
    constructor(name, color, block_data) {
        this.name = name;
        this.color = color;
        this.piece_data = block_data;
        this.rotation = 0;
        this.max_rotation = block_data.length / 8;
    }

    Rotate(dir) {
        //TODO dont rotate if rotatead piece is inside of block
        this.last_rotation = this.rotation;

        this.rotation += dir;
        if (this.rotation < 0)
            this.rotation = this.max_rotation - 1;
        else if (this.rotation >= this.max_rotation)
            this.rotation = 0;

        if (this.rotation == this.last_rotation)
            return;

        for (var i = 0; i < 8; i += 2) {
            var rot_index = this.rotation * 8;
            var x = this.piece_data[rot_index + i];
            var y = this.piece_data[rot_index + i + 1];
            var global_x = x + game.position.x;
            var global_y = y + game.position.y;

            if (game.GetBlock(global_x, global_y) != 0) {
                this.rotation = this.last_rotation;
                return;
            }
        }
    }

    GetBlockData() {
        var block_data = [];
        var rotation = this.rotation * 8;
        block_data = this.piece_data.slice(rotation, rotation + 8);
        return block_data;
    }
}
class Game {
    constructor() {
        this.border_size_x = 15;
        this.border_size_y = 28;
        this.block_size = 25;

        this.pieces = [
            new Piece("square", this.GetBlockIdFromColor("yellow"), [0, 0, 1, 0, 0, 1, 1, 1])
            , new Piece("Line", this.GetBlockIdFromColor("cyan"),
                [-1, 1, 0, 1, 1, 1, 2, 1,
                    1, 0, 1, 1, 1, 2, 1, 3,
                ]
            )
            , new Piece("t_piece", this.GetBlockIdFromColor("purple"), [
                0, 0, -1, 1, 0, 1, 1, 1,
                0, 0, 0, 1, 0, 2, 1, 1,
                -1, 1, 0, 1, 1, 1, 0, 2,
                0, 0, 0, 1, 0, 2, -1, 1

            ])
            , new Piece("r_z", this.GetBlockIdFromColor("green"), [
                0, 0, 1, 0, -1, 1, 0, 1,
                0, 0, 0, 1, 1, 1, 1, 2,
                0, 1, 1, 1, -1, 2, 0, 2,
                -1, 0, -1, 1, 0, 1, 0, 2
            ])
            , new Piece("z", this.GetBlockIdFromColor("red"), [
                -1, 0, 0, 0, 0, 1, 1, 1,
                1, 0, 0, 1, 1, 1, 0, 2,
                -1, 1, 0, 1, 0, 2, 1, 2,
                0, 0, 0, 1, -1, 1, -1, 2
            ])
            , new Piece("l_l", this.GetBlockIdFromColor("blue"), [
                -1, 0, -1, 1, 0, 1, 1, 1,
                0, 0, 1, 0, 0, 1, 0, 2,
                -1, 1, 0, 1, 1, 1, 1, 2,
                0, 0, 0, 1, 0, 2, -1, 2
            ])
            , new Piece("l", this.GetBlockIdFromColor("orange"), [
                -1, 1, 0, 1, 1, 0, 1, 1,
                0, 0, 0, 1, 0, 2, 1, 2,
                -1, 1, -1, 2, 0, 1, 1, 1,
                -1, 0, 0, 0, 0, 1, 0, 2
            ])
        ];
        this.block_data = new Array(this.border_size_y * this.border_size_y);
        this.movement_direction = { x: 0 };
        this.target_frame_rate = 10;
        this.should_place_block = false;
        this.should_stop = false;

        this.ClearBlockData();
        this.ResetCurrentPiece();

        this.tick = 0;
        this.ticks_till_place_block = 5;

        canvas.width = this.border_size_x * this.block_size;
        canvas.height = this.border_size_y * this.block_size;
        canvas.style.top = "100px";
        canvas.style.position = "absolute";
    }

    ClearBlockData() {
        for (var i = 0; i < this.border_size_y * this.border_size_y; i++)
            this.block_data[i] = 0;
    }

    ResetCurrentPiece() {
        this.position = { x: Math.floor(this.border_size_x / 2), y: 0 };
        var index = Math.floor(Math.random() * (this.pieces.length - 1));
        var copy_piece = this.pieces[index];
        this.current_piece = new Piece("piece", copy_piece.color,
            copy_piece.piece_data,
        );
    }

    PlaceBlock() {
        while (this.should_stop == false) {
            this.MoveCurrentPiece(0, 1);
        }
    }
    MoveCurrentPiece(move_x, move_y) {
        var can_move = true;

        for (var i = 0; i < 8; i += 2) {
            var piece_data = this.current_piece.GetBlockData();
            var x = piece_data[i];
            var y = piece_data[i + 1];
            var global_x = x + this.position.x + move_x;
            var global_y = y + this.position.y + move_y;

            var block_id = this.GetBlock(global_x, global_y);

            //Horizontal Movement
            if ((global_x < 0 || global_x >= this.border_size_x)) {
                return;
            }

            if (global_y < 0 || global_y >= this.border_size_y) {
                if (global_y <= 2) {
                    this.should_stop = true;
                    this.ClearBlockData();
                }
                else {
                    this.should_stop = true;
                    this.tick++;
                    if (this.tick >= this.ticks_till_place_block)
                        this.PlaceCurrentPieceIntoBlockData();
                }
                return;
            }

            if (block_id != 0) {
                if (move_y != 0) {
                    if (global_y <= 1) {
                        this.should_stop = true;
                        this.ClearBlockData();
                    }
                    else {
                        this.should_stop = true;
                        this.tick++;
                        if (this.tick >= this.ticks_till_place_block)
                            this.PlaceCurrentPieceIntoBlockData();
                        return;
                    }
                } else if (move_x != 0) {
                    return;
                }
            }
        }

        if (can_move) {
            this.position.x += move_x;
            this.position.y += move_y;
        }
    }

    PlaceCurrentPieceIntoBlockData() {
        for (var i = 0; i < 8; i += 2) {
            var piece_data = this.current_piece.GetBlockData();
            var x = piece_data[i];
            var y = piece_data[i + 1];
            var global_x = x + this.position.x;
            var global_y = y + this.position.y;

            this.SetBlock(global_x, global_y, this.current_piece.color);
        }

        for (var y = this.border_size_y - 1; y >= 0; y--) {
            var should_clear_line = true;

            for (var x = 0; x < this.border_size_x; x++) {
                var id = this.GetBlock(x, y);

                if (id == 0)
                    should_clear_line = false;
            }

            if (should_clear_line) {
                IncreaseScore(10);
                for (var _y = y; _y >= 0; _y--) {

                    for (var _x = 0; _x < this.border_size_x; _x++) {
                        if (_y - 1 < 0)
                            this.SetBlock(_x, _y, 0);
                        else
                            this.SetBlock(_x, _y, this.GetBlock(_x, _y - 1));
                    }
                }
                y++;
            }
        }

        this.ResetCurrentPiece();
    }

    GetBlock(x, y) {
        if (x < 0 || y < 0 || x >= this.border_size_x || y >= this.border_size_y) {
            return 1;
        }

        return this.block_data[(y * this.border_size_y) + x];
    }

    SetBlock(x, y, id) {
        if (!(x < 0 || y < 0 || x >= this.border_size_x || y >= this.border_size_y)) {
            this.block_data[(y * this.border_size_y) + x] = id;
        }
    }

    Update() {
        this.should_stop = false;
        this.MoveCurrentPiece(this.movement_direction.x, 0);
        this.MoveCurrentPiece(0, 1);

        if (this.should_place_block) {
            this.PlaceBlock();
        }

        this.should_place_block = false;
    }

    GetColorFromBlockId(id) {
        switch (id) {
            case 0:
                return "black";
            case 1:
                return "green";
            case 2:
                return "red";
            case 3:
                return "yellow";
            case 4:
                return "cyan";
            case 5:
                return "blue";
            case 6:
                return "purple";
            case 7:
                return "orange";
            default:
                return "black";
        }
    }

    GetBlockIdFromColor(color) {
        if (color == "black")
            return 0;
        else if (color == "green")
            return 1;
        else if (color == "red")
            return 2;
        else if (color == "yellow")
            return 3;
        else if (color == "cyan")
            return 4;
        else if (color == "blue")
            return 5;
        else if (color == "purple")
            return 6;
        else if (color == "orange")
            return 7;
        else
            return 0;
    }

    Draw() {
        for (var x = 0; x < this.border_size_x; x++) {
            for (var y = 0; y < this.border_size_y; y++) {
                DrawRect(this.GetColorFromBlockId(this.GetBlock(x, y)), x * this.block_size, y * this.block_size, this.block_size, this.block_size);
            }
        }

        var color = this.GetColorFromBlockId(this.current_piece.color);
        for (var i = 0; i < 8; i += 2) {
            var piece_data = this.current_piece.GetBlockData();
            var x = piece_data[i];
            var y = piece_data[i + 1];
            DrawRect(color, (x + this.position.x) * this.block_size, (y + this.position.y) * this.block_size, this.block_size, this.block_size);
        }
    }
}

var game = new Game();

function Init() {
    document.addEventListener("keydown", function(event) {
        var key_code = event.keyCode;

        switch (key_code) {
            case 65:
                game.movement_direction.x = -1;
                break;
            case 68:
                game.movement_direction.x = 1;
                break;
            case 69:
                game.current_piece.Rotate(-1);
                break;
            case 82:
                game.current_piece.Rotate(1);
                break;
            case 32:
                game.should_place_block = true;
                break;
        }
    });
    document.addEventListener("keyup", function(event) {
        var key_code = event.keyCode;

        if (key_code == 65 && game.movement_direction.x == -1) {
            game.movement_direction.x = 0;
        } else if (key_code == 68 && game.movement_direction.x == 1) {
            game.movement_direction.x = 0;
        }
    });
    document.getElementById("GameName").innerText = "Tetris";
    setInterval(Update, 1000 / game.target_frame_rate);
}
function Update() {
    canvas.style.position = 'absolute';
    canvas.style.left = `${(innerWidth - canvas.width) / 2}px`;
    game.Update();
    Draw();
}
function Draw() {
    game.Draw();
}
function DrawRect(color, x, y, width, height) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

Init();