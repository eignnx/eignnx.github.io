const FRICTION = 0.01;
const RAD_RANGE = [10, 30];
const RESTITUTION = 0.9;

function componentsAlong(v, axis) {
  let scalar = (v.dot(axis) / axis.dot(axis))
  let proj = p5.Vector.mult(axis, scalar);
  let rej = p5.Vector.sub(v, proj);
  return [proj, rej];
}

class Tonk {

  constructor(pos, dna) {
    this.type = "Tonk";

    this.rad = random(...RAD_RANGE);
    
    this.pos = pos;
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.mass = PI * sq(this.rad);

    this.theta = random(TAU);
    this.omega = random(-0.01,0.01);
    this.alpha = 0;
    this.moment = 1/2 * this.mass * sq(this.rad);

    this.color = color(random(100, 150), random(50, 150), random(100, 200));

    this.sensors = Array(3)
      .fill(0)
      .map(i => new Sensor(new SensorAttr()));

    this.dna = dna || undefined;
  }

  momentum() {
    return p5.Vector.mult(this.vel, this.mass);
  }

  applyForce(f) {
    this.acc.add(p5.Vector.div(f, this.mass));
  }

  applyTorque(t) {
    this.alpha += t / this.moment;
  }

  bounceOnEdges() {
    let [x, y] = [this.pos.x, this.pos.y];
    let [vx, vy] = [this.vel.x, this.vel.y];
    if (this.pos.x > width - this.rad) {
      this.pos.set(width - this.rad, y);
      this.vel.set(-vx * RESTITUTION, vy);
    }
    if (this.pos.y > height - this.rad) {
      this.pos.set(x, height - this.rad);
      this.vel.set(vx, -vy * RESTITUTION);
    }
    if (this.pos.x < this.rad) {
      this.pos.set(this.rad, y);
      this.vel.set(-vx * RESTITUTION, vy);
    }
    if (this.pos.y < this.rad) {
      this.pos.set(x, this.rad);
      this.vel.set(vx, -vy * RESTITUTION);
    }
  }

  physics() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.omega += this.alpha;
    this.theta += this.omega;
    this.theta %= TAU;
    this.alpha = 0;
  }

  friction(mu) {
    this.vel.mult(1 - mu);
    // this.omega *= (1 - mu);
  }

  update(entities) {
    this.friction(FRICTION);
    this.resolveCollisions(entities);
    this.physics();
  }

  resolveCollisions(entities) {
    this.bounceOnEdges();
    entities.forEach(other => {
      if (other === this) return;
      switch (other.type) {
        case "Tonk":
          let d = this.pos.dist(other.pos);
          if (d < this.rad + other.rad) {

            this.resolveCollision(other);
          }
          break;
      }
    });
  }

  setMomentum(p) {
    p.div(this.mass);
    this.vel.set(p);
  }

  resolveCollision(other) {
    let axis = p5.Vector.sub(this.pos, other.pos);
    let overlap = this.rad + other.rad - axis.mag();
    axis.setMag(overlap);

    let p_a = this.momentum();
    let p_b = other.momentum();
    let [p_a_par, p_a_perp] = componentsAlong(p_a, axis);
    let [p_b_par, p_b_perp] = componentsAlong(p_b, axis);

    p_a_par.mult(RESTITUTION);
    p_b_par.mult(RESTITUTION);

    // Swap their parallel momentum components.
    p_a = p5.Vector.add(p_b_par, p_a_perp);
    p_b = p5.Vector.add(p_a_par, p_b_perp);

    this.setMomentum(p_a);
    other.setMomentum(p_b);

    // Push them apart so they're no longer touching.
    this.pos.add(axis);
  }

  relativePolar(absPos) {
    let diff = p5.Vector.sub(absPos, this.pos);
    let angle = diff.heading() - this.theta;
    let distance = diff.mag();
    return [angle, distance];
  }

  show() {
    push();
    strokeWeight(2);
    stroke(255);
    fill(this.color);
    translate(this.pos.x, this.pos.y);
    rotate(this.theta);
    ellipseMode(CENTER);
    ellipseMode(RADIUS);
    ellipse(0, 0, this.rad);
    line(0, 0, this.rad, 0); // Heading line

    if (DEBUG) {
      this.sensors.forEach(sensor => {
        sensor.show();
        noStroke();
        fill(200, 0, 0, 50);
        let mouseCart = createVector(mouseX, mouseY);
        let mousePolar = this.relativePolar(mouseCart);
        if (sensor.senses(...mousePolar)) {
          let r = sensor.attr.radius;
          ellipse(0, 0, r, r);
        }
      });
    }
    pop();
  }
}