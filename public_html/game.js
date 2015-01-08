
/*********************************************************************/
/*                                                                   */
/*                             Menu                                  */ 
/*                                                                   */
/*********************************************************************/

//Función que se utiliza para darle funcionalidad a los botones del menú
function marcarBotones(x){
    //Declarar los botones
    var btinicio = document.getElementById('btInicio');
    var btinstrucciones = document.getElementById('btInstrucciones');
    var btabout = document.getElementById('btAbout');
    //Declarar los divs para mostrarlos
    var inicio = document.getElementById('inicio');
    var instrucciones = document.getElementById('instrucciones');
    var about = document.getElementById('about');
    //En cada caso:
    switch(x){
        //Muestra el Canvas del juego
        case 0:
            //Le damos estilos a los botones, para remarcar el que está pulsado
            btinicio.style.background = "url('img/botonActivo.png')";
            btinstrucciones.style.background = "url('img/boton.png')";
            btabout.style.background = "url('img/boton.png')";
            //Se muestra el div y se ocultan los demás
            inicio.style.display = "block";
            instrucciones.style.display = "none";
            about.style.display = "none";
            //La funcion init es la que inicia el juego
            init();
            break;
        //Muestra las instrucciones
        case 1:
            //Le damos estilos a los botones, para remarcar el que está pulsado
            btinicio.style.background = "url('img/boton.png')";
            btinstrucciones.style.background = "url('img/botonActivo.png')";
            btabout.style.background = "url('img/boton.png')";
            //Se muestra el div y se ocultan los demás
            inicio.style.display = "none";
            instrucciones.style.display = "block";
            about.style.display = "none";
            break;
        //Muestra nuestra información personal
        case 2:
            //Le damos estilos a los botones, para remarcar el que está pulsado
            btinicio.style.background = "url('img/boton.png')";
            btinstrucciones.style.background = "url('img/boton.png')";
            btabout.style.background = "url('img/botonActivo.png')";
            //Se muestra el div y se ocultan los demás
            inicio.style.display = "none";
            instrucciones.style.display = "none";
            about.style.display = "block";
            break;
        default:
            break;
    }
}
    
/*********************************************************************/
/*                                                                   */
/*                             Juego                                 */ 
/*                                                                   */
/*********************************************************************/

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
    player = new Sprite({'left': spriteLeftAnim, 'right': spriteRightAnim, 'top': spriteTopAnim, 'bot': spriteBotAnim}, 'right', canvas.width / 2, canvas.height / 2, 25, 25, 50);
    setMap(map, 10, 50);
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
};

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

//nuevo
var map=[
    0,0,0,0,0,0,0,0,0,0,
    0,0,2,0,1,1,1,1,1,0,
    0,1,1,0,1,0,0,0,1,0,
    0,2,0,0,1,0,1,1,1,0,
    0,1,1,1,2,0,1,0,0,0,
    0,0,0,0,0,0,2,1,1,0,
    0,0,0,0,0,0,0,0,3,0
];
var pressing = [];
var pause;
var gameover = true;
var stone = [];
var wood = [];
var finish = [];

function setMap(map,columns,blockSize){
        var col=0;
        var row=0;
        stone.length=0;
        wood.length=0;
        for(var i=0,l=map.length;i<l;i++){
            if(map[i]==1)
                wood.push(new Rectangle(col*blockSize,row*blockSize,blockSize,blockSize));
            else if(map[i]==2)
                stone.push(new Rectangle(col*blockSize,row*blockSize,blockSize,blockSize));
            col++
            if(col>=columns){
                row++;
                col=0;
            }
        }
        //worldWidth=columns*blockSize;
        //worldHeight=row*blockSize;
    }