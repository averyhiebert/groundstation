#Listen to see if you're even picking up packets:
#rtl_fm -f 432.9M -s 260k -r 48k -g 7.7 -p 93 - | aplay -r 48k -f S16_LE -t raw -c 1
rtl_fm -f 144.39M -s 260k -r 48k -g 49.6 -p 93 - | aplay -r 48k -f S16_LE -t raw -c 1

#Will likely need to modify gain (-g) a bit.
#Set frequncy (-f) to match whatever band you're using.
#The -p value will vary from stick to stick.  You can find it using Kalibrate.

#Example settings for piping raw data into direwolf:
#cat rawdata.raw | direwolf -n 1 -r 48000 -b 16 -t 0 -

#Supported gain values, for reference:
#0.0 0.9 1.4 2.7 3.7 7.7 8.7 12.5 14.4 15.7 16.6 19.7 20.7 22.9 25.4 28.0 29.7 32.8 33.8 36.4 37.2 38.6 40.2 42.1 43.4 43.9 44.5 48.0 49.6
