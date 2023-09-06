from PIL import Image, ImageFilter
import json 

# class InternalFrameMismatch(Exception):
#     pass

# class FrameCountError(Exception):
#     pass

h = open('/Users/aaronscott/Desktop/hypermodal/rsc/hypermodes.json')
hm = json.load(h)

def check_img(f, i, hm):
    im = Image.open(f"/Users/aaronscott/Desktop/hypermodal/rsc/metadata/{hm[i]['name']}.gif")

    if im.n_frames != 199:
        f.write(f"[ERROR] {hm[i]['name']} incorrect number of frames.\n")
        print(f"[ERROR] {hm[i]['name']} incorrect number of frames.\n")
        raise Exception
    
    r_data = hm[i]['clr']['r']
    g_data = hm[i]['clr']['g']
    b_data = hm[i]['clr']['b']
    frames = []
    for j in range(im.n_frames):
        im.seek(j)
        im.tell()
        rgb_im = im.convert('RGB')
        r, g, b = rgb_im.getpixel((1, 1))
        data_str = f"{hm[i]['name']}: {str((r_data, g_data, b_data)):<15} == {str((r,g,b))}\n"
        if (r == r_data) & (g == g_data) & (b == b_data):
            continue
        else:
            f.write(f"[INTERNAL FRAME MISMATCH] {data_str}")
            print(f"[INTERNAL FRAME MISMATCH] {data_str}")
            raise Exception
    
    f.write(f"[ALL MATCH] {data_str}")
    print(f"[ALL MATCH] {data_str}")

error_count = 0
f = open("data_generator/match_check_3.txt", "a")
f.write("\n--- Initializing Metadata Integrity Check ---\n\n")
for i in range(len(hm)):
    try:
        check_img(f, i, hm)
    except:
        error_count = error_count + 1
        continue
f.write(f"\n--- Total Errors: {error_count} ---\n")
f.close()