class Animator {
    /**
     * 
     * @param {array} frames array of images in order
     * @param {number} frameDuration number of fps between animations
     */
    constructor(frames, frameDuration)
    {
        this.frames = frames;
        this.frameDuration = frameDuration;
        this.currFrame = 0;
        this.time = 0;
    }
    /**
     * Play next frame
     * @param {number} x position
     * @param {number} y position
     * @param {number} frameDuration in milliseconds
     */
    playAnimation(x, y)
    {
        this.time++;
        sprite(this.frames[this.currFrame], x, y);
        if(this.time >= this.frameDuration)
        {
            // when it gets to the end, repeat
            this.time = 0;
            this.currFrame++;
            if(this.currFrame >= this.frames.length) this.currFrame = 0;
        }
    }
    playAllAnimations(map)
    {
        this.time++;
        var tiles = map.find(this.frames[this.currFrame])
        if(this.time >= this.frameDuration)
        {
            // when it gets to the end, repeat
            this.time = 0;
            this.currFrame++;
            if(this.currFrame >= this.frames.length) this.currFrame = 0;
        }
        tiles.forEach(tile => {
            map.remove(tile.x, tile.y)
            map.set(tile.x, tile.y, this.frames[this.currFrame], false, false, false);
        });
    }
}

export default Animator;