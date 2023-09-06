#!/usr/bin/env python3
import glob
import os
import logging
import json
import numpy as np
import datetime
import multiprocessing as mp
import subprocess

def image_gen(i, hm):
        f = open("metadata_production.log", "a")
        filename = f"{int(hm[i]['id']):#0{66}x}"
        try:
            subprocess.call(f"processing-java --sketch=/Users/aaronscott/Desktop/hypermodal/data_generator/image_gen/ --run {i}", shell=True, stdout=subprocess.DEVNULL)
            subprocess.call(f"/opt/homebrew/Cellar/imagemagick/7.1.0-29/bin/convert " +
                f"-delay 2 -loop 0 /Users/aaronscott/Desktop/hypermodal/data_generator/image_gen/temp_imgs/{i}_*.png " +
                f"/Users/aaronscott/Desktop/hypermodal/rsc/metadata/" + hm[i]['name'] + ".gif", shell=True, stdout=subprocess.DEVNULL)
            print(f"{hm[i]['name']} recorded to rsc/metadata/{hm[i]['name']}.gif")
            f.write(f"[INFO {datetime.datetime.now()}]: {hm[i]['name']} recorded to rsc/metadata/{hm[i]['name']}.gif\n")
        except Exception as e:
            print(e)
            f.write(f"[WARNING {datetime.datetime.now()}]: {e}\n")
        fileList = glob.glob(f"/Users/aaronscott/Desktop/hypermodal/data_generator/image_gen/temp_imgs/{i}_*.png")
        for filePath in fileList:
            try:
                os.remove(filePath)
            except Exception as e:
                print(e)
                f.write(f"[WARNING {datetime.datetime.now()}]: {e}\n")
        f.close()

def json_gen(num, hm, an, logger):
    logger.info("---Initializing json generation---")
    for i in range(num):
        try:
            filename = f"{int(hm[i]['id']):#0{66}x}"
            metadata = {
                "name" : hm[i]['name'],
                "image" : "https://www.hypermodal.io/img/ID",
                "description" : "Your passport to nonspace",
                "external_url" : hm[i]['external_url'],
                "animation_url" : hm[i]['animation_url'],
                "attributes" : [
                    {   
                        "trait_type" : "Red Intensity", 
                        "value" : hm[i]['clr']['r'] 
                    },
                    {   
                        "trait_type" : "Blue Intensity",
                        "value" : hm[i]['clr']['g'] 
                    },
                    { 
                        "trait_type" : "Green Intensity", 
                        "value" : hm[i]['clr']['b'] 
                    },
                    { 
                        "trait_type" : "Red Peaks", 
                        "value" : hm[i]['num']['peaks']['r'] 
                    },
                    { 
                        "trait_type" : "Green Peaks", 
                        "value" : hm[i]['num']['peaks']['g'] 
                    },
                    { 
                        "trait_type" : "Blue Peaks", 
                        "value" : hm[i]['num']['peaks']['b'] 
                    },
                    { 
                        "trait_type" : "Symbol Color", 
                        "value" :  "black" if (hm[i]['sym']['r'] == 0) else "white"
                    },
                    {
                        "display_type": "number", 
                        "trait_type": "Standard Deviation Score", 
                        "value": np.round(an['zscores'][i], 3)
                    }, 
                    {
                        "display_type": "number", 
                        "trait_type": "Total Rarity Score", 
                        "value": np.round(an['rscores'][i], 3)
                    }
                ]
            }
            outfile = open(f"rsc/metadata/{filename[2:]}.json", 'w')
            json_data = json.dump(metadata, outfile)
            outfile.close()
            logger.info(f"rsc/metadata/{filename[2:]}.json")
        except Exception as e:
            logger.warning(f"Failed to save {filename[2:]}")
            logger.warning(f"{e}")

if __name__ == "__main__":
    # Logging
    logger = logging.getLogger('MG')
    logger.filename= '/Users/aaronscott/Desktop/hypermodal/data_generator/metadata_production.log'
    logger.setLevel(logging.DEBUG)
    formatter = logging.Formatter('[%(asctime)s, %(levelname)s]: %(message)s')

    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(formatter)
    logger.addHandler(ch)

    fh = logging.FileHandler('/Users/aaronscott/Desktop/hypermodal/data_generator/metadata_production.log')
    fh.setLevel(logging.DEBUG)
    fh.setFormatter(formatter)
    logger.addHandler(fh)

    logger.info("---Initializing image generation---")
    h = open('/Users/aaronscott/Desktop/hypermodal/rsc/hypermodes.json')
    hm = json.load(h)
    a = open('/Users/aaronscott/Desktop/hypermodal/rsc/analysis.json')
    an = json.load(a)
    # num = len(hm)
    
    image_gen(6379, hm)
    image_gen(6380, hm)
    # json_gen(num, hm, an, logger)
    
    # pool = mp.Pool(mp.cpu_count())
    # for i in range(num):
    #     pool.apply_async(image_gen, args=(i, hm))
    # pool.close()
    # pool.join()
    # missing_array = [1185, 1836, 3602, 5158, 5788, 6099, 7426, 8026, 8476, 9854, 653, 10670, 11592]
    # extra_array = 10463
    # for i in extra_array:
    # image_gen(extra_array, hm)
