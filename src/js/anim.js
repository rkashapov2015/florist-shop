
var canvas = document.getElementById('canvasBackground');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', (event) => {
  //clearCanvas();
  //resizeCanvas();
});
const PI = Math.PI;

var ctx = canvas.getContext('2d');

function tick() {
    setTimeout(repaint, 50);
    window.requestAnimationFrame(tick);
}

function createCross(x, y, size, rotate) {
    var length = 20 * size;
    ctx.save();
    ctx.beginPath();
    ctx.translate(x,y);
    ctx.rotate(rotate);
    ctx.moveTo(-length/2,0);
    ctx.lineTo(length/2,0);
    ctx.moveTo(0, -length/2);
    ctx.lineTo(0,length/2);
    ctx.lineWidth = 5 * size;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function createStar(x, y, size, rotate) {
    var length = 20 * size;
    //0,00	10
    //-9,51	3,09
    //-5,88	-8,09
    //5,88	-8,09
    //9,51	3,09
    //0	    10

    //0,00	10
    //-5,88	-8,09
    //9,51	3,09
    //-9,51	3,09
    //5,88	-8,09
    //0,00	10

    ctx.save();
    ctx.beginPath();
    ctx.translate(x,y);
    ctx.rotate(rotate);
    ctx.moveTo(0,(10*size));
    
    ctx.lineTo(-(5.88*size),-(8.09*size));

    ctx.lineTo(9.51*size,3.09*size);

    ctx.lineTo(-(9.51*size),3.09*size);

    ctx.lineTo((5.88*size),-(8.09*size));

    ctx.lineTo(0,(10*size));

    ctx.lineTo(-(5.88*size),-(8.09*size));

    ctx.lineWidth = 5 * size;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}
  
function createArc(x, y, size) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x,y);
    ctx.arc(0, 0, 12*size, 0, 2*Math.PI, false);
    ctx.lineWidth = 5 * size;
    ctx.strokeStyle = '#ffffff';
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

function initPaint() {
    for (var i = 0; i< randomMinMax(500, 200, 1); i++) {
        var x = Math.floor(Math.random() * canvas.width);
        var y = Math.floor(Math.random() * canvas.height);
        var r = randomMinMax(0,2*PI, 100);
        var type = '';
        var size = randomMinMax(0.1,0.6, 100);
        if(Math.floor(Math.random() * 100) > 50) {
          //createCross(x, y, size, r);
          createStar(x,y,size, r);
          type = 'cross';
        } else {
          createArc(x, y, size);
          type = 'arc';
        }
        var angularVelocity = randomMinMax(-0.2,0.2, 1000);
        array[i] = {
          x: x, 
          y: y, 
          r: r,
          size: size,
          ang: angularVelocity, 
          type: type, 
          func: Math.floor(Math.random() * 100) > 50?nextPointOne:nextPointTwo
        };
    }
    tick();
}

function repaint() {
    clearCanvas();
    for (var i = 0; i< array.length; i++) {
        var object = array[i];    
        var point = object.func(object.x, object.y, Date.now());
        if (object.type === 'cross') {
            object.r += object.ang;
            if (object.r > 2* PI) object.r = 0;
            if (object.r < 0) object.r = 2*PI;
            //createCross(point.x,point.y, object.size, object.r);
            createStar(point.x,point.y,object.size, object.r);
        } else {
            createArc(point.x,point.y, object.size);  
        }
    }
}
  
function nextPointOne(x, y, time) {
    return {
        x: x + Math.sin((50 + x + (time / 10)) / 100) * 3,
        y: y + Math.sin((45 + x + (time / 10)) / 100) * 4
    };
}
function nextPointTwo(x, y, time) {
    return {
      x: x + Math.sin((x + (time / 10)) / 100) * 5,
      y: y + Math.sin((10 + x + (time / 10)) / 100) * 2
    }
}
function clearCanvas() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
}
  
function randomMinMax(min, max, divider) {
    if(!divider) divider = 1;
    var rand = (min + (Math.random() * (max + 0.01 - min)));
    return Math.floor(rand*divider)/divider;
}
  
function resizeCanvas() {
    var container = document.getElementById('container');
    var w = container.offsetWidth;
    var h = container.offsetHeight;
    canvas.style.width = w-5 + 'px';
    canvas.style.height = h-5 + 'px';
    canvas.width = w;
    canvas.height = h;
}