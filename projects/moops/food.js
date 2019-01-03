class Food {
  constructor(pos, nutrition) {
    this.type = "Food";
    this.nutrition = nutrition || random(1, 5);
    
    this.pos = pos;
    this.col = color(random(50), random(100, 150), 70);
    this.rad = SCALE * sqrt(this.nutrition) * 3;
    this.rot = random(TAU);
  }
  
  update(entities) {}
  
  show() {
    noStroke();
    fill(this.col);
    const [x, y, r] = [this.pos.x, this.pos.y, this.rad];
    push();
    translate(x, y);
    rotate(this.rot);
    triangle(
       0, -r,
      -r, r,
       r,  r
    );
    pop();
  }
}