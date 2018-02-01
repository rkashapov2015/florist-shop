const PI = Math.PI;
function randomMinMax(min, max, divider) {
    if(!divider) divider = 1;
    var rand = (min + (Math.random() * (max + 0.01 - min)));
    return Math.floor(rand*divider)/divider;
}

var canvasAnimator = {
    canvas: null,
    context: null,
    dataPoints: [],
    parent: null,
    init: function (canvasNode, parentNode) {
        canvasAnimator.canvas = canvasNode;
        if (!canvasAnimator.canvas) {
            return false;
        }
        canvasAnimator.parent = parentNode;
        canvasAnimator.context = canvasAnimator.canvas.getContext('2d');
    },
    tick: function () {
        setTimeout(canvasAnimator.repaint, 50);
        window.requestAnimationFrame(canvasAnimator.tick);
    },
    run: function() {
        for (var i = 0; i< randomMinMax(500, 200, 1); i++) {
            var x = Math.floor(Math.random() * canvasAnimator.canvas.width);
            var y = Math.floor(Math.random() * canvasAnimator.canvas.height);
            var r = randomMinMax(0,2*PI, 100);
            var type = '';
            var size = randomMinMax(0.1,0.6, 100);
            var rndValue = Math.floor(Math.random() * 100);
            var hue = randomMinMax(0, 359, 1);
            var color = 'hsl(' + hue + ',100%,50%)';
            if (rndValue < 20) {
                //createStar(x,y,size, r, color);
                type = 'star';
            } else if (rndValue < 40) {
                //createArc(x, y, size, color);
                type = 'arc';
            } else if (rndValue < 60) {
                //createCross(x, y, size, r, color);
                type = 'cross';
            } else if (rndValue < 80) {
                //createSquare(x, y, size, r, color);
                type = 'square';
            } else {
                //createTriangle(x, y, size, r, color);
                type = 'triangle';
            }
    
            var angularVelocity = randomMinMax(-0.2,0.2, 1000);
            canvasAnimator.dataPoints[i] = {
              x: x, 
              y: y, 
              r: r,
              size: size,
              ang: angularVelocity, 
              type: type,
              color: color,
              func: Math.floor(Math.random() * 100) > 50?canvasAnimator.formulaOne:canvasAnimator.formulaTwo
            };
        }
        canvasAnimator.tick();
    },
    createFigure: function(type, object) {
        if (!canvasAnimator.context) {
            return false;
        }
        var nameFunc = '_'+type;
        var func = canvasAnimator[nameFunc];
        if (typeof func === "function") {
            func(object);
        }
    },
    _triangle: function(data) {
        var size = data.size*10;
        canvasAnimator.context.save();
        canvasAnimator.context.beginPath()
        canvasAnimator.context.translate(data.x, data.y);
        canvasAnimator.context.rotate(data.r);
        canvasAnimator.context.moveTo(0, 10*data.size);
        canvasAnimator.context.lineTo(-8.68*data.size, -4.96*data.size);
        canvasAnimator.context.lineTo(8.62*data.size, -5.08*data.size);
        canvasAnimator.context.lineTo(0, 10*data.size);
        canvasAnimator.context.lineTo(-8.68*data.size, -4.96*data.size);
        canvasAnimator.context.lineWidth = 5 * data.size;
        if (!data.color) {
            data.color = '#ffffff';
        }
        canvasAnimator.context.strokeStyle = data.color;
        canvasAnimator.context.stroke();
        canvasAnimator.context.closePath();
        canvasAnimator.context.restore();
    },
    _square: function(data) {
        var length = 30 * data.size;
        canvasAnimator.context.save();
        canvasAnimator.context.beginPath()
        canvasAnimator.context.translate(data.x,data.y);
        canvasAnimator.context.rotate(data.r);
        canvasAnimator.context.rect(-length/2, -length/2, length, length);
        canvasAnimator.context.lineWidth = 5 * data.size;
        if (!data.color) {
            data.color = '#ffffff';
        }
        canvasAnimator.context.strokeStyle = data.color;
        canvasAnimator.context.stroke();
        canvasAnimator.context.closePath();
        canvasAnimator.context.restore();
    },
    _star: function(data) {
        data.size = data.size * 2;
        canvasAnimator.context.save();
        canvasAnimator.context.beginPath();
        canvasAnimator.context.translate(data.x,data.y);
        canvasAnimator.context.rotate(data.r);
        canvasAnimator.context.moveTo(0,(10*data.size));
        canvasAnimator.context.lineTo(-(5.88*data.size),-(8.09*data.size));
        canvasAnimator.context.lineTo(9.51*data.size,3.09*data.size);
        canvasAnimator.context.lineTo(-(9.51*data.size),3.09*data.size);
        canvasAnimator.context.lineTo((5.88*data.size),-(8.09*data.size));
        canvasAnimator.context.lineTo(0,(10*data.size));
        canvasAnimator.context.lineTo(-(5.88*data.size),-(8.09*data.size));
        canvasAnimator.context.lineWidth = 5 * data.size;
        if (!data.color) {
            data.color = '#ffffff';
        }
        canvasAnimator.context.strokeStyle = data.color;
        canvasAnimator.context.stroke();
        canvasAnimator.context.closePath();
        canvasAnimator.context.restore();
    },
    _arc: function(data) {
        canvasAnimator.context.save();
        canvasAnimator.context.beginPath();
        canvasAnimator.context.translate(data.x,data.y);
        canvasAnimator.context.arc(0, 0, 12*data.size, 0, 2*Math.PI, false);
        canvasAnimator.context.lineWidth = 5 * data.size;
        if (!data.color) {
            data.color = '#ffffff';
        }
        canvasAnimator.context.strokeStyle = data.color;
        canvasAnimator.context.closePath();
        canvasAnimator.context.stroke();
        canvasAnimator.context.restore();
    },
    clear: function () {
        canvasAnimator.context.clearRect(0,0,canvasAnimator.canvas.width,canvasAnimator.canvas.height);
    },
    repaint: function() {
        canvasAnimator.clear();
        for (var i = 0; i< canvasAnimator.dataPoints.length; i++) {
            var object = canvasAnimator.dataPoints[i];    
            var point = object.func(object.x, object.y, Date.now());
            object.r += object.ang;
            if (object.r > 2* PI) object.r = 0;
            if (object.r < 0) object.r = 2*PI;
            canvasAnimator.createFigure(object.type, {x: point.x, y: point.y, size: object.size, r: object.r, color: object.color});
        }
    },
    resize: function() {
        if (!canvasAnimator.parent) {
            return false;
        }
        var w = canvasAnimator.parent.offsetWidth;
        var h = canvasAnimator.parent.offsetHeight;
        canvasAnimator.canvas.style.width = w-5 + 'px';
        canvasAnimator.canvas.style.height = h-5 + 'px';
        canvasAnimator.canvas.width = w;
        canvasAnimator.canvas.height = h;
        canvasAnimator.run();
    },
    formulaOne: function(x, y, time) {
        return {
            x: x + Math.sin((50 + x + (time / 10)) / 100) * 3,
            y: y + Math.sin((45 + x + (time / 10)) / 100) * 4
        };
    },
    formulaTwo: function(x, y, time) {
        return {
          x: x + Math.sin((x + (time / 10)) / 100) * 5,
          y: y + Math.sin((10 + x + (time / 10)) / 100) * 2
        }
    }
}