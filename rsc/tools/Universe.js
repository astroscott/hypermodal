let plot = document.getElementById('plot');
let labels = [];
let req;
let p = { "x": [], "y": [], "z": [], "colors": [], "id": [], "labels": [] }

// Generate plot
if (/Mobi|Android/i.test(navigator.userAgent)) {
    // If mobile, do no plot.
} else {
    d3.json('rsc/hypermodes.json', function (err, data) {
        for (let i = 0; i < data.length; i++) {
            p.x[i] = data[i].clr.r
            p.y[i] = data[i].clr.g
            p.z[i] = data[i].clr.b
            p.colors[i] = "#" + data[i].clr.hex;
            p.id[i] = data[i].id
            p.labels[i] = data[i].name
        }

        let plot_data = [
            {
                title: p.colors,
                x: p.x,
                y: p.y,
                z: p.z,
                type: 'scatter3d',
                mode: 'markers',
                marker: {
                    size: '2',
                    color: p.colors,
                    line: {
                        color: "#000000",
                        width: 1
                    }
                },
                selected: {
                    marker: {
                        size: '5'
                    }
                },
                text: p.labels,
                hoverinfo: "text",
                hoverlabel: { bgcolor: p.colors },
                hovertemplate: "%(text)" + "<extra></extra>",
            }
        ];

        let layout = {
            scene: {
                xaxis: { visible: false, showgrid: false, zeroline: false, showline: false },
                yaxis: { visible: false, showgrid: false, zeroline: false, showline: false },
                zaxis: { visible: false, showgrid: false, zeroline: false, showline: false },
                camera: { eye: { x: 1.5, y: 1.5, z: 1.0 } }
            },
            paper_bgcolor: "#0E1012",
            margin: { t: 0, r: 0, b: 0, l: 0 },
        };

        let config = { responsive: true };

        Plotly.newPlot(plot, plot_data, layout, config);

        window.onresize = function () {
            if (window.matchMedia("(min-width: 1100px)").matches) {
                Plotly.Plots.resize(plot);
            }
        };

        // Interaction:
        plot.on('plotly_click', function (data) {
            let i = data.points[0].pointNumber
            Tools.update_ui(i);
            stop(req);
        });

        req = run();
    });

}

// Event Handlers:
document.getElementById('plot').addEventListener('wheel', function (e) {
    stop(req);
});

document.getElementById('plot').addEventListener('mousedown', function (e) {
    stop(req);
});

// Function definitions:
function unpack(rows, key) {
    return rows.map(function (row) {
        return row[key];
    });
};

function run() {
    rot('scene', Math.PI / 5000);
    req = requestAnimationFrame(run);
    return req;
}

function stop(req) {
    cancelAnimationFrame(req);
}

function rot(id, angle) {
    var eye0 = plot.layout[id].camera.eye
    var rtz = xyz2rtz(eye0);
    rtz.t += angle;

    var eye1 = rtz2xyz(rtz);
    Plotly.relayout(plot, id + '.camera.eye', eye1)
}

function xyz2rtz(xyz) {
    return {
        r: Math.sqrt(xyz.x * xyz.x + xyz.y * xyz.y),
        t: Math.atan2(xyz.y, xyz.x),
        z: xyz.z
    };
}

function rtz2xyz(rtz) {
    return {
        x: rtz.r * Math.cos(rtz.t),
        y: rtz.r * Math.sin(rtz.t),
        z: rtz.z
    };
}