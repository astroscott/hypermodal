class Osc {
  float a, f, f_rot, r;
  float ca = 0; // "current amplitude" (counter used for cyclic oscillation animation).
  float co = 0; // "current offset" (counter used for cyclic rotation animation).
  int fr, n, nn, k;
  int[] c = new int[3];
  float[] pos;
  Node[] nodes;

  Osc(float amplitude, float frequency, float rotational_frequency, int num_peaks, int num_nodes, float radius, int framerate) {
    a = amplitude;                 // [  ] Peak amplitude of oscillator
    f = frequency;                 // [Hz] Frequency of oscillator
    fr = framerate;                // [  ] Frame rate
    f_rot = rotational_frequency;  // [Hz] Frequency of oscillator rotation
    n = num_peaks;                 // [  ] Number of peaks on the oscillator
    nn = num_nodes;                // [  ] Number of nodes used to represent the oscillator
    r = radius;                    // [PX] Radius of "circle" being circumscribed
    pos = new float[nn];
    nodes = new Node[nn];
  }

  void generate(int[] colour) {
    this.c = colour;
    for (int i = 0; i<nn; i++) {
      nodes[i] = new Node(this.c);
      pos[i] = 2*PI*(float(i)/float(nn));
    }
  }

  void update() {
    for (int i = 0; i<nn; i++) {
      nodes[i].update(pos[i], a*sin(this.ca), this.co, n, r);
    }
    this.ca = this.ca + PI*f/60;
    this.co = this.co + PI*f_rot/60;
  }
}
