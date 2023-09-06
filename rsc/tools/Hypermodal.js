// Globals
let audioCtx, hypercanvas, idx, hm, analysis, colour, rosc, gosc, bosc, grid;
let osc0, osc1, os2;
let gesture = false;
let rec = false;

// Load data table
function preload() {
    hm = loadJSON('rsc/hypermodes.json')
    analysis = loadJSON('rsc/analysis.json')
}

function setup() {
    let c;
    // Check for specific hypermodal search request in URL
    params = new URLSearchParams(document.location.search);
    if (params.get("id")) {
        idx = params.get("id");
        console.log("hm = ", idx)
    } else {
        idx = round(random() * (analysis.num - 1)); // otherwise display random
    }
    if (params.get("rec")) {
        rec = true;
        console.log("record = ", rec)
    }

    // Initialize DOM and vars
    hypercanvas = createCanvas(300, 420);
    hypercanvas.parent('viewer');
    let frame_rate = 60;


    // Get initial JSON data
    amplitude = hm[idx].amplitude;
    colour = [hm[idx].clr.r, hm[idx].clr.g, hm[idx].clr.b];
    frequencies = [hm[idx].freq.r, hm[idx].freq.g, hm[idx].freq.b];
    frequencies_rotational = [hm[idx].rfreq.r, hm[idx].rfreq.g, hm[idx].rfreq.b];
    num_nodes = hm[idx].num.nodes;
    num_peaks = [hm[idx].num.peaks.r, hm[idx].num.peaks.g, hm[idx].num.peaks.b];
    sym_colour = [hm[idx].sym.r, hm[idx].sym.g, hm[idx].sym.b];;
    radius = hm[idx].radius;


    // Instantiate oscillators
    rosc = new Osc(amplitude, frequencies[0], frequencies_rotational[0], num_peaks[0], num_nodes, radius - 4, frame_rate, 'sine');
    gosc = new Osc(amplitude, frequencies[1], frequencies_rotational[1], num_peaks[1], num_nodes, radius, frame_rate, 'sine');
    bosc = new Osc(amplitude, frequencies[2], frequencies_rotational[2], num_peaks[2], num_nodes, radius + 4, frame_rate, 'sine');
    grid = new Grid(6, colour, sym_colour);

    // Setup sketch
    background(colour[0], colour[1], colour[2]);
    frameRate(frame_rate);
    rectMode(CENTER);

    // Update the UI
    Tools.update_ui(idx);
}

function draw() {
    background(colour[0], colour[1], colour[2]);
    rosc.draw();
    gosc.draw();
    bosc.draw();
    grid.draw();
    if (rec && frameCount < 150) {
        saveCanvas(hypercanvas, String(frameCount).padStart(6, '0') + ".png")
    } else if (rec) {
        document.getElementById("id").textContent = "recording_complete"
        noLoop();
    }
}

// Event Handlers:
document.getElementById("search").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        Tools.search_update();
    }
});

mute_button = document.getElementById("mute_button");
mute_button.addEventListener("click", function (event) {
    if (gesture == false) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        rosc.power_on();
        gosc.power_on();
        bosc.power_on();
        gesture = true;
    }

    if (mute_button.classList.contains("muted")) {
        mute_button.classList.remove("muted");
        mute_button.classList.add("unmuted");
        mute_button.src = "rsc/img/unmuted.svg";
        Tools.play_sound();

    } else {
        mute_button.classList.remove("unmuted");
        mute_button.classList.add("muted");
        mute_button.src = "rsc/img/muted.svg";
        Tools.stop_sound();
    }
});

info_icn = document.getElementById("info_icn");
stats = document.getElementById("stats")
info_icn.addEventListener("click", function(event) {
    if (stats.classList.contains("hidden")) {
        stats.classList.remove("hidden");
        stats.classList.add("displayed");

    } else {
        stats.classList.remove("displayed");
        stats.classList.add("hidden");
    }
});