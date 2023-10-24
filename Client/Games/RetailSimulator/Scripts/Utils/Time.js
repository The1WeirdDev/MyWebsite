class Time{
    static date = null;
    
    static current_time = 0;
    static last_time = 0;
    static delta_time = 0;
    
    static Init(){
        Time.date = new Date();
        Time.current_time = Time.date.getTime() / 1000.0;
        Time.last_time = Time.current_time;
        Time.delta_time = 0;
    }
    
    static Update(){
        Time.date = new Date();
        Time.current_time = Time.date.getTime() / 1000.0;
        Time.CalculateDeltaTime();
    }
    
    static CalculateDeltaTime(){
        Time.delta_time = Time.current_time - Time.last_time;
        Time.last_time = Time.current_time;
    }
    
    static GetElapsedTime(){
        return Time.current_time;
    }
}