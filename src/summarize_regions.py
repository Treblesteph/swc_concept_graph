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

    result = []
    for filename in actual:
        found = len(find_regions(filename))
        diff = actual[filename] - found
        if   diff > 0:  sign = '>'
        elif diff == 0: sign = '='
        else:           sign = '<'
        result.append([filename, actual[filename], found, sign])

    writer = csv.writer(sys.stdout)
    writer.writerows(result)


if __name__ == '__main__':
    main()
