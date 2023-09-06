class Grid {
  float d;
  float[] x = new float[24];
  float[] y = new float[24];

  String c[];
  Grid(int dist_between, int[] colour) {
    d = dist_between;
    c = new String[] {binary(colour[0], 8), binary(colour[1], 8), binary(colour[2], 8)};
  }

  void update() {
    for (int i = 0; i < 3; i++) {
      for (int j = 0; j < 8; j++) {
        if ((c[i].charAt(j)) == '1') {
          rect((width/2.0) - 3.5*d + j*d, (height-80.0) - i*d, 1, 1);
        }
      }
    }
  }
}
