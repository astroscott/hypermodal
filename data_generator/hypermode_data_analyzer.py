import json
import numpy as np
from scipy import stats
from collections import Counter

f = open('rsc/hypermodes.json')
data = json.load(f)
r = [item['clr']['r'] for item in data]
g = [item['clr']['g'] for item in data]
b = [item['clr']['b'] for item in data]
npr = [item['num']['peaks']['r'] for item in data]
npg = [item['num']['peaks']['g'] for item in data]
npb = [item['num']['peaks']['b'] for item in data]
sym = [item["sym"]["r"] for item in data]

# 1. Load and sort # of occurrences for each intensity, peak number, and symbol color for each color channel
# 2. Calculate the rarities based on the total number of hypermodes
# 3. Convert the counts to dicts for easy access

r_counts = sorted(Counter(item["clr"]["r"] for item in data).items())
r_rarity = {key : float(value)/len(data) for key, value in r_counts}
r_counts = {key : value for key, value in r_counts}

g_counts = sorted(Counter(item["clr"]["g"] for item in data).items())
g_rarity = {key : float(value)/len(data) for key, value in g_counts}
g_counts = {key : value for key, value in g_counts}

b_counts = sorted(Counter(item["clr"]["b"] for item in data).items())
b_rarity = {key : float(value)/len(data) for key, value in b_counts}
b_counts = {key : value for key, value in b_counts}

rp_counts = sorted(Counter(item["num"]["peaks"]["r"] for item in data).items())
rp_rarity = {key : float(value)/len(data) for key, value in rp_counts}
rp_counts = {key : value for key, value in rp_counts}

gp_counts = sorted(Counter(item["num"]["peaks"]["g"] for item in data).items())
gp_rarity = {key : float(value)/len(data) for key, value in gp_counts}
gp_counts = {key : value for key, value in gp_counts}

bp_counts = sorted(Counter(item["num"]["peaks"]["b"]for item in data).items())
bp_rarity = {key : float(value)/len(data) for key, value in bp_counts}
bp_counts = {key : value for key, value in bp_counts}

sym_counts = sorted(Counter(item["sym"]["r"] for item in data).items())
sym_rarity = {key : float(value)/len(data) for key, value in sym_counts}
sym_counts = {key : value for key, value in sym_counts}

zscores = np.zeros(len(data))
for i in range(len(data)):
    zscores[i] = np.sqrt(data[i]["clr"]["r"]**2 + data[i]["clr"]["g"]**2 + data[i]["clr"]["b"]**2)
zscores = stats.zscore(zscores, axis=0) 

rscores = np.zeros(len(data))
for i in range(len(data)):
    rscores[i] = 1/r_rarity[r[i]] + 1/g_rarity[g[i]] + 1/b_rarity[b[i]] + 1/rp_rarity[npr[i]] + 1/gp_rarity[npg[i]] + 1/bp_rarity[npb[i]] + 1/sym_rarity[sym[i]]

output = {
    "r_counts"  : r_counts,
    "r_rarity"  : r_rarity,

    "g_counts"  : g_counts,
    "g_rarity"  : g_rarity,

    "b_counts"  : b_counts,
    "b_rarity"  : b_rarity,

    "rp_counts"  : rp_counts,
    "rp_rarity"  : rp_rarity,

    "gp_counts"  : gp_counts,
    "gp_rarity"  : gp_rarity,

    "bp_counts"  : bp_counts,
    "bp_rarity"  : bp_rarity,

    "sym_counts" : sym_counts,
    "sym_rarity" : sym_rarity,

    "zscores"    : zscores.tolist(),
    "rscores"    : rscores.tolist(),
    "num"        : len(data)
}

outfile = open("rsc/analysis.json", "w")
hypermodes_json_data = json.dump(output, outfile)
outfile.close()