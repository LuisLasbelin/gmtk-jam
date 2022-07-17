import Weapon from './weapon'
import Animator from './animator'
import settings from './gameSettings'

var map = getMap(settings.startlevel);

var gun = new Weapon();

var fps = 0;

var mapPosition = {}

var camera = {}

var landTiles = []

var ceilingTiles = []

var player = {}

var bananas = 0;

var bananaLocation = [{x:28,y:32}, {x:70,y:130}]

const berryAnim = new Animator([165, 166], 20)

function initialState()
{
    console.log('INITIAL STATE');

    bananas = 0;

    map = getMap(settings.startlevel);

    player = {
        onAir: true,
        speed: 1,
        position: {
            x: 50,
            y: 5
        },
        sprite: 153,
        jumping: false,
        jumptime: 350,
        flip: false
    };
    
    camera = {
        cameraLimit: {
            x: 80,
            nx: 20,
            y: null
        }
    }

    landTiles = settings.landTiles;
    ceilingTiles = settings.ceilingTiles;

    mapPosition = {
        x: 0,
        y: 0
    }

    gun = new Weapon();
}

initialState();

var gameRunning = false;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () 
{
    if(!gameRunning)
    {
        gameLoop;
        gameRunning = true;
    }
};

const gameLoop = setInterval(() => {
    let state = gamepad;
    cls();

    // if button press move player
	if (state.btn.left > 0 && !checkLeft()){
        move(-1);
        player.flip = true;
    } 
    if (state.btn.right > 0 && !checkRight()){
        move(1)
        player.flip = false;
    };
    if (state.btn.up > 0 && !player.onAir && !player.jumping && !checkCeiling()) jump();
    if (state.btn.A > 0 && gun.canShoot) gun.fireWeapon();
    if (state.btn.B > 0 && settings.devMode) initialState();

    if(player.jumping && state.btn.up > 0 && !checkCeiling())
    {
        player.position.y -= 1;
        player.onAir = true;
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
    drawPlayer(player.flip);

    checkBanana();

    berryAnim.playAllAnimations(map);
    pen(11);
    print("Banana: " + bananas, [50,50]);

    fps++;
}, 16);

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
    console.log("Boing!");
    player.jumping = true;
    setTimeout(() => {
        player.jumping = false;
    }, player.jumptime);
}

function drawPlayer(flip)
{
    sprite(player.sprite, mapPosition.x + player.position.x, mapPosition.y + player.position.y, flip)
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

function checkBanana()
{
    // get tile position of the player y+1
    let x = Math.round(player.position.x/8);
    let y = Math.round(player.position.y/8);
    //console.log("X: " + x + ", Y: " + y);

    if(map.get(x, y) != null)
    {
        if(settings.bananaSprites.includes(map.get(x,y).sprite))
        {
            map.remove(x,y);
            bananas++;
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