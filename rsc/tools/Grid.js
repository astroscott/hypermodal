class Grid {

  constructor(dist_between, main_colour, sym_colour) {
    this.d = dist_between;
    this.mc = [main_colour[0].toString(2).padStart(8, "0"), main_colour[1].toString(2).padStart(8, "0"), main_colour[2].toString(2).padStart(8, "0")];
    this.c = sym_colour;
  }

  draw() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        if ((this.mc[i].charAt(j)) == '1') {
          stroke(this.c[0], this.c[1], this.c[2]);
          rect((width / 2.0) - 3.5 * this.d + j * this.d, (height - 80.0) - i * this.d, 1, 1);
        }
      }
    }
  }

  update(index) {
    this.mc = [
      hm[index].clr.r.toString(2).padStart(8, "0"), 
      hm[index].clr.g.toString(2).padStart(8, "0"), 
      hm[index].clr.b.toString(2).padStart(8, "0")
    ];
    this.c = [hm[index].sym.r, hm[index].sym.g, hm[index].sym.b];
  }
}