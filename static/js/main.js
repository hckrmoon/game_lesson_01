var blob;
var blobs = [];
var zoom = 1;

function setup() {
    createCanvas(600, 600);
    blob = new Blob(width / 2, height / 2, 64);

    for (var i = 0; i < 100; i++) {
      var x = random(-width, width * 2);
      var y = random(-height, height * 2);
      blobs[i] = new Blob(x, y, 16);
    }
}

function draw() {
    background(0);

    var newZoom = 64 / blob.r;
    zoom = lerp(zoom, newZoom, 0.1);
    translate(width / 2, height / 2);
    scale(zoom);
    translate(-blob.pos.x, -blob.pos.y);

    blobs = blobs.filter(function (b, idx) {
        if (blob.eats(b)) {
            return false;
        } else {
            b.show();
            return true;
        }
    });

    blob.update();
    blob.show();
}