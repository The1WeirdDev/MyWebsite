class UI {
    static uis = [];
    static amount_of_uis = 0;
    id = 0;

    position = null;

    constructor() {
        this.id = UI.amount_of_uis;
        UI.amount_of_uis = UI.amount_of_uis + 1;

        this.position = new Vector2();
    }

    /*
    These methods will be called by the ui manager
    */
    Init() { }

    /*
    This function will check if the object is being pressed/clicked/hovered ect
    */
    Update() { }
    Draw() { }

    CleanUp() { }
}