const screenSize = [600, 500];
const SCALE = 0.5;
const INITIAL_POP = 50;

const MOOP_HEALTH = 100;
const MOOP_DEATH_RATE = 0.05;
const MOOP_MAX_SPEED = 1.5;
const MOOP_FORCE_SCALE = 0.5;
const MOOP_STEAL_PENTALTY = 0.95;
const MOOP_REPRODUCTION_RATE = 0.001;
const NUTRITIONAL_BENEFIT = 3;

const FOOD_STD_DEV = 75;

let foodSpawnRateSlider;
let moops_alive = INITIAL_POP;

/*
Moops chase food when they're hungry, chase larger moops to
steal some of their health, and run away from smaller moops.

Moop DNA has three components: fear, speed, and carnivorism.
*/

let entities = new Set([]);
let screenCenter;

function gaussianVector() {
  let v;
  do {
    v = createVector(
      randomGaussian(width / 2, FOOD_STD_DEV),
      randomGaussian(height / 2, FOOD_STD_DEV)
    );
  } while (v.x < 0 || v.x > width || v.y < 0 || v.y > width);
  return v;
}

function setup() {
  createCanvas(...screenSize);
  let screenCenter = createVector(width / 2, height / 2);
  foodSpawnRateSlider = createSlider(0, 0.5, 0.25, 0.001);

  Array(10).fill().forEach(() => {
    entities.add(new Food(gaussianVector()));
  });

  Array(INITIAL_POP).fill().forEach(() => {
    let pos = createVector(random(width), random(height));
    entities.add(new Moop(pos));
  });
}

function draw() {
  let foodSpawnRate = foodSpawnRateSlider.value();
  background(5, sq(foodSpawnRate) * 150, 20);
  if (random() < foodSpawnRate) {
    entities.add(new Food(gaussianVector()));
  }
  entities.forEach(entity => {
    entity.update(entities);
    entity.show();
  });
}

function mouseClicked() {
  let pos = createVector(mouseX, mouseY);
  if (pos.y < height) { // Don't spawn when clicking below canvas.
    entities.add(new Moop(pos));
    console.log(++moops_alive);
  }
}