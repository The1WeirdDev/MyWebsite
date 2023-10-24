class Mathf{
    static Clamp(val, min, max){
        return Math.max(Math.min(val, max), min);
    }

    static ToRadians(degrees){
        return degrees * (Math.PI / 180.0);
    }
}