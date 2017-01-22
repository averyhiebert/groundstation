#I think this should work for live decoding in theory,
# but I haven't had a chance to test it yet.

#Again, the gain will probably need to be adjusted a bit.

rtl_fm -f 144.39M -s 260k -r 48k -g 25.4 -p 93 - | direwolf -n 1 -r 48000 -b 16 -t 0 -

