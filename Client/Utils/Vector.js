class Vector2 {
    x = 0;
    y = 0;

    constructor(x = 0, y = 0) {
        if (x == null || x == NaN || y == null || y == NaN) {
            this.x = 0;
            this.y = 0;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    Add(x, y) {
        this.x += x;
        this.y += y;
    }

    Multiply(x, y) {
        this.x *= x;
        this.y *= y;
    }

    Divide(x, y) {
        this.x /= x;
        this.y /= y;
    }
}
class Vector3 {
    x = 0;
    y = 0;
    z = 0;

    constructor(x = 0, y = 0, z = 0) {
        if (x == null || x == NaN || y == null || y == NaN || z == null || z == NaN) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        } else {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    Add(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
    }

    Multiply(x, y, z) {
        this.x *= x;
        this.y *= y;
        this.z *= z;
    }

    Divide(x, y, z) {
        this.x /= x;
        this.y /= y;
        this.z /= z;
    }
}
class Vector4 {
    x = 0;
    y = 0;
    z = 0;
    w = 0;

    constructor(x = 0, y = 0, z = 0, w = 0) {
        if (x == null || x == NaN || y == null || y == NaN || z == null || z == NaN) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 0;
        } else {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
    }

    Add(x, y, z, w) {
        this.x += x;
        this.y += y;
        this.z += z;
        this.w += w;
    }

    Multiply(x, y, z, w) {
        this.x *= x;
        this.y *= y;
        this.z *= z;
        this.w *= w;
    }

    Divide(x, y, z, w) {
        this.x /= x;
        this.y /= y;
        this.z /= z;
        this.w /= w;
    }
}