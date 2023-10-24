class UIManager {
    static Init() {
        var frame = new Frame();
    }
    static Update() {

    }
    static Draw() {
        for (var i = 0; i < UI.uis.length; i++) {
            var ui = UI.uis[i];
            ui.Draw();
        }
    }
    static CleanUp() {

    }
}