
let canvas;
let pens;

const MIN_PENS = 4;
const MAX_PENS = 6;

const CANVAS_CONTAINER_ID = "canvas-container";

function windowResized() {
  clear();
  resizeCanvas(windowWidth, windowHeight);
  regenerate();
}


function regenerate() {
  pens = new Set([]);
  let max_pens = floor(random(MIN_PENS, MAX_PENS));
  for (let i = 0; i < max_pens; i++) {
    const pos = createVector(random(width), random(height));
    pens.add(new Pen(pos));
  }
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(CANVAS_CONTAINER_ID);
  regenerate();
}

function draw() {
  if (pens.size > 0) {
    for (let pen of pens) {
      pen.update(pens);
      pen.show();
    }
  }
}

function mouseClicked() {
  const mouse = createVector(mouseX, mouseY);
  pens.add(new Pen(mouse));
}

const PEN_MIN_R = 100;
const PEN_MAX_R = 500;

class Pen {
  constructor(pos) {
    this.pos = pos;
    this.r = random(PEN_MIN_R, PEN_MAX_R);
    this.life = PEN_MAX_R - this.r;

    this.c = color(
      random(0, 80),
      random(150, 200),
      random(150, 255),
      1
    );
  }

  update(entities) {
    let delta = p5.Vector.random2D();
    delta.mult(random(this.r/5));
    this.pos.add(delta);
    this.r = constrain(this.r + random(-5, 5), PEN_MIN_R, PEN_MAX_R);
    if (this.life <= 0) {
      entities.delete(this);
    }
    this.life -= 1;
  }

  show() {
    noStroke();
    fill(this.c);
    ellipseMode(CENTER);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }
}
