#!/usr/bin/env python

'''Display size of image or images.'''


import sys
from PIL import Image


if len(sys.argv) == 1:
    print('usage: picsize file [file...]', file=sys.stderr)

elif len(sys.argv) == 2:
    print(*Image.open(sys.argv[1]).size)

else:
    for filename in sys.argv[1:]:
        print(filename, *Image.open(filename).size)
