#!/usr/bin/env python

'''
Synthesize image files used as source for running example.

Usage: generate_raw_images.py -d p_diameter -f p_flaws -r rand_seed  -s image_size

where:
-d p_diameter  = p(success) for geometric distribution of flaw size (typically 0.1-0.4)
-f p_flaws     = p(success) for geometric distribution of # flaws/sample (typically 0.5-0.8)
-o output_file = name of output file
-r rand_seed   = RNG seed (large integer)
-s image_size  = height/width in pixels of image (typically 480-800)
'''


import sys
import random
import numpy as np
from scipy.misc import imsave


def main(args):
    '''Main driver.'''

    params = parse_args(args)
    random.seed(params.rand_seed)
    image = create_blank_image(params.image_size)
    for flaw in params.num_flaws:
        create_flaw(params, image)
    imsave(image, params.output_file)


def parse_args(args):
    '''Parse command-line arguments, returning named tuple of values.'''

    pass


def create_blank_image(size):
    '''Create square white image of specified size.'''

    assert size > 0, 'Require non-negative size, not {0}'.format(size)
    image = np.zeros([size, size, 3], dtype=np.uint8)
    image.fill(255)
    return image


def create_flaw(params, image):
    '''Create a single flaw in the image.  Note that flaws may overlap.'''

    pass


if __name__ == '__main__':
    main(sys.argv)
