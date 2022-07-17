function distance(vector1, vector2)
{
    try {
        let a = vector2.x - vector1.x;
        let b = vector2.y - vector1.y;

        let c = Math.abs(Math.sqrt( a*a + b*b ));

        return c
    } catch (error) {
        console.error(error);
    }
}

function checkObstacles(player, objectives)
{
    console.log("Check obstacles for " + objectives.length);
    let raycast = {x: player.position.x, y: player.position.y};

    Array(32).fill().forEach(()=>
    {
        for (let i = 0; i < objectives.length; i++) {
            // Direction
            if(!player.flip) raycast.x += 1;
            if(player.flip) raycast.x -= 1;

            let _dist = distance(raycast, objectives[i].position);

            if(_dist < 10 && !objectives[i].dead)
            {
                // HIT!
                console.log("Enemy hit!");
                objectives[i].dead = true;
                return;
            }
        }
    });
}

export {distance, checkObstacles};