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
        this.bullets.forEach(bullet => {
            if(bullet == 0)
            {
                bullet = 1;
            }
        });
    }
    fireWeapon()
    {
        // FIRE WEAPON
        console.log("Shot fired: " + this.currentSlot + " was " + this.bullets[this.currentSlot]);
        let bullet = this.bullets[this.currentSlot];
        if(bullet > 0)
        {
            //FIRE
            
            this.bullets[this.currentSlot] = 0;
        }

        // SELECT NEW BULLET SLOT
        this.currentSlot = Math.round(Math.random() * 5);
        console.log("New slot: " + this.currentSlot);
        console.log("Balas: " + this.getBullets());

        this.canShoot = false;
        // RELOAD
    }
}

export default Weapon;