//Snake

const canvas = document.getElementById("GameCanvas");
const context = canvas.getContext("2d");
const score_id = document.getElementById("Points");
const high_score_id = document.getElementById("HighPoints");

var current_score = 0;
var high_score = 0;

function SetScore() {
    if (snake.tail_length > high_score) {
        high_score = snake.tail_length;
    }
    score_id.innerText = `Score : ${snake.tail_length}`;
    high_score_id.innerText = `High Score : ${high_score}`;
}
class Game {
    constructor() {
        this.world_size = 25;
        this.snake_size = 20;
        this.snake_color = "green";
        this.apple_color = "red";

        canvas.width = this.world_size * this.snake_size;
        canvas.height = this.world_size * this.snake_size;
    }
}
class Snake {
    constructor() {
        this.tail_length = 0;
        this.tail_data = [];
        this.x = 0;
        this.y = 0;
        this.world_size = 20;
        this.apple_increment = 3;

        this.direction = { x: 0, y: 0 };
    }

    OnKeyDown(e) {
        let key_code = e.keyCode;

        if ((key_code == 65 || key_code == 37) && this.direction.x <= 0)
            this.direction = { x: -1, y: 0 };
        if ((key_code == 68 || key_code == 39) && this.direction.x >= 0)
            this.direction = { x: 1, y: 0 };
        if ((key_code == 87 || key_code == 38) && this.direction.y <= 0)
            this.direction = { x: 0, y: -1 };
        if ((key_code == 83 || key_code == 40) && this.direction.y >= 0)
            this.direction = { x: 0, y: 1 };
    }
    OnKeyUp(e) { }

    Update() {
        this.tail_data.push({ x: this.x, y: this.y });

        this.x += this.direction.x;
        this.y += this.direction.y;

        if (this.x < 0 || this.x >= game.world_size || this.y < 0 || this.y >= game.world_size) {
            this.Kill();
        }

        for (var i = 0; i < snake.tail_data.length; i++) {
            var tail_data = snake.tail_data[i];
            if (this.x == tail_data.x && this.y == tail_data.y)
                this.Kill();
        }
        while (this.tail_data.length > this.tail_length) {
            this.tail_data.shift();
        }

        if (this.x == apple.x && this.y == apple.y) {
            this.EatApple();
        }
    }

    Draw() {
        DrawRect(game.snake_color, this.x * game.snake_size, this.y * game.snake_size, game.snake_size, game.snake_size);

        for (var i = 0; i < this.tail_data.length; i++) {
            var tail_data = this.tail_data[i];
            DrawRect(game.snake_color, tail_data.x * game.snake_size, tail_data.y * game.snake_size, game.snake_size, game.snake_size);

        }
    }

    Kill() {
        this.direction = { x: 0, y: 0 };
        this.x = Math.floor(game.world_size / 2);
        this.y = Math.floor(game.world_size / 2);
        this.tail_length = 0;
        this.tail_data = [];
        SetScore();
    }

    EatApple() {
        this.tail_length += this.apple_increment;
        SetScore();
        apple.ChangeToRandomPosition();
    }
}

class Apple {
    constructor() {
        this.x = 5;
        this.y = 5;
    }

    ChangeToRandomPosition() {
        //Change to random position that the snake isnt already at
        var data = new Array(game.world_size * game.world_size);
        data.fill(0, 0, game.world_size * game.world_size);

        //Setting Positions
        for (var _x = 0; _x < game.world_size; _x++) {
            for (var _y = 0; _y < game.world_size; _y++) {
                data[(_x * game.world_size) + _y] = { x: _x, y: _y };
            }
        }

        //Removing parts that the snake is in
        for (var i = 0; i < snake.tail_data.length; i++) {
            var tail_data = snake.tail_data[i];
            var index = data.indexOf({ x: tail_data.x, y: tail_data.y });
            if (index >= 0)
                data.splice(index);
        }
        var index = data.indexOf({ x: snake.x, y: snake.y });
        if (index >= 0)
            data.splice(index);

        //Setting apple position
        var pos = data[Math.floor(Math.random() * data.length)];
        this.x = pos.x;
        this.y = pos.y;
    }

    Draw() {
        DrawRect(game.apple_color, this.x * game.snake_size, this.y * game.snake_size, game.snake_size, game.snake_size);
    }
}

var game = new Game();
var snake = new Snake();
var apple = new Apple();

function Init() {
    document.addEventListener("keydown", function(event) {
        snake.OnKeyDown(event);
    });
    document.addEventListener("keyup", function(event) {
        snake.OnKeyUp(event);
    });
    setInterval(Update, 1000 / 14);
}
function Update() {
    canvas.style.position = 'absolute';
    canvas.style.top = `${80}px`;
    canvas.style.left = `${(innerWidth - canvas.width) / 2}px`;
    snake.Update();
    Draw();
}
function Draw() {
    DrawRect("black", 0, 0, canvas.width, canvas.height);
    apple.Draw();
    snake.Draw();
}
function DrawRect(color, x, y, width, height) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

Init();