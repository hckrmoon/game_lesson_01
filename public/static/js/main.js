var socket;
var blob;
var blobs = [];
var zoom = 1;

/**
 * Setup for drawing
 */
function setup() {
    createCanvas(600, 600);
    background(0);

    socket = io.connect('http://localhost:3000');

    blob = new Blob(0, 0, 64);
    var data = {
        x: blob.pos.x,
        y: blob.pos.y,
        r: blob.r
    };

    socket.emit('start', data);

    socket.on('heartbeat', function (data) {
        blobs = data;
    });
}

var a = Date.now();

/**
 * Drawing function called 60 times per 1sec.
 */
function draw() {
    background(0);

    console.log('diff => ', Date.now() - a);
    a = Date.now();

    var newZoom = 64 / blob.r;
    zoom = lerp(zoom, newZoom, 0.1);
    translate(width / 2, height / 2);
    scale(zoom);
    translate(-blob.pos.x, -blob.pos.y);

    blobs.filter(function (b, idx) {

        if (b.id !== socket.id) {
            fill(0, 0, 255);
            ellipse(b.x, b.y, b.r * 2, b.r * 2);

            fill(255);
            textAlign(CENTER);
            textSize(9);
            text(b.id, b.x, b.y + b.r + 2);
        }
    });

    blob.update();
    blob.show();
    blob.constrain();

    socket.emit('update', {
        x: blob.pos.x,
        y: blob.pos.y,
        r: blob.r
    });
}