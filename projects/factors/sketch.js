let canvas;
let entities = new Set([]);

const MOUSE_DRAG_STRENGTH = 1;

function keyTyped() {
  if (keyCode == SPACE) {
    for (let entity of entities) {
      if (entity.touchingMouse()) {
        entity.split(entities);
        return;
      }
    }

    const pos = createVector(mouseX, mouseY);
    entities.add(new Vertex(pos));
  }
}

function mousePressed() {
  for (let entity of entities) {
    const mouse = createVector(mouseX, mouseY);
    const towardMouse = p5.Vector.sub(mouse, entity.pos);
    if (towardMouse.mag() < entity.rad) {
      towardMouse.mult(MOUSE_DRAG_STRENGTH);
      entity.applyForce(towardMouse);
    }
  }
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  const pos = createVector(width/2, height/2);
  entities.add(new Vertex(pos));
}

function draw() {
  background(51);
  for (let entity of entities) {
    entity.update(entities);
    entity.show();
  }
}
