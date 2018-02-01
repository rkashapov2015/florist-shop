
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

function createTriangle(x, y, size, rotate, color) {
    size = size*2;
    //0,00	10,00
    //-8,68	-4,96
    //8,62	-5,08
    ctx.save();
    ctx.beginPath()
    ctx.translate(x,y);
    ctx.rotate(rotate);
    ctx.moveTo(0, 10*size);
    ctx.lineTo(-8.68*size, -4.96*size);
    ctx.lineTo(8.62*size, -5.08*size);
    ctx.lineTo(0, 10*size);
    ctx.lineTo(-8.68*size, -4.96*size);
    ctx.lineWidth = 2 * size;
    if (!color) {
        color = '#ffffff';
    }
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function createSquare(x, y, size, rotate, color) {
    var length = 30 * size;
    ctx.save();
    ctx.beginPath()
    ctx.translate(x,y);
    ctx.rotate(rotate);
    
    ctx.rect(-length/2, -length/2, length, length);
    ctx.lineWidth = 1 * size;
    if (!color) {
        color = '#ffffff';
    }
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function createCross(x, y, size, rotate, color) {
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
    if (!color) {
        color = '#ffffff';
    }
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function createStar(x, y, size, rotate, color) {
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
    if (!color) {
        color = '#ffffff';
    }
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}
  
function createArc(x, y, size, color) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x,y);
    ctx.arc(0, 0, 12*size, 0, 2*Math.PI, false);
    ctx.lineWidth = 5 * size;
    if (!color) {
        color = '#ffffff';
    }
    ctx.strokeStyle = color;
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
        var rndValue = Math.floor(Math.random() * 100);
        var hue = randomMinMax(0, 359, 1);
        var color = 'hsl(' + hue + ',100%,50%)';
        if (rndValue < 20) {
            createStar(x,y,size, r, color);
            type = 'star';
        } else if (rndValue < 40) {
            createArc(x, y, size, color);
            type = 'arc';
        } else if (rndValue < 60) {
            createCross(x, y, size, r, color);
            type = 'cross';
        } else if (rndValue < 80) {
            createSquare(x, y, size, r, color);
            type = 'square';
        } else {
            createTriangle(x, y, size, r, color);
            type = 'triangle';
        }

        var angularVelocity = randomMinMax(-0.2,0.2, 1000);
        
        array[i] = {
          x: x, 
          y: y, 
          r: r,
          size: size,
          ang: angularVelocity, 
          type: type,
          color: color,
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
        
            object.r += object.ang;
            if (object.r > 2* PI) object.r = 0;
            if (object.r < 0) object.r = 2*PI;
            switch(object.type) {
                case 'cross':
                createCross(point.x,point.y, object.size, object.r, object.color);
                break;
                case 'star':
                createStar(point.x,point.y,object.size, object.r, object.color);
                break;
                case 'square':
                createSquare(point.x, point.y, object.size, object.r, object.color);
                break;
                case 'triangle':
                createTriangle(point.x, point.y, object.size, object.r, object.color);
                break;
                default: 
                createArc(point.x,point.y, object.size, object.color);      
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