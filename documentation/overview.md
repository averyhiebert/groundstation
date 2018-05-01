# Ground Station System Documentation

This ground station software was developed as a proof-of-concept and 
an exploration of the possibilites for an SDR-based ground station.  
As such, the implementation is a bit messy.  Hopefully this
document can explain more-or-less what all the components are and how 
they connect.

## Contents
 1. Overview
 2. Hardware
 3. Decoding and Demodulation
 4. Server
 5. Client
 6. Offline Mapping (optional)

## 1. Overview

The UVic Rocketry Ground Station is used to display live telemetry 
data (transmitted by an off-the-shelf "BeeLine GPS" board from BigRedBee) 
during a rocket's flight, allowing us to find the rocket
(or its wreckage) after it lands, as well as identifying parachute 
deployment and other stages in the rocket's flight.  The software 
supports location tracking on a map, live data logging, and
live visualization of altitude and vertical velocity.  Offline use is 
also supported.

During operation, telemetry data transmitted from the BeeLine board 
using the APRS protocol is received by a software defined radio.  The 
data is demodulated and decoded by open-source software
`rtl_fm` and `direwolf`.  The output from these programs is then 
read by a python server, which
both records the data and makes it available to a client-side webapp 
via a web socket.

The client webapp receives points of GPS data from the 
server and uses this information to
display the rocket on an OpenLayers map, which can be made to 
work offline.  Altitude data is also plotted over time (using the 
Flot library), along with vertical velocity data which
is useful for determining the flight state of the rocket.

## 2. Hardware

Besides a computer to run the ground station software, three main 
hardware componnets are necessary: the transmitter on the rocket, the 
software defined radio (SDR) stick, and a suitable antenna.

The transmitter on the rocket is a commercial off-the-shelf "BeeLine GPS" unit
sold by [BigRedBee](http://www.bigredbee.com/), with a suitable antenna, 
battery, and the like.  
This obviously needs to be placed somewhere on the rocket that isn't blocked by 
materials that are opaque to radio transmissions - for example, it can't 
be placed in a carbon fibre tube.

The receiver on the ground station should be a Software Defined Radio (SDR) 
usb dongle using technology such as the Realtek RTL2838 or similar.  I'm not
sure exactly where we bought ours, but it looks more or less the same as
[this](https://www.amazon.ca/RTL-SDR-Realtek-Upgrade-version-RTL2832U/dp/B00WBOOX38/ref=pd_lpo_vtph_23_lp_tr_t_2/146-0166966-8330406?_encoding=UTF8&psc=1&refRID=RYMK6VN6XV3Y26K2YEC5).
This is essentially a little USB dongle, designed for receiving digital TV, 
that can also receive a variety of radio frequencies.
A list of possibly compatible hardware can be found 
[Here](http://www.rtlsdr.com/2012/04/rtlsdr-compatibility-list/).  

The SDR stick should be attached to an antenna.  
Most will come with a small antenna that works reasonably well.  
We haven't tested this default antenna in flight, 
instead using an antenna from a handheld BaoFeng radio, but other 
solutions may also work.  Hopefully someone with more electrical knowledge can
expand on this section of the documentation in the future.

A final note: although this software can be run on a typical personal computer, 
environmental conditions at some launch events (e.g. dust and extreme heat at 
the Spaceport America Cup) might have adverse effects on
regular laptops, so it could be worth designing custom ground station hardware.  UVic Rocketry's ground station consists of a Wandboard Quad board 
housed in a Pelican case, and worked fine for us in desert conditions.

## 3. Decoding and Demodulation

The signal received from the BeeLine board is transmitted once per 
second (or at another rate, depending on configuration) using the APRS digital 
radio protocol.  This needs to be received, demodulated, and
decoded by the ground station. The system uses 
[rtl\_fm](http://kmkeen.com/rtl-demod-guide/), part of the 
rtl-sdr project, to demodulate the signal.  The output from `rtl_fm`, 
which is essentiall raw audio data, is piped into 
[direwolf](https://github.com/wb2osz/direwolf), which decodes the APRS packets 
into a string containing latitude and longitude (in "degrees, decimal minutes" 
format), as well as altitude.  The exact format and content of the 
data received from the BeeLine depends on how the board is configured.  
More information about this may be added to this documentation in the future.

## 4. Server

The python server (`server/wsserver.py`) starts the demodulator and the 
decoder (by running the script at `server/decoder/testingtools/decode.sh` 
as a subprocess), parses the decoded data (using `brbparser.py`), and sends it 
to a client over a web socket, while logging the data received to a JSON(ish) 
file and printing it to the screen.  However, the exact behaviour 
depends on the state of the `config.json` file in that directory.

### Configuration Options

- **doTestFromFile**: If `true`, then rather than starting the demodulator and decoder to receive a live
radio signal via the SDR, the system will simply test the server & client using data points from a 
`data.json` file in the `server` directory.  The following three settings (`doRepeat`, `doInitialPause`,
and `playbackSpeed`) only have an effect if `doTestFromFile` is set to `true`.
  + **doRepeat**: If `true`, continuously loop the data from `json.data`; if `false`, only play the data 
once.
  + **doInitialPause**: If `true`, the server will wait for 10 seconds after starting up before reading and
sharing the data from `json.data`.  If `false`, the server will start immediately after startup.  This
option is available to make testing with the server and client together easier.
  + **playbackSpeed**: The number (or fraction) of seconds to wait between reading/processing each data
point in `data.json`.  Contrary to what the name suggests, a larger number results in a lower playback
speed.  Sorry.
- **haveSDR**: Used to indicate whether you currently have the SDR hardware (SDR stick and antenna)
plugged in to the computer.  It `true`, the server will attempt to receive data live via radio (i.e.
will actual perform its intended purpose as a ground station).  If false,
prerecorded test data (found in `server/decoder/fakertl_fm`) will be used instead, fully testing the
server and direwolf, but not `rtl_fm`, and not actually receiving any signal via radio.
- **doLogData**: If `true`, all data points recorded (as well as potential error messages) will be recorded
in `log.json` (new data points will be appended to the file if it already exists).  If `false`, data will
not be logged.
- **doWebSocket**: If `true`, the server will be able to accept a web socket connection from a client and
send data points over the connection as they are received.  If `false`, this will not happen (only logging,
if enabled, and output in the console will occur).
- **frequency**: The radio frequency to monitor.  Should be a string, with "M" signifying megahertz (i.e.
enter the freuency 433.00 MHz as "433.00M").
- **callsign**: The callsign that the BeeLine board is transmitting under.  Only has an effect if 
`filterCallsign` is enabled.
- **filterCallsign**: If `true`, any data packets originating from a callsign other than that specified
in the `callsign` attribute will be ignored.

### Server Behaviour

Upon running `wsserver.py`, the server will begin reading data from a 
data source (either live radio data, or one of two types of test data 
depending on the `doTestFromFile` and `haveSDR` settings). As
each data point is encountered, it is parsed (using `brbparser.py`) into 
latitude, longitude, and altitude data, and is given a time stamp.  

After being parsed, each data point is appended to `log.json` 
(unless logging is disabled).  Each data point is stored as a JSON object, 
with fields "timestamp", "altitude","longitude","latitude", 
"raw" (i.e. the raw data, prior to parsing), "timestring", and 
"error" (true or false).  The data points are appended to the 
file separated by commas, but if you want to make the file into a 
true JSON file, you'll need to add an opening `[` at the beginning, and 
replace the trailing comma with a closing `]`.

While running, if the seb socket functionality is enabled, the server 
can accept a web socket connection from a client (only a single client at 
a time has been tested).  This connection will use localhost, port 9000.  
If the client disconnects, it can reconnect without the server restarting.  
After each data point is parsed, the JSON data is sent over the websocket 
to the client.

Each data point is also printed to stdout when parsed.


## 5. Client

The client application `client/index.html` is an HTML/JavaScript 
application that runs in a web browser (tested in Chromium and Firefox).  
To run the client, open `client/index.html` in the browser of your choice.  
Upon page load, the client will attempt to connect to the server
via a websocket.  If the server is not yet running, you'll need to start 
the server and then reload the client.  Restarting the server will also 
require reloading the client.

The client has two main features: a map, and a display including plots of 
altitude and vertical velocity of the rocket over time.

The map uses the [OpenLayers](https://openlayers.org/) library, and can 
connect to a WMS service to use as a base map.  If
connected to the internet, it will use 
[OpenStreetMap](https://www.openstreetmap.org) data. Other 
services can be configured in the file `client/config/configWMS.js`.

Every time a new data point is received from the server via the 
websocket connection, the location of the rocket on the map 
(represented by a triangular icon) will be updated, and the rocket's new 
location will be added to the red trail representing the rocket's path so far.  Clicking on the magnifying glass icon will cause the map to automatically 
pan and zoom to the rocket's current position.

The altitude display uses the [Flot](http://www.flotcharts.org/) library. 
Every time a new data point is received from the server, it is added to the 
collection of data displayed in the altitude and velocity plots.  
The altitude is readjusted to measure above ground level, where "ground level" 
is the altitude of the first data point received. 
Vertical velocity is calculated from the altitude data.

The current altitude of the rocket should display above the 
altitude chart.

## 6. Offline Mapping

The client can be configured to use a WMS service as a base map.  
If an internet connection will not be
available at launch, an offline base map can be provided by running a 
WMS service locally.  We did this using [GeoServer](http://geoserver.org/), 
an open-source Java server for GIS data.  Unfortunately, 
a description of how to obtain data for your launch site and set up a 
WMS service using GeoServer is probably beyond the scope of this documentation.


