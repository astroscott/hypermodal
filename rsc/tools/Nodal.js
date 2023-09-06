class Nodal {

  constructor(sym_colour) {
    this.c = sym_colour;
    this.x;
    this.y;
  }

  update(t, a, offset, n, r) {
    stroke(this.c[0], this.c[1], this.c[2]);
    this.x = width / 2 + ((r + a * Math.sin(n * t + offset)) * Math.cos(t));
    this.y = height / 3 + ((r + a * Math.sin(n * t + offset)) * Math.sin(t));
    circle(this.x, this.y, 1);
  }
}