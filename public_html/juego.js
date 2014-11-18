
//(function(){
//Redimensiona el canvas para que ocupe toda la pantalla
function resize() {
    var w = window.innerWidth / canvas.width;
    var h = window.innerHeight / canvas.height;
    var scale = Math.min(h, w);
    canvas.style.width = ((canvas.width * scale)-150) + 'px';
    canvas.style.height = ((canvas.height * scale) - 150) + 'px';
}

//Ejecuta el método init al cargar el navegador. (Aquí empieza el script)
//window.addEventListener('load', init, false);
var canvas = null, ctx = null;
var player = new Rectangle(10, 10, 20, 20);
var coin = new Rectangle(100, 100, 10, 10);
var lastPress = null;//Guardamos la última tecla pulsada
var pause = false;
var pressing = [];
var velocidad = 10;
var score = 0;
var iPlayer = new Image(), iCoin = new Image();
iPlayer.src = 'player.png';
iCoin.src = 'coin.png';


/********Guardamos las teclas que vamos a utilizar**********/
var KEY_ENTER = 13;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
/***********************************************************/

//Función por donde empieza el script. 
function init() {
    canvas = document.getElementById('canvas');//Recogemos el canvas
    ctx = canvas.getContext('2d');//Establecemos el contexto
    //resize();//Lo redimensionamos para que ocupe toda la pantalla
    run();//Y por último pintamos los elementos del canvas
    repaint();
}

//Pinta el canvas
function paint(ctx) {
    //Pintamos todo el canvas en negro para limpiarlo
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //Posteriormente, volvemos a pintar nuestro recuadro
    ctx.fillStyle = '#FFF';//Rellena de color un área
    ctx.drawImage(iPlayer,player.x,player.y);
//    player.fill(ctx);//Pone la esquina superior derecha en la coordenada
    //x,y y le da el ancho y el largo
    ctx.fillStyle = '#fff';
//    coin.fill(ctx);
    ctx.fillText('Score: '+score,0,10);
    ctx.fillStyle = '#ff0';
    ctx.drawImage(iCoin,coin.x,coin.y);
    

    if (pause) {
        ctx.textAlign = 'center';
        ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 2);
        ctx.textAlign = 'left';
    }
}

//Este método se ejecuta todo el rato
function run() {
    setTimeout(run, 50);
    act();
}

function repaint() {
    requestAnimationFrame(repaint);
    paint(ctx);
}

function act() {
    if (!pause) {
        if (pressing[KEY_UP])
            player.y -= velocidad;
        if (pressing[KEY_DOWN])
            player.y += velocidad;
        if (pressing[KEY_RIGHT])
            player.x += velocidad;
        if (pressing[KEY_LEFT])
            player.x -= velocidad;

        if (player.x > canvas.width)
            player.x = 0;
        if (player.y > canvas.height)
            player.y = 0;
        if (player.x < 0)
            player.x = canvas.width;
        if (player.y < 0)
            player.y = canvas.height;
    }

    if (player.intersects(coin)) {
        score++;
        coin.x = random(canvas.width / 10 - 1) * 10;
        coin.y = random(canvas.height / 10 - 1) * 10;
    }

    if (lastPress == KEY_ENTER) {
        pause = !pause;
        lastPress = null;
    }
}
/*************************************/
/********ESTO ES UNA CLASE!!!*********/
/*************************************/
function Rectangle(x, y, width, height) {
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;

    this.intersects = function(rect) {
        if (rect != null) {
            return(this.x < rect.x + rect.width &&
                    this.x + this.width > rect.x &&
                    this.y < rect.y + rect.height &&
                    this.y + this.height > rect.y);
        }
    }

    this.fill = function(ctx) {
        if (ctx != null) {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

function random(max) {
    return Math.floor(Math.random() * max);
}


document.addEventListener('keydown', function(evt) {
    lastPress = evt.keyCode;
    pressing[evt.keyCode] = true;
}, false);

document.addEventListener('keyup', function(evt) {
    pressing[evt.keyCode] = false;
}, false);

//})();