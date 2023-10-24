class Mathf {
    static ToRadians(degrees) {
        return degrees * (Math.PI / 180.0)
    }

    static Clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
}