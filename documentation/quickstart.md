# Quick Start Guide
This document describes how to get the ground station up and running in test
mode.

## Step 1 - Hardware
You will need a computer running Linux (Ubuntu 14, Ubuntu 16, and
Linux Mint 18 have been tested).  To actually receive a radio signal (as
opposed to just running in test mode), you will also need an RTL-SDR device,
which you can read about [here](https://www.rtl-sdr.com) and obtain
either from [here](https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/), 
or from Adafruit, Amazon, or any of a number of other online retailers.

## Step 2 - Installation
Install the dependencies as described in installation.txt.  Note: it is
assumed that you are using Python 2.7.

## Step 3 - Configuration
Edit the configuration file `server/config.json`.  The
configuration settings are described in `overview.md`.  For initial testing in
test mode, the default settings should be fine.

## Step 4 - Start the server
From within the `server` directory, execute `python wsserver.py`.  

If you are using the default (test mode) settings, the server will 
start producing output in the terminal (and sending it to any
connected clients) after a 10-second pause.  
The pause is meant to allow you time to start the client
before the server starts sending data, so you should probably hurry and
complete the next step quickly.

## Step 5 - Start the client
Open the file `client/index.html` in a browser.  If you have an internet
connection, you should see an OpenStreetMaps map filling most of the page.
With luck, a red arrow representing the rocket should appear on the map after
a couple of seconds.

## Apology
This process is not very intuitive, since this entire project was an
experiment and a learning experience for us.  Now that we have a better
understanding of the features we want and how they can be implemented, we 
are working on a more robust, user-friendly ground-up redesign of the entire 
project. 
