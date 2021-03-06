var socket;
var blob;
var blobs = [];
var users = [];
var zoom = 1;

var _canvasWidth = 1000;
var _canvasHeight = 1000;

var latestHeartbeat = 0;
var latestUpdate = 0;

/**
 * Define things that should be preloaded.
 */
function preload() {
    console.log("preload");
}

/**
 * Setup for drawing
 */
function setup() {
    createCanvas(_canvasWidth, _canvasHeight);
    background(0);

    socket = io.connect(location.origin);   

    blob = new Blob(0, 0, 32);
    var data = {
        x: blob.pos.x,
        y: blob.pos.y,
        r: blob.r
    };

    socket.emit('start', data);

    socket.on('heartbeat', function (data) {
        users = data.users;
        latestHeartbeat = data.ts;
    });

    socket.on('blobs.changes', function(data) {
        blobs = data.map(function(b) {
            return new Blob(b.x, b.y, b.r, b.b_id);
        });
    });

    socket.on('ate', function (data) {
        blob.ate(data);
    });

    setTimeout(function sendUpdate() {
        socket.emit('update', {
            user: {
                x: blob.pos.x,
                y: blob.pos.y,
                r: blob.r
            },
            ts: Date.now()
        });

        setTimeout(sendUpdate, 13);
    }, 16);
}

/**
 * Drawing function called 60 times per 1sec.
 */
function draw() {
    background(0);

    // var newZoom = 32 / (32 + ((blob.r - 32) * 0.5));
    // zoom = lerp(zoom, newZoom, 0.1);
    translate(width / 2, height / 2);
    //scale(zoom);
    translate(-blob.pos.x, -blob.pos.y);

    users.forEach(function (b) {
        if (b.id !== socket.id) {
            fill(0, 0, 255);
            ellipse(b.x, b.y, b.r * 2, b.r * 2);

            fill(255);
            textAlign(CENTER);
            textSize(9);
            text(b.id, b.x, b.y + b.r + 2);
        }
    });

    blobs.forEach(function (b, idx) {
        fill(255, 0, 0);
        ellipse(b.x, b.y, b.r * 2, b.r * 2);

        if (blob.eats(b)) {
            socket.emit('eating', { 
                b_id: b.b_id,
                x: b.pos.x,
                y: b.pos.y,
                r: b.r
            });
        }
    });

    blob.update();
    blob.show();
    blob.constrain();
}
