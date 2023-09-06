class Node {
  float x, y, a, n, t;
  int[] c = new int[3];

  Node(int[] colour) {
    c = colour;
  }

  void update(float t, float a, float offset, float n, float r) {
    stroke(c[0], c[1], c[2]);
    x = width/2 + ((r + a*sin(n*t+offset)) * cos(t));
    y = height/3 + ((r + a*sin(n*t+offset)) * sin(t));
    circle(x, y, 1);
  }
}
