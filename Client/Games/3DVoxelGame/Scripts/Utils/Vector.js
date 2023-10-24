class Vector2 {
    x = 0;
    y = 0;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    GetMagnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
}
class Vector3 {
    x = 0;
    y = 0;
    z = 0;

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    GetMagnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    }

    static GetMagnitudeOfVectors(vec1, vec2) {
        var vec = new Vector3(vec1.x, vec1.y, vec1.z);
        vec.x -= vec2.x;
        vec.y -= vec2.y;
        vec.z -= vec2.z;
        return vec.GetMagnitude();
    }
}
class Vector4 {
    x = 0;
    y = 0;
    z = 0;
    w = 1;

    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static MultiplyMatrixByVector(matrix, vector) {
        var vec = new Vector4();

        //vec.x = (vector.x * matrix[(4 * 0) + 0]) + (vector.y * matrix[(4 * 1) + 0]) + (vector.z * matrix[(4 * 2) + 0]) + (vector.w * matrix[(4 * 3) + 0]);
        //vec.y = (vector.x * matrix[(4 * 0) + 1]) + (vector.y * matrix[(4 * 1) + 1]) + (vector.z * matrix[(4 * 2) + 1]) + (vector.w * matrix[(4 * 3) + 1]);
        //vec.z = (vector.x * matrix[(4 * 0) + 2]) + (vector.y * matrix[(4 * 1) + 2]) + (vector.z * matrix[(4 * 2) + 2]) + (vector.w * matrix[(4 * 3) + 2]);
        //vec.w = (vector.x * matrix[(4 * 0) + 3]) + (vector.y * matrix[(4 * 1) + 3]) + (vector.z * matrix[(4 * 2) + 3]) + (vector.w * matrix[(4 * 3) + 3]);


        vec.x = (vector.x * matrix[(4 * 0) + 0]) + (vector.z * matrix[(4 * 2) + 0]) + (vector.w * matrix[(4 * 3) + 0]);
        vec.z = (vector.x * matrix[(4 * 0) + 2]) + (vector.z * matrix[(4 * 2) + 2]) + (vector.w * matrix[(4 * 3) + 2]);
        vec.w = (vector.x * matrix[(4 * 0) + 3]) + (vector.z * matrix[(4 * 2) + 3]) + (vector.w * matrix[(4 * 3) + 3]);

        //vec.x = (vector.x * matrix[(4 * 0) + 0]) + (vector.z * matrix[(4 * 0) + 2]) + (vector.w * matrix[(4 * 0) + 3]);
        //vec.z = (vector.x * matrix[(4 * 1) + 0]) + (vector.z * matrix[(4 * 1) + 2]) + (vector.w * matrix[(4 * 1) + 3]);
        //vec.w = (vector.x * matrix[(4 * 2) + 0]) + (vector.z * matrix[(4 * 2) + 2]) + (vector.w * matrix[(4 * 2) + 3]);
        /*
        vec.x = (vector.x * matrix[(4 * 0) + 0]) + (vector.y * matrix[(4 * 1) + 0]) + (vector.z * matrix[(4 * 2) + 0]) + (vector.w * matrix[(4 * 3) + 0]);
        vec.y = (vector.x * matrix[(4 * 0) + 1]) + (vector.y * matrix[(4 * 1) + 1]) + (vector.z * matrix[(4 * 2) + 1]) + (vector.w * matrix[(4 * 3) + 1]);
        vec.z = (vector.x * matrix[(4 * 0) + 2]) + (vector.y * matrix[(4 * 1) + 2]) + (vector.z * matrix[(4 * 2) + 2]) + (vector.w * matrix[(4 * 3) + 2]);
        vec.w = (vector.x * matrix[(4 * 0) + 3]) + (vector.y * matrix[(4 * 1) + 3]) + (vector.z * matrix[(4 * 2) + 3]) + (vector.w * matrix[(4 * 3) + 3]);
        
        vec.x = (vector.x * matrix[(4 * 0) + 0]) + (vector.y * matrix[(4 * 0) + 1]) + (vector.z * matrix[(4 * 0) + 2]) + (vector.w * matrix[(4 * 0) + 3]);
        vec.y = (vector.x * matrix[(4 * 1) + 0]) + (vector.y * matrix[(4 * 1) + 1]) + (vector.z * matrix[(4 * 1) + 2]) + (vector.w * matrix[(4 * 1) + 3]);
        vec.z = (vector.x * matrix[(4 * 2) + 0]) + (vector.y * matrix[(4 * 2) + 1]) + (vector.z * matrix[(4 * 2) + 2]) + (vector.w * matrix[(4 * 2) + 3]);
        vec.w = (vector.x * matrix[(4 * 3) + 0]) + (vector.y * matrix[(4 * 3) + 1]) + (vector.z * matrix[(4 * 3) + 2]) + (vector.w * matrix[(4 * 3) + 3]);
        */
        return vec;
    }

    GetMagnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));
    }
}