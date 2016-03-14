#!/usr/bin/env python

'''
Find and display regions in an image.

Usage: find_regions.py filename [filename...]
'''


import sys
import skimage.io
import skimage.measure

def main():
    assert len(sys.argv) > 1, \
           'Require at least one image filename'
    if len(sys.argv) == 2:
        format = '{1:2}: ({2:5.2f}, {3:5.2f}) x ({4:5.2f}, {5:5.2f})'
    else:
        format = '{{0:{0}}} {{1:2}}: ({{2:5.2f}}, {{3:5.2f}}) x ({{4:5.2f}}, {{5:5.2f}})'\
                 .format(max([len(x) for x in sys.argv[1:]]))

    for filename in sys.argv[1:]:
        image = skimage.io.imread(sys.argv[1])
        image_bw = image > 128
        labeled = skimage.measure.label(image_bw, connectivity=2)
        regions = skimage.measure.regionprops(labeled)
        for (i, r) in enumerate(regions):
            print(format\
                  .format(filename, i, r.centroid[0], r.centroid[1], r.major_axis_length, r.minor_axis_length))

if __name__ == '__main__':
    main()
