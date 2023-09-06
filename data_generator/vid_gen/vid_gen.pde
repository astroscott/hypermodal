import com.hamoid.*;
VideoExport videoExport;

// Declare globals
Osc rosc, gosc, bosc;
Grid grid;
int num_nodes, id, framerate = 60;
int[] colour, num_peaks, osc_colour;
float[] frequencies, frequencies_rotational;
float amplitude, radius;
String name;
JSONObject data;

float soundDuration = 20; // in seconds

public void settings() {
  size(300, 420);
}

void setup() {
    if (args != null) {
    // Pull JSON Data:
    int idx = int(args[0]);
    update_data(idx);
    
    // Instantiate oscillators
    rosc = new Osc(amplitude, frequencies[0], frequencies_rotational[0], num_peaks[0], num_nodes, radius, framerate);
    gosc = new Osc(amplitude, frequencies[1], frequencies_rotational[1], num_peaks[1], num_nodes, radius, framerate);
    bosc = new Osc(amplitude, frequencies[2], frequencies_rotational[2], num_peaks[2], num_nodes, radius, framerate);
    grid = new Grid(6, colour);
    
    // Setup sketch
    background(colour[0], colour[1], colour[2]);
    frameRate(framerate);
    rectMode(CENTER);
    
    //Generate oscillators
    rosc.generate(osc_colour);
    gosc.generate(osc_colour);
    bosc.generate(osc_colour);
    
    // Prepare Video
    videoExport = new VideoExport(this, name + ".mp4");
    videoExport.setFrameRate(framerate);
    videoExport.setAudioFileName(name + ".mp3");
    videoExport.startMovie();  
    
    } else {
      print("args == null");
    }
}

void draw() {
  try {
      if (frameCount < 1200) {
      background(colour[0], colour[1], colour[2]);
      rosc.update();
      gosc.update();
      bosc.update();
      grid.update();
      videoExport.saveFrame();
    } else {
      videoExport.endMovie();
      exit();
    }
  } catch(Exception e) {
      print(e);
      exit();
  }
}

void stop() {
}

void update_data(int idx) {
    // Get Hypermode data:
    JSONArray array_data = loadJSONArray("../../rsc/hypermodes.json");
    JSONObject data = array_data.getJSONObject(idx);
    colour = new int[] {data.getJSONObject("clr").getInt("r"), data.getJSONObject("clr").getInt("g"), data.getJSONObject("clr").getInt("b")}; // get hypermode color
    amplitude = data.getFloat("amplitude"); // peak amplitude for each oscillators' peaks.
    frequencies = new float[] {data.getJSONObject("freq").getFloat("r"), data.getJSONObject("freq").getFloat("g"), data.getJSONObject("freq").getFloat("b")}; // oscillation frequency for each oscillator based on color
    frequencies_rotational = new float[] {data.getJSONObject("rfreq").getFloat("r"), data.getJSONObject("rfreq").getFloat("g"), data.getJSONObject("rfreq").getFloat("b")};
    radius = data.getFloat("radius");  // radius of the oscillator curve
    num_peaks = new int[] {data.getJSONObject("num").getJSONObject("peaks").getInt("r"), data.getJSONObject("num").getJSONObject("peaks").getInt("g"), data.getJSONObject("num").getJSONObject("peaks").getInt("b")};   // number of peaks on the oscillator curve
    osc_colour = new int[] {data.getJSONObject("sym").getInt("r"), data.getJSONObject("sym").getInt("g"), data.getJSONObject("sym").getInt("b")};
    num_nodes = data.getJSONObject("num").getInt("nodes"); // number of individual pixels making up the oscillator curve 
    name = data.getString("name");
    id = data.getInt("id");
}
