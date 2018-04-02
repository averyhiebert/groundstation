#Repeatedly echo prerecorded data, pretending to be a live rtl_fm feed for testing.

while :
do
	cat ${BASH_SOURCE%/*}/data.wav
	sleep 2
done
