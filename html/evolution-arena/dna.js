
const SENSORS = 3;

class Dna {
  constructor() {
    this.sensorAttrs =
      Array(SENSORS).fill(0)
                    .map(_ => new SensorAttr());

  }
}