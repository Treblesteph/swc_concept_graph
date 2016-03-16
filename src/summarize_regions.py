#!/usr/bin/env python

'''Report actual and discovered number of regions per image.'''


import sys
import csv
from collections import Counter
from find_regions import find_regions


def main():
    '''Main driver.'''

    assert len(sys.argv) == 2, 'Need exactly one filename'
    actual = Counter()
    with open(sys.argv[1], 'r') as raw:
        reader = csv.reader(raw)
        for (i, row) in enumerate(reader):
            if i == 0: continue # header
            filename = row[0]
            actual[filename] += 1

    found = {}
    for filename in actual:
        found[filename] = len(find_regions(filename))

    for filename in actual:
        symbol = '<=>'[1 + sign(actual[filename] - found[filename])]
        print(filename, symbol, actual[filename], found[filename])

def sign(x):
    if x < 0: return -1
    elif x == 0: return 0
    else: return 1


if __name__ == '__main__':
    main()
