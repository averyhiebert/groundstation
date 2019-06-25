import re
import json
import time

def decode_ll(s,is_lat=True):
    # s is a 4-character string containing compressed lat or lon data as
    # described in the APRS documentation.
    # is_lat is True for latitude and False for longitude.
    #
    # Return value is in decimal degrees, or None if not a number.
    if s == "NN!!":
        return None

    # Sorry for lack of readability here. Basically, the value is represented
    #  in base 91 using ascii characters.
    #  See page 38 of http://www.aprs.org/doc/APRS101.PDF
    base_91 = sum((ord(c) - 33)*(91**i) for i,c in enumerate(reversed(s)))
    if is_lat:
        return 90 - base_91*1.0/380926
    return -180 + base_91*1.0/190463

def decode_alt(alt):
    # Decode 2-character string into altitude.
    #  (string contains log (base 1.002) of altitude in feet, represented in
    #   base 91 using ascii characters.)
    #  (See page 40 of http://www.aprs.org/doc/APRS101.PDF)
    return 1.002**((ord(alt[0])-33)*91 + ord(alt[1]) - 33)

    

#Parse a line of APRS data from the telemetrum
def parseTM(line):
    # As with the BRB parser, I can't guarantee that this works with all 
    #  possible configuration options and not just those that we've tested
    #  with.
    #
    # In the future, if someone wants to make a parser that works for all
    #  valid APRS signals containing lat/lon/alt data, possibly by
    #  introducing another dependency, go for it.
    #
    #  APRS format documentation can be found here: 
    #   http://www.aprs.org/doc/APRS101.PDF
    #  TeleMetrum uses "Compressed Position Data" with Compressed Altitude

    data = {}
    data["raw"] = line
    data["timestring"] = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
    data["timestamp"] = time.time()*1000  #Gives ms as a floating point.

    regex = ":!/(?P<lat>....)(?P<lon>....)'(?P<alt>..)Q(?P<info>.*)"
    m = re.search(regex,line)
    if(m):
        data["info"] = m.group("info") # Includes continuity, GPS lock, etc.
        data["error"] = False
        lat = decode_ll(m.group("lat"),is_lat=True)
        lon = decode_ll(m.group("lon"),is_lat=False)
        alt = decode_alt(m.group("alt")) 
        if lat == None or lon == None:
            data["error"] = True
            if data["info"][0] == "U":
                data["errorMessage"] = "No GPS lock."
            else:
                data["errorMessage"] = "Unknown parsing error."
        data["latitude"] = lat
        data["longitude"] = lon
        data["altitude"] = alt
        return json.dumps(data)
    else:
        raise RuntimeError("Error parsing TeleMetrum data.")

