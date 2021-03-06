#Usage: arguments optional.
#First arg: Frequency (default 98.5M)
#Second arg: PPM error (default 93)


#Set frequency
if [ $# -ge 1 ]
then
  FREQ=$1
else
  FREQ=98.5M
fi
#For APRS: usually 432.9M or 144.39M


#Set ppm error (Find for individual stick using Kalibrate)
if [ $# -ge 3 ]
then
  PPM=$3
else
  PPM=93
fi

rtl_fm -f $FREQ -s 260k  -r 48k -p $PPM - | aplay -r 48k -f S16_LE -t raw -c 1

#Some frequencies to try in Victoria:
#98.5M, 100.3M, 100.7 FM, 103.1M
#APRS frequency: 144.39M
