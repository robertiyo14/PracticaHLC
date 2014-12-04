/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function marcarBotones(x){
    var btinicio = document.getElementById('btInicio');
    var btinstrucciones = document.getElementById('btInstrucciones');
    var btabout = document.getElementById('btAbout');
    var inicio = document.getElementById('inicio');
    var instrucciones = document.getElementById('instrucciones');
    var about = document.getElementById('about');
    switch(x){
        case 0:
            btinicio.style.background = "url('img/botonActivo.png')";
            btinstrucciones.style.background = "url('img/boton.png')";
            btabout.style.background = "url('img/boton.png')";
            inicio.style.display = "block";
            instrucciones.style.display = "none";
            about.style.display = "none";
            init();
            break;
        case 1:
            btinicio.style.background = "url('img/boton.png')";
            btinstrucciones.style.background = "url('img/botonActivo.png')";
            btabout.style.background = "url('img/boton.png')";
            inicio.style.display = "none";
            instrucciones.style.display = "block";
            about.style.display = "none";
            break;
        case 2:
            btinicio.style.background = "url('img/boton.png')";
            btinstrucciones.style.background = "url('img/boton.png')";
            btabout.style.background = "url('img/botonActivo.png')";
            inicio.style.display = "none";
            instrucciones.style.display = "none";
            about.style.display = "block";
            break;
        default:
            break;
    }
}

//window.addEventListener('load', init, false);
var canvas = null;
var ctx = null;
var spriteTiles = null;
var spriteLeftAnim = null;
var spriteRightAnim = null;
var spriteTopAnim = null;
var spriteBotAnim = null;
var player = null;

function init() {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    spriteTiles = new Tileset('img/sprite.png', 32, 32);
    spriteLeftAnim = new Animation(spriteTiles, ['0,1', '1,1', '2,1'], 200);
    spriteRightAnim = new Animation(spriteTiles, ['0,2', '1,2', '2,2'], 200);
    spriteTopAnim = new Animation(spriteTiles, ['0,3', '1,3', '2,3'], 200);
    spriteBotAnim = new Animation(spriteTiles, ['0,0', '1,0', '2,0'], 200);
    player = new Sprite({'left': spriteLeftAnim, 'right': spriteRightAnim, 'top': spriteTopAnim, 'bot': spriteBotAnim}, 'right', canvas.width / 2, canvas.height / 2, 12, 12, 50);
    run();
}

function imageLoaded() {
    game.imagesLoaded++;
}

function Tileset(image, tileWidth, tileHeight) {
    this.image = new Image();
    game.images++;
    this.image.onload = imageLoaded;
    this.image.src = image;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
}

function Animation(tileset, frames, frameDuration) {
    this.tileset = tileset;
    this.frames = frames;
    this.currentFrame = 0;
    this.frameTimer = Date.now();
    this.frameDuration = frameDuration;
}

function Sprite(stateAnimations, startingState, x, y, width, height, speed) {
    this.stateAnimations = stateAnimations;
    this.currentState = startingState;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
}

function drawSprite(sprite) {
    ctx.drawImage(
            sprite.stateAnimations[sprite.currentState].tileset.image,
            sprite.stateAnimations[sprite.currentState].frames[sprite.stateAnimations[sprite.currentState].currentFrame].split(',')[0] * sprite.stateAnimations[sprite.currentState].tileset.tileWidth,
            sprite.stateAnimations[sprite.currentState].frames[sprite.stateAnimations[sprite.currentState].currentFrame].split(',')[1] * sprite.stateAnimations[sprite.currentState].tileset.tileHeight,
            sprite.stateAnimations[sprite.currentState].tileset.tileWidth,
            sprite.stateAnimations[sprite.currentState].tileset.tileHeight,
            Math.round(sprite.x),
            Math.round(sprite.y),
            sprite.width,
            sprite.height
            );
}

function updateAnimation(anim) {
    if (Date.now() - anim.frameTimer > anim.frameDuration) {
        if (anim.currentFrame < anim.frames.length - 1)
            anim.currentFrame++;
        else
            anim.currentFrame = 0;
        anim.frameTimer = Date.now();
    }
}

var game = {
    images: 0,
    imagesLoaded: 0,
    backgroundColor: '#000'
}

var keysDown = {};
window.addEventListener('keydown', function (e) {
    keysDown[e.keyCode] = true;
});
window.addEventListener('keyup', function (e) {
    delete keysDown[e.keyCode];
});

function update(mod) {
    if (37 in keysDown) {
        player.currentState = 'left';
        player.x -= player.speed * mod;
        updateAnimation(player.stateAnimations[player.currentState]);
    }
    else if (39 in keysDown) {
        player.currentState = 'right';
        player.x += player.speed * mod;
        updateAnimation(player.stateAnimations[player.currentState]);
    }
    else if (38 in keysDown) {
        player.currentState = 'top';
        player.y -= player.speed * mod;
        updateAnimation(player.stateAnimations[player.currentState]);
    }
    else if (40 in keysDown) {
        player.currentState = 'bot';
        player.y += player.speed * mod;
        updateAnimation(player.stateAnimations[player.currentState]);
    }
}

function render() {
    ctx.fillStyle = game.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawSprite(player);
    /*ctx.fillStyle = '#fff';
    ctx.font = '15pt Arial';
    ctx.textBaseline = 'top';
    ctx.fillText('Arrow keys to move left and right', 15, 15);*/
}

function run() {
    update((Date.now() - then) / 1000);
    if (game.images == game.imagesLoaded) {
        render();
    }
    then = Date.now();
}

var then = Date.now();
setInterval(run, 10);
