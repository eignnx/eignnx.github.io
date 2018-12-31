
let entities = new Set([]);

const SIDEBAR_WIDTH = 45;
const DEBUG = true;

function setup() {
  createCanvas(windowWidth - SIDEBAR_WIDTH, windowHeight);
}

function draw() {
  background(51);
  entities.forEach(entity => {
    entity.update(entities);
    entity.show();
  });
}

function mousePressed() {
  let pos = createVector(mouseX, mouseY);
  entities.add(new Tonk(pos));
}