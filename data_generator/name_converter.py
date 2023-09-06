import json 
import os

username = os.environ['USER']
h = open(f'/Users/{username}/Desktop/hypermodal/rsc/hypermodes.json')
hm = json.load(h)
f = open("rename_op.log", "a")
for hypermode in hm:
    filename = f"{int(hypermode['id']):#0{66}x}"
    os.rename(f"/Users/{username}/Desktop/hypermodal/rsc/metadata/{filename[2:]}.gif", f"/Users/{username}/Desktop/hypermodal/rsc/metadata/{hypermode['name']}.gif")
    print(f"/Users/{username}/Desktop/hypermodal/rsc/metadata/{filename[2:]}.gif > /Users/{username}/Desktop/hypermodal/rsc/metadata/{hypermode['name']}.gif")
    f.write(f"renamed: {filename[2:]}.gif > {hypermode['name']}.gif\n")
f.close()
    
    