#!/usr/bin/env python

'''
Synthesize image files used as source for running example.

Usage: generate_raw_images.py -d p_diameter -f p_flaws -r rand_seed  -s image_size

where:
-n num_flaws   = p(success) for geometric distribution of # flaws/sample (typically 0.5-0.8)
-o output_file = name of output file
-r radius      = p(success) for geometric distribution of flaw radius (typically 0.1-0.4)
-s rand_seed   = RNG seed (large integer)
-w size        = image width/height in pixels (typically 480-800)
'''


import sys
import argparse
import numpy as np
from scipy.misc import imsave


def main(args):
    '''Main driver.'''

    params = parse_args(args)
    np.random.seed(params.rand_seed)
    image = create_blank_image(params.image_size)
    for flaw in params.num_flaws:
        create_flaw(params, image)
    imsave(image, params.output_file)


def parse_args(args):
    '''Parse command-line arguments.'''

    parser = argparse.ArgumentParser()
    parser.add_argument('-n', dest='num_flaws', type=int,
                        help='p(success) for geometric distribution of # flaws/sample (typically 0.5-0.8)')
    parser.add_argument('-o', dest='output_file',
                        help='name of output file')
    parser.add_argument('-r', dest='radius', type=int,
                        help='p(success) for geometric distribution of flaw radius (typically 0.1-0.4)')
    parser.add_argument('-s', dest='rand_seed', type=int,
                        help='RNG seed (large integer)')
    parser.add_argument('-w', dest='size', type=int,,
                        help='image width/height in pixels (typically 480-800)')
    params = parser.parse_args(args)

    assert params.num_flaws >= 0, 'Need non-negative number of flaws, not {0}'.format(params.num_flaws)
    assert params.output_file, 'Need output file name'
    assert params.radius > 0, 'Need non-negative flaw radius, not {0}'.format(params.radius)
    assert params.rand_seed, 'Need random number generation seed'
    assert params.size > 0, 'Need non-negative image size, not {0}'.format(size)

    return params


def create_blank_image(size):
    '''Create square white image of specified size.'''

    image = np.zeros([size, size, 3], dtype=np.uint8)
    image.fill(255)
    return image


def create_flaw(params, image):
    '''Create a single flaw in the image.  Flaws may overlap each other, but not the edge.'''

    radius = np.random.geometric(params.diameter)
    diameter = 1 + 2 * radius
    c_x, c_y = np.random.randint(diameter, params.width-diameter)
    image[cx-diameter:cx+diameter, cy-diameter:cy+diameter, :] = 0


if __name__ == '__main__':
    main(sys.argv)
