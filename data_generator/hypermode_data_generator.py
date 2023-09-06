import numpy as np
import json
import os

def generate_data(num_hypermodes):
    data = [{}] * num_hypermodes
    for i in range(num_hypermodes):
        data[i] = generate_hypermode(i)
    return data
    
def generate_hypermode(id):
    hex = hex_colour() # random hex colour
    colour = rgb(hex) # associated rgb colour
    f = frequencies(colour) # associated frequencies
    frot = rotational(colour) # associated rotational frequencies
    np = num_peaks(colour) # associated number of peaks
    sc = osc_colour(colour) # associated oscillator and identifier colour
    amp = 15
    nodes = 100
    rad = 100
    return {'id': id,
            'name': "HM" + str(id).zfill(5) + "_#" + ''.join(hex),
            'external_url' : "https://hypermodal.io/?id=" + str(id),
            'animation_url' : "https://hypermodal.io/hm?id=" + str(id),
            'amplitude': amp,
            'clr': {'hex': ''.join(hex), 'r': colour[0], 'g': colour[1], 'b': colour[2]},
            'freq': {'r': f[0], 'g': f[1], 'b': f[2]},
            'rfreq': {'r': frot[0], 'g': frot[1], 'b': frot[2]},
            'num': {
              "peaks" : {"r" : np[0], "g" : np[1], "b" : np[2]},
              "nodes" : nodes
              },
            'sym': {"r" : sc[0], "g" : sc[1], "b" : sc[2]},
            'radius': rad,
            }

def frequencies(colour):
    frequencies = [colour[0] / 100.0, colour[1] / 100.0, colour[2] / 100.0]
    return frequencies

def rotational(colour):
  frequencies = [colour[0] / 100.0, colour[1] / 100.0, colour[2] / 100.0]
  return frequencies

def num_peaks(colour):
  num_peaks = [None] * len(colour)
  for i in range(len(colour)):
    if (colour[i] > 200):
      num_peaks[i] = 6
    elif (colour[i] > 100):
      num_peaks[i] = 4
    else:
      num_peaks[i] = 3
  return num_peaks

def osc_colour(colour):
    osc_clr = []
    if (colour[0] * 0.299 + colour[1] * 0.587 + colour[2] * 0.114 > 150):
        osc_clr = [0, 0, 0]
    else:
        osc_clr = [255, 255, 255]
    return osc_clr

def hex_colour():
  options = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
  hex_array = [None] * 6
  for i in range(6):
    index = np.random.randint(16)
    hex_array[i] = options[index]
  return hex_array

def rgb(hex_colour):
  r = [hex_colour[0], hex_colour[1]]
  g = [hex_colour[2], hex_colour[3]]
  b = [hex_colour[4], hex_colour[5]]
  return [int(''.join(r), 16), int(''.join(g), 16), int(''.join(b), 16)]

num_hypermodes = 12129

data = generate_data(num_hypermodes)
outfile = open("rsc/hypermodes.json", "w")
hypermodes_json_data = json.dump(data, outfile)
outfile.close()