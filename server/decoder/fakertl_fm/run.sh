#Repeatedly echo prerecorded data, pretending to be a live rtl_fm feed for testing.

while :
do
	#Path assumes that scipt is called from the directory above
	#cat fakertl_fm/data.raw #Yes, I know this is a terrible assumption to make
	cat ${BASH_SOURCE%/*}/data.raw
	sleep 2
done
