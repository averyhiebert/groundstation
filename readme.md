# UVic Rocketry Ground Station Software (Proof-of-Concept)
This software uses a software defined radio and the APRS protocol to track
a rocket in flight and display its location and altitude in real time.
It was succesfully used to recover two rockets flown by the 
UVic Rocketry team at the Spaceport America Cup in 2017.  That being said, 
this was only intended to be a proof-of-concept, and as a result the design
is not ideal for maintainability and further modification.  We have already
begun applying the lessons we learned from this project towards what will
hopefully be a more robust successor.

This readme describes basic setup information.  For a more in-depth description of the system, see the `documentation` directory.


## OS & Hardware Recommendations:

This project was developed for Ubuntu 16.  Other Linux distros should also 
work, provided that all the dependencies are supported.

You'll also need an "rtl-sdr" software defined radio usb device.  Information
about this sort of device can be found at https://www.rtl-sdr.com/.

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
This script should play music from the radio 
(assuming you have aplay installed).

You can test direwolf by going to the `server/decoder` directory and 
running `runtest.sh`.

## Running the Webapp:

First start `server/wsserver.py`, and then open `client/index.html` 
in a web browser.

**Note:** This repository's history has been modified to remove some private information.  As a side effect, *older commits may not run as expected!*


## Copyright & Licensing:
This repository includes distributions of the Flot charting library, 
the OpenLayers mapping library, and jQuery, as well as the "Lato" font.  
The licenses for Flot and for Lato can be found in their respective directories.
The OpenLayers and jQuery files contain links to their respective licenses.

Otherwise, everything not listed above is released according to the MIT 
license as described in `LICENSE.txt`
