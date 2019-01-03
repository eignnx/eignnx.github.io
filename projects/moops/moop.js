class Moop {
  constructor(pos, dna) {
    this.type = "Moop";

    this.pos = pos;
    this.vel = p5.Vector.random2D();
    this.vel.mult(1);
    this.acc = createVector(0, 0);

    this.health = MOOP_HEALTH * random();
    this.rad = SCALE * sqrt(this.health);

    this.dna = dna || new Dna();
  }

  edgeWrap() {
    if (this.pos.x - this.rad > width)
      this.pos.x = -this.rad;
    if (this.pos.x + this.rad < 0)
      this.pos.x = width + this.rad;
    if (this.pos.y - this.rad > height)
      this.pos.y = -this.rad;
    if (this.pos.y + this.rad < 0)
      this.pos.y = height + this.rad;
  }
  
  edgeRepel() {
    const MARGIN = 30; // px
    const FACTOR = 0.05;
    if (this.pos.x < MARGIN) {
      let fx = FACTOR * (MARGIN - this.pos.x);
      this.applyForce(createVector(fx, 0));
    }
    if (this.pos.x > width - MARGIN) {
      let fx = FACTOR * (width - MARGIN - this.pos.x);
      this.applyForce(createVector(fx, 0));
    }
    if (this.pos.y < MARGIN) {
      let fy = FACTOR * (MARGIN - this.pos.y);
      this.applyForce(createVector(0, fy));
    }
    if (this.pos.y > height - MARGIN) {
      let fy = FACTOR * (height - MARGIN - this.pos.y);
      this.applyForce(createVector(0, fy));
    }
  }

  applyForce(f) {
    this.acc.add(f);
  }

  friction() {
    this.vel.mult(0.9);
  }

  physics() {
    //this.edgeWrap();
    this.edgeRepel();
    this.vel.add(this.acc);
    this.vel.limit(MOOP_MAX_SPEED * this.dna.speed);
    this.pos.add(this.vel);
    this.friction();
    this.acc.mult(0);
  }

  update(entities) {
    this.collide(entities);
    this.physics();

    this.seek(entities);
    this.checkLife(entities);
    this.maybeReproduce(entities);
  }

  checkLife(entities) {
    this.health -= MOOP_DEATH_RATE * this.dna.speed;
    this.rad = SCALE * sqrt(max(this.health, 0));
    if (this.health <= random(5)) {
      entities.delete(this);
      entities.add(new Food(this.pos, this.health));
      console.log(--moops_alive);
    }
  }

  maybeReproduce(entities) {
    if (this.health > MOOP_HEALTH * 1.1) {
      //if (random() < MOOP_REPRODUCTION_RATE) {
      let half = this.health / 2;
      this.health /= 2;
      let nudge = p5.Vector.random2D();
      nudge.mult(this.rad * 2);
      let childPos = p5.Vector.add(this.pos, nudge);

      let childDna = this.dna.clone();
      childDna.mutate();

      let child = new Moop(childPos, childDna);
      child.health = half;
      entities.add(child);
      console.log(++moops_alive);
    }
  }

  show() {
    noStroke();
    fill(this.dna.col);
    ellipseMode(CENTER);
    ellipseMode(RADIUS);
    ellipse(this.pos.x, this.pos.y, this.rad, this.rad);
  }

  collide(entities) {
    entities.forEach(entity => {
      if (this === entity) return;
      switch (entity.type) {
        case "Food":
          if (this.touchingCircle(entity)) {
            this.health += NUTRITIONAL_BENEFIT * entity.nutrition;
            entities.delete(entity);
          }
          break;
        case "Moop":
          if (this.health < entity.health && this.touchingCircle(entity)) {
            const stealFactor = this.dna.carnivorism / ATTR_MAX;
            const stolen = stealFactor * entity.health;
            entity.health -= stolen;
            this.health += stolen * MOOP_STEAL_PENTALTY;
          }
          break;
      }
    });
  }

  touchingCircle(entity) {
    const d = this.pos.dist(entity.pos);
    return d <= this.rad + entity.rad;
  }

  seek(entities) {
    let heading = createVector(0, 0);
    entities.forEach(entity => {
      if (entity === this) return;
      let v;
      switch (entity.type) {
        case "Food":
          v = p5.Vector.sub(entity.pos, this.pos);
          v.div(sq(sq(v.mag())) + 0.1);
          v.mult(sq(ATTR_MAX - this.dna.carnivorism));
          v.mult(30);
          heading.add(v);
          break;
        case "Moop":
          v = p5.Vector.sub(this.pos, entity.pos);
          v.setMag(v.mag() - this.rad - entity.rad);
          v.div(sq(v.mag()) + 1);
          if (this.health < entity.health) {
            v.mult(-sq(this.dna.carnivorism)); // Go toward them!
          } else {
            v.mult(sq(this.dna.fear)); // Run away!
          }
          heading.add(v);

          break;
      }
    });

    heading.normalize();
    heading.mult(MOOP_FORCE_SCALE);
    heading.div(0.01 + this.health / MOOP_HEALTH);
    this.applyForce(heading);
  }
}