#!/usr/bin/env python

'''
Synthesize image files used as source for running example.

Usage: generate_images.py -b background -n p_flaws -o output_file -r p_radius -s rand_seed -v -w size

where:
-b background  = background fuzzing range of blob
                 (typically 0.0-0.2)
-f p_flaws     = p(success) for geometric distribution of # flaws/sample
                 (typically 0.5-0.8)
-n num_files   = number of files to generate
-o output_file = name of output file (or output filename stem)
-r p_radius    = p(success) for geometric distribution of flaw radius
                 (typically 0.1-0.4)
-s rand_seed   = RNG seed (large integer)
-v             = verbose
-w size        = image width/height in pixels
                 (typically 480-800)

If -n is used, the filename must be of the form 'path/stem-%.png', and
'%' is replaced by the serial number.  If -n is *not* used, the
filename is taken as-is.

If -v is used, the output is a CSV list of (filename, center_x,
center_y, radius) records.
'''


import sys
import csv
import argparse
import numpy as np
from skimage.io import imsave


BLACK =   0
WHITE = 255


def main():
    '''Main driver.'''

    params = parse_args()
    np.random.seed(params.rand_seed)
    flaws = []

    if params.num_files is None:
        generate_image(params, params.output_file, flaws)
    else:
        for i in range(params.num_files):
            output_file = params.output_file.replace('%', '{0:04d}'.format(i))
            generate_image(params, output_file, flaws)

    if params.verbose:
        writer = csv.writer(sys.stdout, dialect='unix')
        writer.writerows(flaws)


def parse_args():
    '''Parse command-line arguments.'''

    parser = argparse.ArgumentParser()
    parser.add_argument('-b', dest='background', type=float,
                        help='background fuzzing range of blobs (typically 0.0-0.2)')
    parser.add_argument('-f', dest='p_flaws', type=float,
                        help='p(success) for geometric distribution of # flaws/sample (typically 0.5-0.8)')
    parser.add_argument('-n', dest='num_files', type=int,
                        help='number of files to generate')
    parser.add_argument('-o', dest='output_file',
                        help='name of output file (or output filename stem)')
    parser.add_argument('-r', dest='p_radius', type=float,
                        help='p(success) for geometric distribution of flaw radius (typically 0.1-0.4)')
    parser.add_argument('-s', dest='rand_seed', type=int,
                        help='RNG seed (large integer)')
    parser.add_argument('-v', dest='verbose', default=False, action='store_true',
                        help='verbose output to stderr')
    parser.add_argument('-w', dest='size', type=int,
                        help='image width/height in pixels (typically 480-800)')

    if len(sys.argv) == 1:
        sys.argv.append('-h')
    params = parser.parse_args()

    assert (params.background is not None) and (0.0 <= params.background <= 1.0), \
           'Need background in (0.0 - 1.0), not {0}'.format(params.background)
    assert (params.p_flaws is not None) and (0.0 < params.p_flaws < 1.0), \
           'Need number of flaws probability in (0.0 - 1.0), not {0}'.format(params.p_flaws)
    assert params.output_file, \
           'Need output file name'
    assert (params.p_radius is not None) and (0.0 < params.p_radius < 1.0), \
           'Need flaw radius probability in (0.0 - 1.0), not {0}'.format(params.p_radius)
    assert params.rand_seed is not None, \
           'Need random number generation seed'
    assert (params.size is not None) and (params.size > 0), \
           'Need non-negative image size, not {0}'.format(size)

    if params.num_files:
        assert params.num_files > 0, \
               'Need positive number of files, not {0}'.format(params.num_files)
        assert params.output_file.count('%') == 1, \
               'Output filename stem must contain exactly one %, not {0}'.format(params.output_file)

    return params


def generate_image(params, output_file, flaws):
    '''Create a single output image, appending flaws to accumulator.'''

    image = create_blank_image(params.size)
    num_flaws = np.random.geometric(params.p_flaws)
    for i in range(num_flaws):
        center_x, center_y, radius = \
            create_flaw(image, params.p_radius, params.background, params.verbose)
        flaws.append([output_file, center_x, center_y, radius])
    imsave(output_file, image)


def create_blank_image(size):
    '''Create square white image of specified size.'''

    image = np.full([size, size], BLACK, dtype=np.uint8)
    return image


def create_flaw(image, p_radius, background, verbose):
    '''Create a single flaw in the image.  Flaws may overlap each other, but not the edge.'''

    # Blob radius.
    size = image.shape[0]
    assert size == image.shape[1], \
           'Expecting square image, not {0}x{1}'.format(size, image.shape[1])
    radius = size
    while radius >= size/2:
        radius = np.random.geometric(p_radius)

    # Blob values.
    diameter = 1 + 2 * radius
    blob = (WHITE * (1.0 - background * np.random.rand(diameter, diameter))).astype(np.uint8)

    # Mask outside radius.
    diameter = 1 + 2 * radius
    coords = np.arange(diameter)
    dist_sq_x = (coords - radius) ** 2
    dist_sq_y = (coords - radius) ** 2
    dist_sq = dist_sq_x[:, np.newaxis] + dist_sq_y[np.newaxis, :]
    blob[dist_sq > radius**2] = BLACK

    # Blob center.
    c_x, c_y = np.random.randint(radius, size - radius, 2)

    # Fill.
    image[c_x-radius:c_x+radius+1, c_y-radius:c_y+radius+1] += blob

    return (c_x, c_y, radius)


if __name__ == '__main__':
    main()
