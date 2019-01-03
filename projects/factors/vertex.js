const REPULSION_STRENGTH = 100;
const ATTRACTION_STRENGTH = 0.01;
const CHILD_REPULSION_FORCE = 5;
const CENTER_SEEK_STRENGTH = 0.0001;

class Vertex {
  constructor(pos, vel) {
    this.pos = pos;
    this.vel = vel || p5.Vector.mult(p5.Vector.random2D(), random(1));
    this.acc = createVector(0, 0);
    this.col = color(random(100, 200), random(100, 200), random(100, 200));
    this.rad = random(10, 20);
    this.neighbors = new Set([]);
  }

  makeNeighbors(other) {
    this.neighbors.add(other);
    other.neighbors.add(this);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  applyFriction() {
    this.vel.mult(0.97);
  }

  update(entities) {
    this.processEntities(entities);
    this.seekCenter();
    this.applyFriction();

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    push();
    this.drawConnections(entities);
    fill(this.col);
    if (this.touchingMouse()) {
      stroke(255);
      strokeWeight(3);
    } else {
      noStroke();
    }
    ellipseMode(CENTER);
    ellipseMode(RADIUS);
    ellipse(this.pos.x, this.pos.y, this.rad, this.rad);
    pop();
  }

  touchingMouse() {
    const mouse = createVector(mouseX, mouseY);
    const diff = mouse.sub(this.pos);
    return diff.mag() <= this.rad;
  }

  seekCenter() {
    const center = createVector(width/2, height/2);
    const towardCenter = p5.Vector.sub(center, this.pos);
    towardCenter.mult(CENTER_SEEK_STRENGTH);
    this.applyForce(towardCenter);
  }

  drawConnections(entities) {
    for (let entity of entities) {
      if (this.neighbors.has(entity)) {
        const diff = p5.Vector.sub(this.pos, entity.pos);
        const thickness = constrain(100 / (1 + diff.mag()), 1, 10);
        stroke(255);
        strokeWeight(thickness);
        line(this.pos.x, this.pos.y, entity.pos.x, entity.pos.y);
      }
    }
  }

  processEntities(entities) {
    for (let other of entities) {
      this.repel(other, entities.size);
      if (this.neighbors.has(other)) {
        this.attract(other);
      }
    }
  }

  repel(other, n) {
    const away = p5.Vector.sub(this.pos, other.pos);
    away.setMag(REPULSION_STRENGTH / n / (away.mag() + 1));
    this.applyForce(away);
  }

  attract(other) {
    const toward = p5.Vector.sub(other.pos, this.pos);
    toward.mult(ATTRACTION_STRENGTH);
    this.applyForce(toward);
  }

  split(entities) {
    const acc = p5.Vector.random2D();
    acc.mult(CHILD_REPULSION_FORCE);
    const antiAcc = acc.copy();
    antiAcc.mult(-1);

    const pos = this.pos.copy();
    const r = p5.Vector.random2D();
    r.mult(this.rad / 2);
    pos.add(r);
    const child = new Vertex(pos);
    this.makeNeighbors(child);

    this.applyForce(acc);
    child.applyForce(antiAcc);

    entities.add(child);
  }
}
