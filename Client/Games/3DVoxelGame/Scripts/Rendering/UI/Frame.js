class Frame extends UI {
    size = null;

    mesh = null;
    constructor() {
        super();

        this.size = new Vector2(1, 1);
        this.mesh = new UIFrameMesh();
        this.mesh.CreateMesh([0, 0, 0, 1, 1, 0, 1, 1], [0, 1, 2, 2, 1, 3]);
    }

    Update() {

    }

    Draw() {
        this.mesh.Draw();
    }

    CleanUp() {
        this.mesh.CleanUp();
    }
}