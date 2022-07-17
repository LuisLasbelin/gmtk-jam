import { checkObstacles } from "./utils";
var bleeper = require('pixelbox/bleeper');

class Weapon {
    /**
     * Weapon of 6 bullets constructor
     */
    constructor() {
        this.currentSlot = 0;
        this.bullets = [1,1,1,1,1,1];
        this.canShoot = true;
    }
    /**
     * Returns the current bullet array
     */
    getBullets()
    {
        return this.bullets;
    }
    loadWeapon()
    {
        bleeper.sounds[0].play();
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i] = 1;
        }
        this.canShoot = false;
        // RELOAD
        setTimeout(() => {
            this.canShoot = true;
        }, 2000);
    }
    fireWeapon(player, enemies)
    {
        // FIRE WEAPON
        console.log("Shot fired: " + this.currentSlot + " was " + this.bullets[this.currentSlot]);
        let bullet = this.bullets[this.currentSlot];
        if(bullet > 0)
        {
            bleeper.sounds[1].play();
            //FIRE
            checkObstacles(player, enemies);
            
            this.bullets[this.currentSlot] = 0;
        }
        else
        {
            bleeper.sounds[2].play();
        }

        // SELECT NEW BULLET SLOT
        this.currentSlot = Math.round(Math.random() * 5);
        console.log("New slot: " + this.currentSlot);
        console.log("Balas: " + this.getBullets());

        this.canShoot = false;
        // RELOAD
        setTimeout(() => {
            this.canShoot = true;
        }, 2000);
    }
    nextRollFrame()
    {

    }
    
}

export default Weapon;