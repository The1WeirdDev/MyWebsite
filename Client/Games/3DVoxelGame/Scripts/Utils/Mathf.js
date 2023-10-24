class Mathf {
    static ToRadians(degrees) {
        return degrees * (Math.PI / 180.0);
    }

    static Clamp(value, min, max) {
        if (value < min)
            return min;
        else if (value > max)
            return max;
        return value;
        //return Math.max(min, Math.min(value, max));
    }
}