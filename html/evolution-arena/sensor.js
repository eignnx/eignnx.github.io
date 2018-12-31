const SENSOR_AREA = 10000;

function mod(x) {
  return (x + 2*TAU) % TAU;
}

class SensorAttr {
  constructor() {
    this.start = random(TAU);
    this.end = this.start + random(0.1, TAU);
    let totalAngle = mod(this.end - this.start);
    this.radius = sqrt(2 * SENSOR_AREA / totalAngle);
  }
}


class Sensor {
  constructor(attr) {
    this.attr = attr;
  }

  senses(angle, distance) {
    let {radius, start, end} = this.attr;
    angle = mod(angle - start);
    start = mod(start);
    end = mod(end);

    if (distance > radius) return false;

    if (start < end) {
      return start < angle && angle < end;
    }

    if (start > end) {
      if (angle > start && angle > end) {
        return true;
      }
      if (angle < start && angle < end) {
        return true;
      }
    }

    return false;
  }

  show() {
    push();
    noStroke();
    fill(255, 20);
    rotate(this.attr.start);
    arc(
      0, 0,
      this.attr.radius, this.attr.radius,
      this.attr.start, this.attr.end,
      PIE
    );
    pop();
  }
}
