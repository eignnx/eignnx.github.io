class Matrix {
  constructor(data) {
  	this.data = data;
  	this.rows = data.length;
  	this.cols = data[0].length;
    
    // Allow direct `M[row][col]` syntax.
    for (let row = 0; row < this.rows; row++) {
      this[row] = this.data[row];
    }
  }
  
  static vec(x, y, z) {
    if (z === undefined) {
      return new Matrix([[x], [y]]);
    } else {
      return new Matrix([[x], [y], [z]]);
    }
  }
  
  static Diag(diag) {
    let rows = [];
    for (let i = 0; i < diag.length; i++) {
      let row = Array(diag.length).fill(0);
      row[i] = diag[i];
      rows.push(row);
    }
    return new Matrix(rows);
  }
  
  static I(n, k) {
    if (k !== undefined) {
      return Matrix.Diag(Array(n).fill(k));
    } else {
    	return Matrix.Diag(Array(n).fill(1));
    }
  }
  
	static RotX(theta) {
    return new Matrix([[1,          0,           0],
                       [0, cos(theta), -sin(theta)],
                       [0, sin(theta),  cos(theta)]]);
	}


	static RotY(theta) {
  	return new Matrix([[ cos(theta), 0, sin(theta)],
                       [          0, 1,          0],
                       [-sin(theta), 0, cos(theta)]]);
	}


	static RotZ(theta) {
  	return new Matrix([[cos(theta), -sin(theta), 0],
                       [sin(theta),  cos(theta), 0],
                       [         0,           0, 1]]);
  }
  
  forEachCol(fn) {
    for (let col = 0; col < this.cols; col++) {
      let currentCol = [];
      for (let row = 0; row < this.rows; row++) {
        currentCol.push([this.data[row][col]]);
      }
      fn(new Matrix(currentCol));
    }
  }
  
  mapCols(fn) {
    let res = this.copy();
    
    for (let col = 0; col < this.cols; col++) {
      let currentCol = [];
      
      for (let row = 0; row < this.rows; row++) {
        currentCol.push([this.data[row][col]]);
      }
      
      let newCol = fn(new Matrix(currentCol));
      
      for (let row = 0; row < this.rows; row++) {
        res.data[row][col] = newCol.data[row][0];
      }
    }
    return res;
  }
  
  norm() {
    let sumSq = this.data.reduce((tot, row) =>
                tot + row.reduce((acc, x) =>
								acc + x*x, 0), 0);
    return sqrt(sumSq);
  }
  
  print() {
  	console.log(`${this.rows} x ${this.cols}`);
    console.log("--".repeat(this.cols));
    for (let row of this.data) {
     	console.log(row.join(" "));
    }
    console.log();
  }
  
	map(fn) {
    let res = this.copy();
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        res[row][col] = this[row][col];
      }
    }
    return res;
  }

	timesScalar(k) {
    return this.map(x => x * k);
  }

  times(other) {
    
    if (typeof other === "number") {
      return this.timesScalar(other);
    }
    
    if (this.cols !== other.rows) {
      throw `incompatible matrix sizes 
(${this.rows}x${this.cols}) * (${other.rows}x${other.cols})!`;
    }
    
    let res = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      let row = new Array(other.cols).fill(0);
      for (let j = 0; j < other.cols; j++) {
      	for (let k = 0; k < this.cols; k++) {
          row[j] += this.data[i][k] * other.data[k][j]
        }
      }
      res[i] = row;
    }
    return new Matrix(res);
  }
  
  plus(other) {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw `incompatible matrix sizes 
(${this.rows}x${this.cols}) + (${other.rows}x${other.cols})!`;

    }
    
    let res = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      let row = new Array(other.cols).fill(0);
      for (let j = 0; j < other.cols; j++) {
      	row[j] = this.data[i][j] + other.data[i][j];
      }
      res[i] = row;
    }
    return new Matrix(res);
  }
  
  transposed() {
  }

	copy() {
    let data = [];
    for (let row of this.data) {
      let newRow = [];
      for (let ele of row) {
        newRow.push(ele);
      }
      data.push(newRow);
    }
    return new Matrix(data);
  }
}
