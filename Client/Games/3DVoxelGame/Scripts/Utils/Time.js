class Time {
    static date = null;
    static current_time = 0;
    static last_time = 0;
    static delta_time = 0;

    static Init() {
        let d = new Date();
        Time.date = d;
        Time.current_time = d.getTime() / 1000.0;
        Time.last_time = d.getTime() / 1000.0;
        Time.delta_time = 0;
    }

    static Update() {
        let d = new Date();
        Time.date = d;
        Time.current_time = d.getTime() / 1000.0;
        Time.delta_time = Time.current_time - Time.last_time;
        Time.last_time = Time.current_time;
    }
}