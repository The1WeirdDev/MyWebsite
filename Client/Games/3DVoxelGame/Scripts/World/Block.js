class Block {
    is_renderable = true;
    name = "";
    is_breakable = true;

    top_texture = 0;
    bottom_texture = 0;
    left_texture = 0;
    right_texture = 0;
    front_texture = 0;
    back_texture = 0;

    constructor(name, is_renderable, is_breakable, top_texture, bottom_texture, left_texture, right_texture, front_texture, back_texture) {
        this.name = name;
        this.is_renderable = is_renderable;
        this.is_breakable = is_breakable;

        //Textures
        this.top_texture = top_texture;
        this.bottom_texture = bottom_texture;
        this.left_texture = left_texture;
        this.right_texture = right_texture;
        this.front_texture = front_texture;
        this.back_texture = back_texture;
    }
}