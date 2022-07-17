import Weapon from './weapon'
import Animator from './animator'

var map = getMap('map');

var gun = new Weapon();

var fps = 0;

var mapPosition = {}

var camera = {}

var landTiles = []

var ceilingTiles = []

var player = {}

const berryAnim = new Animator([165, 166])

function initialState()
{
    console.log('INITIAL STATE');

    player = {
        onAir: true,
        speed: 1,
        position: {
            x: 10,
            y: 0
        },
        sprite: 153,
        jumping: false
    };
    
    camera = {
        cameraLimit: {
            x: 80,
            nx: 20,
            y: null
        }
    }

    landTiles = [91, 16, 17, 18, 42, 13, 12, 29, 45];
    ceilingTiles = [91, 16, 17, 18, 42, 13, 12];

    mapPosition = {
        x: 0,
        y: 0
    }

    gun = new Weapon();
}

initialState();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () 
{
    let state = gamepad;
    cls();

    // if button press move player
	if (state.btn.left > 0 && !checkLeft()) move(-1);
    if (state.btn.right > 0 && !checkRight()) move(1);
    if (state.btnp.up && !player.onAir && !checkCeiling()) jump();
    if (state.btnp.A) gun.fireWeapon();
    if (state.btnp.B) initialState();

    if(player.jumping && state.btn.up > 0 && !checkCeiling())
    {
        player.position.y -= 1;
    }
    else
    {
        player.jumping = false;
        checkGround();
        gravity();
    }

    // move camera
    let screenX = mapPosition.x + player.position.x;
    if(screenX > camera.cameraLimit.x)
    {
        mapPosition.x -= 1;
    }
    if(screenX < camera.cameraLimit.nx)
    {
        mapPosition.x += 1;
    }

    // When rendering, render first the background and last the UI
    // draw background
    draw(map, mapPosition.x, mapPosition.y);
    // draw player
    drawPlayer();

    berryAnim.playAnimation(60, 60, 167);

    fps++;
};

function move(direction)
{
    // move right
    if(direction > 0)
    {
        player.position.x += player.speed;
    }
    // move left
    if(direction < 0)
    {
        player.position.x -= player.speed;
    }
}

function jump()
{
    if(!player.onAir)
    {
        player.jumping = true;
        setTimeout(() => {
            player.jumping = false;
        }, 500);
    }
}

function drawPlayer()
{
    sprite(player.sprite, mapPosition.x + player.position.x, mapPosition.y + player.position.y)
}

function gravity()
{
    // get tile position of the player y+1
    let x = Math.round(player.position.x/8);
    let y = Math.round((player.position.y+4)/8);
    // checks if there is a ground tile here, stop falling
    if(!player.onAir){
        // it stands on the next tile
        player.position.y = y*8-8;
    }
    if(player.onAir)
    {
        player.position.y += 1;
    }
}

function checkGround()
{
    // get tile position of the player y+1
    let x = Math.round(player.position.x/8);
    let y = Math.round((player.position.y+4)/8);
    //console.log("X: " + x + ", Y: " + y);

    if(map.get(x, y) != null)
    {
        if(landTiles.includes(map.get(x,y).sprite))
        {
            player.onAir = false;
            return true;
        }
    }

    player.onAir = true;
    return false;
}

function checkCeiling()
{
    // get tile position of the player y+1
    let x = Math.round(player.position.x/8);
    let y = Math.round((player.position.y-8)/8);
    //console.log("X: " + x + ", Y: " + y);

    if(map.get(x, y) != null)
    {
        if(ceilingTiles.includes(map.get(x,y).sprite))
        {
            return true;
        }
    }
    return false;
}

function checkRight()
{
    // get tile position of the player y+1
    let x = Math.round((player.position.x+4)/8);
    let y = Math.round(player.position.y/8);
    //console.log("X: " + x + ", Y: " + y);

    if(map.get(x, y) != null)
    {
        if(landTiles.includes(map.get(x,y).sprite))
        {
            return true;
        }
    }
    return false;
}

function checkLeft()
{
    // get tile position of the player y+1
    let x = Math.round((player.position.x-4)/8);
    let y = Math.round(player.position.y/8);
    //console.log("X: " + x + ", Y: " + y);

    if(map.get(x, y) != null)
    {
        if(landTiles.includes(map.get(x,y).sprite))
        {
            return true;
        }
    }
    return false;
}

// DEBUG
/*
setInterval(() => 
{
    console.log('FPS: ' + fps);
    fps = 0;
}, 1000)
*/