class Net {
  constructor(points, edges) {
    this.points = points || [];
    this.edges = edges || new Set([]);
  }
  
  getPoint(i) {
    return this.points[i];
  }
  
  addEdge(i, j) {
    if (i >= this.points.length) {
      throw `Net: Index 'i = ${i}' of Net.edges is out of bounds!`;
    }
    
    if (j >= this.points.length) {
      throw `Net: Index 'j = ${j}' of Net.edges is out of bounds!`;
    }
    
    this.edges.add([i, j]);
  }
  
  addPoint(pt) {
    this.points.push(pt);
  }
  
  forEachPoint(fn) {
    this.points.forEach(fn);
  }
  
  forEachEdge(fn) {
    this.edges.forEach(([i, j]) => {
    	let pt_i = this.points[i];
      let pt_j = this.points[j];
      fn(pt_i, pt_j);
    });
  }
}