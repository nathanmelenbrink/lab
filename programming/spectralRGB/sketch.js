let img;

function preload() {
  img = loadImage('spectrum1.png');
}

function setup() {
  background(50);
  // Top-left corner of the img is at (10, 10)
  // Width and height are 50×50
  image(img, 0, 0, width, height, 0, 0, img.width, img.height, COVER);
}