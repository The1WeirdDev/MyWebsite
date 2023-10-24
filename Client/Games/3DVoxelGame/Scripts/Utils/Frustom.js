class Frustom{
    static IsPointInsideViewFrustom(x, y, z, matrix){
        var p4d = new Vector4(x, y, z, 1.0);
        var clip_space_position = Vector4.MultiplyMatrixByVector(matrix, p4d);

        //&&(clip_space_position.y <= clip_space_position.w) &&(clip_space_position.y >= -clip_space_position.w)
        return ((clip_space_position.x <= clip_space_position.w) && (clip_space_position.x >= -clip_space_position.w) && (clip_space_position.z <= clip_space_position.w) && (clip_space_position.z >= -clip_space_position.w));
    }

    static IsPointXZInsideViewFrustom(x, y, z, matrix) {
        var p4d = new Vector4(x, y, z, 1.0);
        var clip_space_position = Vector4.MultiplyMatrixByVector(matrix, p4d);

        //&&(clip_space_position.y <= clip_space_position.w) &&(clip_space_position.y >= -clip_space_position.w)
        return ((clip_space_position.x <= clip_space_position.w) && (clip_space_position.x >= -clip_space_position.w) && (clip_space_position.z <= clip_space_position.w) && (clip_space_position.z >= -clip_space_position.w));
    }

    static IsChunkInsideViewFrustom(x, z, matrix) {
        var y = 0;// Game.player.position.y;
        return this.IsPointXZInsideViewFrustom(x, y, z, matrix) || this.IsPointXZInsideViewFrustom(x + Chunk.chunk_width, y, z, matrix) ||
            this.IsPointXZInsideViewFrustom(x, y, z + Chunk.chunk_width, matrix) || this.IsPointXZInsideViewFrustom(x + Chunk.chunk_width, y, z + Chunk.chunk_width, matrix);
    }
}