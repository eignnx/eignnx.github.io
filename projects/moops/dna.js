const ATTR_MIN = 0;
const ATTR_MAX = 2;
const ATTR_NUDGE = 0.1;

class Dna {
  constructor(fear, carnivorism, speed) {
    this.fear = fear || random(ATTR_MIN, ATTR_MAX);
    this.carnivorism = carnivorism || random(ATTR_MIN, ATTR_MAX);
    this.speed = speed || random(ATTR_MIN, ATTR_MAX);
    this.setColor();
  }

  setColor() {
    this.col = color(
      map(this.carnivorism, ATTR_MIN, ATTR_MAX, 10, 255), // RED
      map(ATTR_MAX - this.carnivorism, ATTR_MIN, ATTR_MAX, 10, 255), // GREEN
      map(this.fear, ATTR_MIN, ATTR_MAX, 10, 255) // BLUE
    );
  }

  clone() {
    return new Dna(
      this.fear,
      this.carnivorism,
      this.speed
    );
  }

  mutate() {
    this.fear = clampedRandomNudge(this.fear);
    this.carnivorism = clampedRandomNudge(this.carnivorism);
    this.speed = clampedRandomNudge(this.speed);
  }
}

function clampedRandomNudge(x) {
  return constrain(
    x + random(-ATTR_NUDGE, ATTR_NUDGE),
    ATTR_MIN,
    ATTR_MAX
  );
}