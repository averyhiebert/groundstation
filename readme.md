# UVic Rocketry Ground Station Software (Proof-of-Concept)
This readme describes basic setup information.  For a more in-depth description of the system, see the `documentation` directory.

This software was succesfully used to recover two rockets flown by the University of Victoria at the Spaceport America Cup in 2017.  That being said, this is only intended to be a proof-of-concept, preceding work on a more professionaly-designed finished program.

## OS & Hardware Recommendations:

This project was developed using Ubuntu 16.  Other Linux distros should also work, provided you can get all the dependencies.

You'll also need an SDR stick compatible with rtl-sdr.  We've been using the Realtek RTL2838.

## Installation:

Install dependencies as described in `documentation/installation.txt` (or try running that file as a script if you're feeling lucky).

If you're only interested in testing the GUI and not the decoding components, some of the dependencies will not be necessary.  More information can be found in the `installation.txt` file.

## Testing Dependencies:

Test rtl-sdr/rtl_fm by plugging in your SDR stick and running the script `server/decoder/testingtools/hearsdr.sh`.  If you're not in Victoria, pass in the frequency of a local FM radio station (e.g. `./hearsdr.sh 90.5M`).  This script assumes that you have aplay installed.

You can test direwolf by going to the `server/decoder` directory and running `runtest.sh`.

## Running the Webapp:

First start `server/wsserver.py`, and then open `client/index.html` in a web browser.

## Calibration:

There is some timing error inherent in each sdr stick.  You can find this value using the open-source "Kalibrate" tool, and then use it for the "-p" option when running rtl_fm.  If you don't use an accurate "-p" value, you'll still be able to hear regular FM radio stations just fine, but you'll have little-to-no success decoding APRS.

Running `rtl_test -p` and waiting for several minutes should suffice for finding an accurate ppm error value.

## Licensing:

The client GUI uses the Flot charting library and the OpenLayers mapping library.  Licenses for those libraries can be found in their respective directories.  Otherwise, all code is copyrighted by its creator(s) unless otherwise specified (at least for the time being).
