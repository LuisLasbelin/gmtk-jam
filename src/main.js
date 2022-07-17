import Weapon from './weapon'
import Animator from './animator'
import settings from './gameSettings'
var bleeper = require('pixelbox/bleeper');
var pointerEvents = require("pixelbox/pointerEvents");

pointerEvents.onPress(function (x, y, pointerID, event) {
    console.log("X: " + x + ", Y: " + y);
});

var map = getMap(settings.startlevel);

var gun = new Weapon();

var fps = 0;

var mapPosition = {}

var camera = {}

var landTiles = []

var ceilingTiles = []

var player = {}

var bananas = 0;

var enemies = [];

var uiRevolver = {
    revolver1: null,
    revolver2: null,
    bala: null,
    indicator: null,
    balasPos: [
        [{
            x: 3,
            y: 108
        }],
        [{
            x: 8,
            y: 101
        }],
        [{
            x: 16,
            y: 101
        }],
        [{
            x: 21,
            y: 108
        }],
        [{
            x: 16,
            y: 115
        }],
        [{
            x: 8,
            y: 115
        }]
    ]
}

const berryAnim = new Animator([64, 65, 66, 67, 68, 69], 20, true)
var revolverAnim = {};

function initialState()
{
    console.log('INITIAL STATE');

    bananas = 0;

    map = getMap(settings.startlevel);

    enemies = [
        {
            position: {
                x: 170,
                y: 60
            },
            dead: false,
            sprite: 48,
            onAir: true
        },
        {
            position: {
                x: 280,
                y: 70
            },
            dead: false,
            sprite: 48,
            onAir: true
        }
        ,
        {
            position: {
                x: 290,
                y: 70
            },
            dead: false,
            sprite: 48,
            onAir: true
        },
        {
            position: {
                x: 310,
                y: 70
            },
            dead: false,
            sprite: 48,
            onAir: true
        }
    ]

    player = {
        onAir: true,
        speed: 1,
        position: {
            x: 50,
            y: 5
        },
        sprite: 19,
        jumping: false,
        jumptime: 500,
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

    uiRevolver.revolver1 = assets.sprites.revolver_1;
    uiRevolver.revolver2 = assets.sprites.revolver_2;
    uiRevolver.bala = assets.sprites.bala;
    uiRevolver.indicator = assets.sprites.indicator;

    revolverAnim = new Animator([uiRevolver.revolver1, uiRevolver.revolver2], 16, false);
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
    if (state.btn.A > 0 && gun.canShoot) gun.fireWeapon(player, enemies);
    //if (state.btn.B > 0 && settings.devMode) initialState();
    if (state.btn.B > 0) gun.loadWeapon();

    if(player.jumping && state.btn.up > 0 && !checkCeiling())
    {
        player.position.y -= 1;
        player.onAir = true;
    }
    else
    {
        player.jumping = false;
        checkGround(player);
        gravity(player);
    }

    enemies.forEach(enemy => {
        gravity(enemy);
        checkGround(enemy);
    });

    // move camera
    let screenX = mapPosition.x + player.position.x;
    if(screenX > camera.cameraLimit.x)
    {
        mapPosition.x -= 1;
        console.log(mapPosition);
    }
    if(screenX < camera.cameraLimit.nx)
    {
        mapPosition.x += 1;
        console.log(mapPosition);
    }

    // When rendering, render first the background and last the UI
    // draw background
    draw(map, mapPosition.x, mapPosition.y);
    // draw player
    drawPlayer(player.flip);

    drawEnemy();

    checkBanana();

    berryAnim.playAllAnimations(map);
    pen(11);
    print("Banana: " + bananas, [50,50]);


    // UI Balas
    if(!gun.canShoot)
    {
        revolverAnim.playAnimation(0, 96)
    }
    else
    {
        draw(uiRevolver.revolver1, 0, 96);
        for (let i = 0; i < gun.bullets.length; i++) {
            if(gun.bullets[i] == 1) draw(uiRevolver.bala, uiRevolver.balasPos[i][0].x, uiRevolver.balasPos[i][0].y);
            if(i == gun.currentSlot) draw(uiRevolver.indicator, uiRevolver.balasPos[i][0].x, uiRevolver.balasPos[i][0].y);
        }
    }

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
    bleeper.sounds[3].play();
    player.jumping = true;
    setTimeout(() => {
        player.jumping = false;
    }, player.jumptime);
}

function drawPlayer(flip)
{
    sprite(player.sprite, mapPosition.x + player.position.x, mapPosition.y + player.position.y, flip)
}

function gravity(entity)
{
    // get tile position of the player y+1
    let x = Math.round(entity.position.x/8);
    let y = Math.round((entity.position.y+4)/8);
    // checks if there is a ground tile here, stop falling
    if(!entity.onAir){
        // it stands on the next tile
        entity.position.y = y*8-8;
    }
    if(entity.onAir)
    {
        entity.position.y += 1;
    }
}

function checkGround(entity)
{
    // get tile position of the player y+1
    let x = Math.round(entity.position.x/8);
    let y = Math.round((entity.position.y+4)/8);
    //console.log("X: " + x + ", Y: " + y);

    if(map.get(x, y) != null)
    {
        if(landTiles.includes(map.get(x,y).sprite))
        {
            entity.onAir = false;
            return true;
        }
    }

    entity.onAir = true;
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
            bleeper.sounds[4].play();
            return true;
        }
    }
    return false;
}

function drawEnemy()
{
    enemies.forEach(enemy => {
        if(!enemy.dead) sprite(enemy.sprite, mapPosition.x + enemy.position.x, mapPosition.y + enemy.position.y)
    });
}

// DEBUG
/*
setInterval(() => 
{
    console.log('FPS: ' + fps);
    fps = 0;
}, 1000)
*/