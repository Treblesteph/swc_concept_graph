#!/usr/bin/env bash

# Re-generate all the 'raw' images used in the running example.
# Parameters vary slight - the most important differences are:
# 1. seq2 images are slightly larger
# 2. the last couple of images from seq3 are missing

rm -f data/seq_flaws.csv
echo 'filename,center_x,center_y,radius' > data/seq_flaws.csv
src/generate_images.py -b 0.10 -f 0.70 -o data/seq1-%.png -r 0.20 -s 12345 -v -w 200 -n 40 >> data/seq_flaws.csv
src/generate_images.py -b 0.10 -f 0.75 -o data/seq2-%.png -r 0.15 -s 54321 -v -w 256 -n 40 >> data/seq_flaws.csv
src/generate_images.py -b 0.20 -f 0.75 -o data/seq3-%.png -r 0.25 -s 60798 -v -w 200 -n 38 >> data/seq_flaws.csv
src/generate_images.py -b 0.20 -f 0.70 -o data/seq4-%.png -r 0.20 -s 89706 -v -w 200 -n 40 >> data/seq_flaws.csv
