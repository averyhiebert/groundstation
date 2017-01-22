# UVic Rocketry Ground Station Software (Experimental Version)

## OS & Hardware Recommendations:

This project was developed using Ubuntu 16.  Other Linux distros might also work.

You'll also need an SDR stick compatible with rtl-sdr.

## Installation:

Install dependencies as described in "installation.txt" (or try running that file as a script if you're feeling lucky).

## Testing Dependencies:

Test rtl-sdr/rtl_fm by plugging in your SDR stick and running the script `tools/testsdrmusic.sh`.  You'll have to modify the script to choose a new FM radio station to test with if you're not in Victoria.

You can test direwolf by going to the `server/decoder` directory and running `runtest.sh`.

## Running the Webapp:

First start `server/wsserver.py`, and then open `client/index.html` in a web browser.

## Calibration

There is some error inherent in each sdr stick (some sort of timing thing, I'm not 100% clear on what it means).  You can find this value using the open-source "Kalibrate" tool, and then use it for the "-p" option when running rtl_fm.  If you don't use an accurate "-p" value, you'll still be able to hear regular FM radio stations just fine, but you'll have little-to-no success decoding APRS.

There are tutorials for how to do this online.  I'll try to find a good one and link it here.
