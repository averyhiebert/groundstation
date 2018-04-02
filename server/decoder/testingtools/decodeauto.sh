#Usage: arguments optional.
#First arg: Frequency (default 98.5M)
#Second arg: PPM error (default 93)


#Set frequency
if [ $# -ge 1 ]
then
  FREQ=$1
else
  FREQ=144.39M
fi
#For APRS: probably 432.9M or 144.39M 

#Set ppm error (Find for individual stick using Kalibrate)
if [ $# -ge 2 ]
then
  PPM=$3
else
  PPM=93
fi


rtl_fm -f $FREQ -s 260k -r 48k -p $PPM - | direwolf -n 1 -r 48000 -b 16 -t 0 -
