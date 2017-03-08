#Usage: arguments optional.
#First arg: Frequency (default 98.5M)
#Second arg: Gain (default 49.6)
#Third arg: PPM error (default 93)


#Set frequency
if [ $# -ge 1 ]
then
  FREQ=$1
else
  FREQ=98.5M
fi
#For APRS: 432.9M or 144.39M depending on stuff

#Set gain
if [ $# -ge 2 ]
then
  GAIN=$2
else
  GAIN=49.6
fi
#(I think gain of 7.7 was used when we first successfully decoded something)

#Set ppm error (Find for indivisual stick using Kalibrate)
if [ $# -ge 3 ]
then
  PPM=$3
else
  PPM=93
fi

rtl_fm -f $FREQ -s 260k -g $GAIN -r 48k -p $PPM - | aplay -r 48k -f S16_LE -t raw -c 1

#Some frequencies to try in Victoria:
#98.5M, 100.3M, 100.7 FM, 103.1M
#APRS frequency: 144.39M

#Supported gain values, for reference:
#0.0 0.9 1.4 2.7 3.7 7.7 8.7 12.5 14.4 15.7 16.6 19.7 20.7 22.9 25.4 28.0 29.7 32.8 33.8 36.4 37.2 38.6 40.2 42.1 43.4 43.9 44.5 48.0 49.6

