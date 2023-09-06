class Tools {

    static update_ui(index) {
        try {
            colour = [hm[index].clr.r, hm[index].clr.g, hm[index].clr.b];
            sym_colour = hm[index].sym.r;
            num_peaks = [hm[index].num.peaks.r, hm[index].num.peaks.g, hm[index].num.peaks.b];
            document.getElementById("search").value = "";
            document.getElementById("search").placeholder = hm[index].id.toString().padStart(5, "0")
            document.getElementById("id").innerHTML = hm[index].name

            rosc.update(index, "r");
            gosc.update(index, "g");
            bosc.update(index, "b");
            grid.update(index);
            this.update_stats(index, colour, sym_colour, num_peaks);
            this.play_sound(colour);

        } catch (e) {
            document.getElementById("search").value = "";
            document.getElementById("search").placeholder = "No result.";
            console.log(e)
        }
    }

    static search_update() {
        try {
            stop(req);
            let index = document.getElementById("search").value;
            index = parseInt(index, 10);
            colour = [hm[index].clr.r, hm[index].clr.g, hm[index].clr.b];
            sym_colour = hm[index].sym.r;
            num_peaks = [hm[index].num.peaks.r, hm[index].num.peaks.g, hm[index].num.peaks.b];
            document.getElementById("search").placeholder = hm[index].id.toString().padStart(5, "0");
            document.getElementById("id").innerHTML = hm[index].name
            document.getElementById("search").value = "";

            rosc.update(index, "r");
            gosc.update(index, "g");
            bosc.update(index, "b");
            grid.update(index);
            this.update_stats(index, colour, sym_colour, num_peaks);
            this.play_sound(colour);

        } catch (e) {
            document.getElementById("search").value = "";
            document.getElementById("search").placeholder = "No result.";
            console.log(e)
        }
    }

    static update_stats(idx, clr, sym_clr, np) {
        let sym_label, expanded_sym_label;;
        if (sym_clr == 0) {
            sym_label = "blk"
            expanded_sym_label = "black"
        } else if (sym_clr == 255) {
            sym_label = "wht"
            expanded_sym_label = "white"
        }

        let r_counts = analysis.r_counts[clr[0]];
        let r_rarity = round(analysis.r_rarity[clr[0]] * 100, 3)
        let g_counts = analysis.g_counts[clr[1]];
        let g_rarity = round(analysis.g_rarity[clr[1]] * 100, 3);
        let b_counts = analysis.b_counts[clr[2]];
        let b_rarity = round(analysis.b_rarity[clr[2]] * 100, 3);
        let rp_counts = analysis.rp_counts[np[0]];
        let rp_rarity = round(analysis.rp_rarity[np[0]] * 100, 3);
        let gp_counts = analysis.gp_counts[np[1]];
        let gp_rarity = round(analysis.gp_rarity[np[1]] * 100, 3);
        let bp_counts = analysis.bp_counts[np[2]];
        let bp_rarity = round(analysis.bp_rarity[np[2]] * 100, 3);
        let sym_counts = analysis.sym_counts[sym_clr];
        let sym_rarity = round(analysis.sym_rarity[sym_clr] * 100, 3);
        let std_scr = round(analysis.zscores[idx], 3)
        let tot = round(analysis.rscores[idx], 3)

        document.getElementById("r_rarity").innerHTML = "r: " + clr[0].toString().padStart(3, "0") + " (" + r_rarity + "%)";
        document.getElementById("r_rarity_desc").title = r_counts + " hypermodes (" + r_rarity + "%) " + "have a red channel intensity of " + clr[0];

        document.getElementById("g_rarity").innerHTML = "g: " + clr[1].toString().padStart(3, "0") + " (" + g_rarity + "%)";
        document.getElementById("g_rarity_desc").title = g_counts + " hypermodes (" + g_rarity + "%) " + "have a green channel intensity of " + clr[1];

        document.getElementById("b_rarity").innerHTML = "b: " + clr[2].toString().padStart(3, "0") + " (" + b_rarity + "%)";
        document.getElementById("b_rarity_desc").title = b_counts + " hypermodes (" + b_rarity + "%) " + "have a blue channel intensity of " + clr[2];

        document.getElementById("rp_rarity").innerHTML = "rp: " + np[0] + " (" + rp_rarity + "%)";
        document.getElementById("rp_rarity_desc").title = rp_counts + " hypermodes (" + rp_rarity + "%) " + "have " + np[0] + " peaks on the red channel oscillator.";

        document.getElementById("gp_rarity").innerHTML = "gp: " + np[1] + " (" + gp_rarity + "%)";
        document.getElementById("gp_rarity_desc").title = gp_counts + " hypermodes (" + gp_rarity + "%) " + "have " + np[1] + " peaks on the green channel oscillator.";

        document.getElementById("bp_rarity").innerHTML = "bp: " + np[2] + " (" + bp_rarity + "%)";
        document.getElementById("bp_rarity_desc").title = bp_counts + " hypermodes (" + bp_rarity + "%) " + "have " + np[2] + " peaks on the blue channel oscillator.";

        document.getElementById("sym_rarity").innerHTML = "sym: " + sym_label + " (" + sym_rarity + "%)";
        document.getElementById("sym_rarity_desc").title = sym_counts + " hypermodes (" + sym_rarity + "%) " + "have " + expanded_sym_label + " symbols (fill/stroke).";

        document.getElementById("std").innerHTML = "std_scr: " + round(std_scr, 3) + "&sigma;";
        document.getElementById("tot").innerHTML = "rty_scr: " + tot;

        document.getElementById("rsq").style.backgroundColor = "rgba(" + 255 + "," + 0 + "," + 0 + "," + clr[0] / 255 + ")"
        document.getElementById("gsq").style.backgroundColor = "rgba(" + 0 + "," + 255 + "," + 0 + "," + clr[1] / 255 + ")"
        document.getElementById("bsq").style.backgroundColor = "rgba(" + 0 + "," + 0 + "," + 255 + "," + clr[2] / 255 + ")"
    }

    static play_sound() {
        if (document.getElementById("mute_button").classList.contains("unmuted")) {
            let freq = colour;
            rosc.turn_on(freq[0]);
            gosc.turn_on(freq[1]);
            bosc.turn_on(freq[2]);
        }
    }

    static stop_sound() {
        rosc.turn_off();
        gosc.turn_off();
        bosc.turn_off();
    }

    static check_zeros(anum) {
        if (anum == 0) {
            return 0.001;
        } else {
            return anum;
        }
    }
}