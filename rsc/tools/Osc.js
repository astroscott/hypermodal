class Osc {

  constructor(amplitude, frequency, rotational_frequency, num_peaks, num_nodes, radius, framerate, waveform, k) {
    this.a = amplitude;                 // [  ] Peak amplitude of oscillator
    this.f = frequency;                 // [Hz] Frequency of oscillator (x/100)
    this.fr = framerate;                // [  ] Frame rate
    this.f_rot = rotational_frequency;  // [Hz] Frequency of oscillator rotation (x/100)
    this.n = num_peaks;                 // [  ] Number of peaks on the oscillator
    this.nn = num_nodes;                // [  ] Number of nodes used to represent the oscillator
    this.r = radius;                    // [Px] Radius of "circle" being circumscribed
    this.nodes = [];
    this.pos = [];
    this.ca = 0;
    this.co = 0;
    this.on = false;
    this.waveform = waveform;
    this.gain_mag = 0;
  }

  generate(sym_colour) {
    for (let i = 0; i < this.nn; i++) {
      this.nodes[i] = new Nodal(sym_colour);
      this.pos[i] = 2 * PI * (i / this.nn);
    } 
  }

  power_on() {
    this.audio_node = audioCtx.createOscillator();
    this.audio_node.type = this.waveform;
    this.audio_node.frequency.setValueAtTime(this.f * 100, audioCtx.currentTime);
    this.audio_node.start();
    this.gain_node = audioCtx.createGain();
    this.audio_node.connect(this.gain_node);
    this.gain_node.gain.setValueAtTime(0.0001, audioCtx.currentTime)
    this.gain_node.connect(audioCtx.destination);
  }

  draw() {
    for (let i = 0; i < this.nn; i++) {
      this.nodes[i].update(this.pos[i], this.a * sin(this.ca), this.co, this.n, this.r);
    }
    this.ca = this.ca + PI * this.f / this.fr;
    this.co = this.co + PI * this.f_rot / this.fr;

    if (this.on) {
      if (this.gain_mag <= 0.333) { 
        this.gain_mag += 0.0125;
      }
      this.gain_node.gain.linearRampToValueAtTime(this.gain_mag * abs(sin(this.ca)), audioCtx.currentTime + .04);
    }
  }

  update(index, channel) {
    this.nodes = [];
    this.pos = [];
    this.ca = 0;
    this.co = 0;
    this.a = hm[index].amplitude;
    this.f = hm[index].freq[channel];
    this.f_rot = hm[index].rfreq[channel];
    this.nn = hm[index].num.nodes
    this.n = hm[index].num.peaks[channel];
    let sym_colour = [hm[index].sym.r, hm[index].sym.g, hm[index].sym.b];
    this.r = hm[index].radius;
    this.generate(sym_colour);
  }

  turn_on(freq) {
    this.audio_node.frequency.linearRampToValueAtTime(this.check_zeros(freq), audioCtx.currentTime + .5);
    this.on = true;
  }

  turn_off() {
    this.on = false;
    this.gain_node.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + .1);
    this.gain_mag = 0;
  }

  check_zeros(anum) {
      if (anum == 0) {
          return 0.001;
      } else {
          return anum;
      }
  }

}