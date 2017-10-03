# Ground Station System Documentation

## Contents
 1. Overview
 2. Hardware
 3. Decoding and Demodulation
 4. Server (wsserver.py)
 5. Client Application
 6. Offline Mapping (optional)

## Overview

The UVic Rocketry Ground Station is used to display live telemetry data (transmitted by
an off-the-shelf "BigRedBee" board) during a rocket's flight, allowing us to find the rocket
(or its wreckage) after it lands, as well as identifying parachute deployment and other stages
in the rocket's flight.  The software supports location tracking on a map, live data logging, and
live visualization of altitude and vertical velocity.  Offline use is also supported.

During operation, telemetry data transmitted from a BigRedBee board using the APRS protocol is
received by a software defined radio.  The data is demodulated and decoded by open-source software
`rtl_fm` and `direwolf`.  The output from these programs is then read by a python server, which
both records the data and makes it available to a client-side webapp via a web socket.

The client webapp receives frames of telemetry data from the server and uses this information to
display the rocket on an OpenLayers map, which can be made to work offline.  Altitude data is
also plotted over time (using the Flot library), along with vertical acceleration data which
is useful for determining the flight state of the rocket.

## Hardware

Besides a computer to run the ground station software, three main hardware componnets are necessary:
the transmitter on the rocket, the software defined radio (SDR) stick, and a suitable antenna.

The transmitter on the rocket is a commercial off-the-shelf tracking unit sold by 
[BigRedBee](http://www.bigredbee.com/), with a suitable antenna, battery, and the like.  
This obviously needs to be placed somewhere that isn't blocked by materials that are opaque to radio
transmissions - for example, it can't be placed in a carbon fibre tube.

The receiver on the ground station should be a Software Defined Radio (SDR) stick similar to the
Realtek RTL2838 (which we use).  [Here](http://www.rtlsdr.com/2012/04/rtlsdr-compatibility-list/) 
is a list of possibly compatible hardware.  This is essentially a little USB dongle, originally
designed for receiving digital TV, that can also receive a variety of radio frequencies.

The SDR stick should be attached to an antenna.  Most will come with a small antenna that works fine
at short-to-medium ranges.  We haven't tested it in flight, instead using an antenna from a handheld
BaoFeng radio, but other solutions may also work.  Hopefully someone with more electrical knowledge can
expand on this section of the documentation in the future.

A final note: although this software can be run on pretty much any computer, environmental conditions
at some launch events (e.g. extreme heat at the Spaceport America Cup) might have adverse effects on
regular laptops, so it could be worth designing custom ground station hardware.  UVic Rocketry's ground 
station consists of a Wandboard Quad board housed in a Pelican case, and worked fine in desert conditions.

## Decoding and Demodulation

The signal received from the BigRedBee board is transmitted once per second (or at another rate, depending
on configuration) using the APRS amateur radio protocol.  This needs to be received, demodulated, and
decoded by the ground station. The system uses [rtl\_fm](http://kmkeen.com/rtl-demod-guide/), part of the 
rtl-sdr project, to demodulate the signal.  The output from `rtl_fm`, which is essentiall raw audio data, is
can be piped into [direwolf](https://github.com/wb2osz/direwolf), which decodes the APRS packets into a
string containing latitude and longitude (in "degrees, decimal minutes" format), as well as altitude and
a descriptive string.  The exact format and content of the data received from the BigRedBee depends on how
the board is configured.  More information about this may be added to this documentation in the future.
