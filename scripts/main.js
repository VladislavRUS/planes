// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Render = Matter.Render,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

var canvas, ctx;

var WIDTH = window.innerWidth, HEIGHT = innerHeight;

var engine;
var world;
var rectangles = [];
var SPEED = 0.001;

var USER_INPUT = {
    left: false,
    up: false,
    right: false,
    down: false
}

function Rectangle(x, y, width, height) {
    this.options = {
        frictionAir: 0.1,
    };
    this.body = Bodies.rectangle(x, y, width, height, this.options);
    this.width = width;
    this.height = height;
    Body.setMass(this.body, 150);
    World.add(world, this.body);
}

Rectangle.prototype.applyForce = function () {

    var angle = this.body.angle;// - (90 * Math.PI / 180);

    var forceVector = {
        x: Math.cos(angle) * SPEED,
        y: Math.sin(angle) * SPEED
    }

    Body.applyForce(this.body, this.getPosition(), forceVector);
};

Rectangle.prototype.update = function() {
    if (USER_INPUT.left) {
        Body.setAngularVelocity(this.body, -0.07);

    } else if (USER_INPUT.right) {
        Body.setAngularVelocity(this.body, 0.07);
    }

    if (USER_INPUT.up) {
        if (SPEED < 0.5)
            SPEED += 0.005;

    } else if (USER_INPUT.down) {
        if (SPEED > 0) {
            SPEED -= 0.005;
        }
    }
}

Rectangle.prototype.draw = function () {
    ctx.save();

    ctx.fillStyle = 'red';
    ctx.translate(this.body.position.x, this.body.position.y);
    ctx.rotate(this.body.angle);
    ctx.fillRect(-this.width / 2, - this.height / 2, this.width, this.height);

    ctx.restore();
}

Rectangle.prototype.getPosition = function () {
    return this.body.position;
}

function setup() {

    engine = Engine.create();
    world = engine.world;

    Engine.run(engine);

    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: WIDTH,
            height: HEIGHT
        }
    });

    Render.run(render);

    canvas = document.getElementsByTagName('canvas')[0];
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.onmousedown = function (event) {
        rectangles.push(new Rectangle(event.clientX, event.clientY, 50, 20));
    }

    document.onkeydown = function(event) {
        if (event.keyCode === 37) {
            USER_INPUT.left = true;
        } 
        
        if (event.keyCode === 38) {
            USER_INPUT.up = true;
        }
         
        if (event.keyCode === 39) {
            USER_INPUT.right = true;
        } 
         
        if (event.keyCode === 40) {
            USER_INPUT.down = true;
        }
    };

    document.onkeyup = function(event) {
        if (event.keyCode === 37) {
            USER_INPUT.left = false;
        } 
        
        if (event.keyCode === 38) {
            USER_INPUT.up = false;
        }
         
        if (event.keyCode === 39) {
            USER_INPUT.right = false;
        } 
         
        if (event.keyCode === 40) {
            USER_INPUT.down = false;
        }
    };


    var options = {
        isStatic: true
    }

    ground = Bodies.rectangle(canvas.width / 2, canvas.height, canvas.width, 100, options);
    World.add(world, ground);

    draw();
}



function draw() {
    rectangles.forEach(function (rect) {
        rect.draw();
        rect.update();
        rect.applyForce();
    });

    requestAnimationFrame(draw);
}

setup();