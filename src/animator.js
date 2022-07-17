class Animator {
    /**
     * 
     * @param {array} frames array of images in order
     */
    constructor(frames)
    {
        this.frames = frames
        this.currFrame = 0;
    }
    /**
     * 
     * @param {number} x position
     * @param {number} y position
     * @param {number} frameDuration in milliseconds
     */
    playAnimation(x, y, frameDuration)
    {
        sprite(this.frames[this.currFrame], x, y);
        // when it gets to the end, repeat
        this.currFrame++;
        if(this.currFrame >= this.frames.length) this.currFrame = 0;
    }
}

export default Animator;