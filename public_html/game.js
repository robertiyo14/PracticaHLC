
/*********************************************************************/
/*                                                                   */
/*                             Menu                                  */
/*                                                                   */
/*********************************************************************/

//Función que se utiliza para darle funcionalidad a los botones del menú
function marcarBotones(x) {
    //Declarar los botones
    var btinicio = document.getElementById('btInicio');
    var btinstrucciones = document.getElementById('btInstrucciones');
    var btabout = document.getElementById('btAbout');
    //Declarar los divs para mostrarlos
    var inicio = document.getElementById('inicio');
    var instrucciones = document.getElementById('instrucciones');
    var about = document.getElementById('about');
    //En cada caso:
    switch (x) {
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

/*********************************************************************/
/*                           Variables                               */
/*********************************************************************/

//Variables generales utilizadas en la aplicación
var canvas = null;
var ctx = null;
var player = null;
var then = Date.now();
var pause = false;
var gameover;

//Variables para el key listener
var keysDown = {};
var lastPress;

//Variable contar tiempo
var aTimer=0;

//Variables con las imagenes utilizadas
var spritesheet=new Image();
spritesheet.src='img/sprites2.png';
var tabla = new Image();
tabla.src = 'img/tabla.png';
var piedra = new Image();
piedra.src = 'img/piedra.png';
var gameoverImg = new Image();
gameoverImg.src = 'img/gameover.png';

//Componentes del mapa
var stone;
var wood;
var black;
var start;
var finish;

//Declaración de mapas
var map = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 4, 0, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 0, 1, 0, 0, 0, 1, 0,
    0, 2, 0, 0, 1, 0, 1, 1, 1, 0,
    0, 1, 1, 1, 2, 0, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 2, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 3, 0
];

function init() {
    stone = [];
    wood = [];
    black = [];
    start = new Rectangle();
    finish = new Rectangle();
    gameover = false;
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    setMap(map, 10, 50);
    var spriteTiles = new Tileset('img/sprite.png', 32, 32);
    var spriteLeftAnim = new Animation(spriteTiles, ['0,1', '1,1', '2,1'], 200);
    var spriteRightAnim = new Animation(spriteTiles, ['0,2', '1,2', '2,2'], 200);
    var spriteTopAnim = new Animation(spriteTiles, ['0,3', '1,3', '2,3'], 200);
    var spriteBotAnim = new Animation(spriteTiles, ['0,0', '1,0', '2,0'], 200);
    player = new Sprite({
            'left': spriteLeftAnim,
            'right': spriteRightAnim,
            'top': spriteTopAnim,
            'bot': spriteBotAnim}, //Animación del Personaje
            'bot', //Animación actual
            start.x+8, //Posición x
            start.y+8, //Posicion y
            35, //Tamaño x
            35, //Tamaño y
            100 //Velocidad
            );
    
    setInterval(run, 10);
    //run();
}

//Desglosar la matriz del mapa en arrays con los componentes
function setMap(map, columns, blockSize) {
    var col = 0;
    var row = 0;
    stone.length = 0;
    wood.length = 0;
    for (var i = 0, l = map.length; i < l; i++) {
        if (map[i] == 0)
            black.push(new Rectangle(col * blockSize, row * blockSize, blockSize, blockSize));
        else if (map[i] == 1)
            wood.push(new Rectangle(col * blockSize, row * blockSize, blockSize, blockSize));
        else if (map[i] == 2)
            stone.push(new Rectangle(col * blockSize, row * blockSize, blockSize, blockSize));
        else if (map[i] == 3)
            finish = new Rectangle(col * blockSize, row * blockSize, blockSize, blockSize);
        else if (map[i] == 4)
            start = new Rectangle(col * blockSize, row * blockSize, blockSize, blockSize);
        col++;
        if (col >= columns) {
            row++;
            col = 0;
        }
    }
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

window.addEventListener('keydown', function (e) {
    keysDown[e.keyCode] = true;
    lastPress = e.keyCode;
});
window.addEventListener('keyup', function (e) {
    delete keysDown[e.keyCode];
});

function update(mod) {
    if(!pause && !gameover){
        if (37 in keysDown) {
            player.currentState = 'left';
            player.x -= player.speed * mod;
            updateAnimation(player.stateAnimations[player.currentState]);
            for(var i=0;i<black.length;i++){
                if(player.intersects(black[i])){
                    gameover = true;
                }
            }
            interseccionMadera();
        }
        else if (39 in keysDown) {
            player.currentState = 'right';
            player.x += player.speed * mod;
            updateAnimation(player.stateAnimations[player.currentState]);
            for(var i=0;i<black.length;i++){
                if(player.intersects(black[i])){
                    gameover = true;
                }
            }
            interseccionMadera();
        }
        else if (38 in keysDown) {
            player.currentState = 'top';
            player.y -= player.speed * mod;
            updateAnimation(player.stateAnimations[player.currentState]);
            for(var i=0;i<black.length;i++){
                if(player.intersects(black[i])){
                    gameover = true;
                }
            }
            interseccionMadera();
            
        }
        else if (40 in keysDown) {
            player.currentState = 'bot';
            player.y += player.speed * mod;
            updateAnimation(player.stateAnimations[player.currentState]);
            for(var i=0;i<black.length;i++){
                if(player.intersects(black[i])){
                    gameover = true;
                }
            }
            interseccionMadera();
            
        } else if (lastPress == 80){
            pause = true;
            lastPress = null;
        } 
        
            aTimer+=mod;
            if(aTimer>1/10){
                aTimer=0;
                for(var i=0;i<wood.length;i++){
                    if(wood[i].state < 10){
                        wood[i].state++;
                        if(wood[i].state == 10){
                            black.push(wood[i]);
                            var index = wood.indexOf(wood[i]);
                            if (index > -1) {
                                wood.splice(index, 1);
                            }
                        }
                    } else if(wood[i].state > 11 && wood[i].state < 20) {
                        wood[i].state++;
                    } else if(wood[i].state == 20){
                        wood[i].state = 0;
                    }
                }
            }
        
    } else if (lastPress == 80){
        pause = false;
        lastPress = null;
    } else if (lastPress == 32){
        lastPress = null;
        gameover = false;
        init();
    }
}

function interseccionMadera(){
    for(var i=0;i<wood.length;i++){
        if(player.intersects(wood[i]) && wood[i].state==11){
            wood[i].state=12;
        }
    }
}

Sprite.prototype.intersects = function (rect) {
    if (rect != null) {
        return(this.x < rect.x + rect.width -17 && //Izquierda
                this.x + this.width -17 > rect.x && //Derecha
                this.y < rect.y + rect.height -26 && //Arriba
                this.y + this.height -8 > rect.y); //Abajo
        //Los números que se restan son para compensar la posición del personaje
    }
}

function render() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Pintar Tablas de madera
    for (var i = 0; i < wood.length; i++) {
        if(wood[i].state >= 11)
            ctx.drawImage(tabla, wood[i].x, wood[i].y);
        else
            ctx.drawImage(spritesheet, 0, wood[i].state*50, 50, 50, wood[i].x, wood[i].y, 50, 50);
    }

    //Pintar Piedras
    for (var i = 0; i < stone.length; i++) {
        ctx.drawImage(piedra, stone[i].x, stone[i].y);
    }

    //Pintar Inicio y fin
    ctx.drawImage(piedra, start.x, start.y);
    ctx.drawImage(piedra, finish.x, finish.y);

    //Pintar Jugador
    drawSprite(player);

    /*ctx.fillStyle = '#fff';
     ctx.font = '15pt Arial';
     ctx.textBaseline = 'top';
     ctx.fillText('Arrow keys to move left and right', 15, 15);*/
    if(pause){
        ctx.fillStyle = '#fff';
        ctx.font = '80pt Arial';
        ctx.textBaseline = 'top';
        ctx.fillText('PAUSE!', 55, 95);
    }
    
    if(gameover){
        ctx.drawImage(gameoverImg,0,0);
    }
    
}

//Hace correr el juego
function run() {
    update((Date.now() - then) / 1000);
    if (game.images == game.imagesLoaded) {
        render();
    }
    then = Date.now();
}

//Función para crear objetos rectangulares.
function Rectangle(x, y, width, height) {
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;
    this.state = 11;
}
