# UVic Rocketry Ground Station Software (Proof-of-Concept)
This software uses a software defined radio and the APRS network to track
a rocket in flight and display its location and altitude in real time.
It was succesfully used to recover two rockets flown by the 
UVic Rocketry team at the Spaceport America Cup in 2017.  That being said, 
this is only intended to be a proof-of-concept, preceding work on a more 
professionaly-designed finished program.

This readme describes basic setup information.  For a more in-depth description of the system, see the `documentation` directory.


## OS & Hardware Recommendations:

This project was developed using Ubuntu 16.  Other Linux distros should also 
work, provided that all the dependencies are supported.

You'll also need an SDR stick compatible with rtl-sdr.  
We've been using the Realtek RTL2838.

The software is designed to track a BigRedBee BeeLine GPS device, but
could be modified fairly easily to work with other APRS-based GPS transmitters.

## Installation:

Install dependencies as described in `documentation/installation.txt` 
(or try running that file as a script if you're feeling lucky).

If you're only interested in testing the GUI and not the decoding components, 
some of the dependencies will not be necessary.  More information can be found 
in the `installation.txt` file.

## Testing Dependencies:

Test rtl-sdr/rtl\_fm by plugging in your SDR stick and running the script 
`server/decoder/testingtools/hearsdr.sh`.  If you're not in Victoria, pass 
in the frequency of a local FM radio station (e.g. `./hearsdr.sh 90.5M`).  
This script assumes that you have aplay installed.

You can test direwolf by going to the `server/decoder` directory and 
running `runtest.sh`.

## Running the Webapp:

First start `server/wsserver.py`, and then open `client/index.html` 
in a web browser.

## Calibration:

The `rtl_fm` software can take a "-p" flag to correct for some minor
imperfections in the SDR stick.  This has no real effect when listening to
regular FM radio stations, and I'm not sure to what extent it affects
attempts to decode APRS.  If you are having trouble getting APRS decoding to
work, this might be something to look into.

You can find a "-p" value for your SDR stick by running `rtl_test -p` and
waiting for several minutes.

## Licensing:

The client GUI uses the Flot charting library and the OpenLayers mapping 
library.  Links to licenses for those libraries can be found in comments at
the top of the files in question.  Otherwise, all code is copyrighted by its 
creator(s) unless otherwise specified (at least for the time being).
