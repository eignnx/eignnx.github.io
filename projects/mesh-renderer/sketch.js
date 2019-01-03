const projection = new Matrix([
  [1, 0, 0],
  [0, 1, 0]
]);

let fov;
let camDist;
let scale_;

let cube;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  let container = select("#container");
  canvas.parent(container);

  let fovDiv = createDiv("");
  let fovP = createP("Field of View");
  fovP.parent(fovDiv);
  fov = createSlider(0, 100, 50, 0.1);
  fov.parent(fovDiv);
  fovDiv.parent(container);

  let camDistDiv = createDiv("");
  let camDistP = createP("Camera Distance");
  camDistP.parent(camDistDiv);
  camDist = createSlider(0, 10, 5, 0.1);
  camDist.parent(camDistDiv);
  camDistDiv.parent(container);

  let scaleDiv = createDiv("");
  let scaleP = createP("Scene Scale");
  scaleP.parent(scaleDiv);
  scale_ = createSlider(0.5, 5, 3, 0.1);
  scale_.parent(scaleDiv);
  scaleDiv.parent(container);

  cube = initializeCube(0, 0, 50, 100);
}

function drawNet(net) {
  const mx = -mouseX / width;
  const my = -mouseY / height;
  const t = TAU * frameCount / 600;

  const X = Matrix.RotX(TAU * mx + t);
  const Y = Matrix.RotY(TAU * my + t);
  const Z = Matrix.RotZ(t);

  const rotation = [X, Y, Z].reduce((acc, cur) => cur.times(acc));

  let into2D = pt3D => {
    const rotated = rotation.times(pt3D);
    const d = rotated[2][0] / fov.value() + camDist.value();
    const scale_ = Matrix.I(3, 1/d);
    const proj = projection.times(scale_);
    //proj.print();
    const pt2D = proj.times(rotated);

    const x = pt2D.data[0][0];
    const y = pt2D.data[1][0];
    return [x, y];
  };

  net.forEachPoint(pt3D => {
    stroke(0);
    strokeWeight(8);
    point(...into2D(pt3D));
  });

  net.forEachEdge((pt1, pt2) => {
  	stroke(0);
    strokeWeight(2);
    let [x1, y1] = into2D(pt1);
    let [x2, y2] = into2D(pt2);
    line(x1, y1, x2, y2);
  });
}

function initializeCube(x, y, z, w) {
  const shape = new Matrix([
    //0 1  2  3  4  5  6  7
    [0, w, w, 0, 0, w, w, 0],
    [0, 0, w, w, 0, 0, w, w],
    [0, 0, 0, 0, w, w, w, w]
  ]);

  const origin = Matrix.vec(x, y, z);

  const shifted = shape.mapCols(col => {
    return col.plus(origin);
  });

  let net = new Net();
  shifted.forEachCol(col => net.addPoint(col));

  // Face 1
  net.addEdge(0, 1);
  net.addEdge(1, 2);
  net.addEdge(2, 3);
  net.addEdge(3, 0);

  // Face 2
  net.addEdge(4, 5);
  net.addEdge(5, 6);
  net.addEdge(6, 7);
  net.addEdge(7, 4);

  // Connect faces
  net.addEdge(0, 4);
  net.addEdge(1, 5);
  net.addEdge(2, 6);
  net.addEdge(3, 7);

  return net;
}

function draw() {
  background(220);
  translate(width / 2, height / 2);
  scale(scale_.value());
  drawNet(cube);
}
