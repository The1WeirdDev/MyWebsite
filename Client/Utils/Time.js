class Time {
    static date;
    static last_time;
    static delta_time;
    static start_time;

    static Init() {
        Time.delta_time = 0;
        Time.last_time = Time.GetCurrentTime();
    }
    static Update() {
        Time.CalculateDeltaTime();
        Time.elapsed_time += Time.delta_time;
    }

    static GetCurrentTime(){
        var date = new Date();
        return date.getTime() / 1000.0;
    }
    
    static CalculateDeltaTime(){
        var time = Time.GetCurrentTime();
        Time.delta_time = time - Time.last_time;
        Time.last_time = time;
    }

    static GetElapsedTime() {
        let _date = new Date();
        let t = _date.getTime() / 1000.0;
        return t - Time.start_time;
    }
    static GetFps() {
        return 1.0 / Time.delta_time;
    }
}
