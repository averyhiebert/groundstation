import re
import json
import time

#Parse a line of BigRedBee data
def parseBRB(line):
    data = {}
    data["raw"] = line

    latregex = "(?P<lat1>\d{2})(?P<lat2>[0-9.]{5})(?P<latsign>[NS])"
    lonregex = "(?P<lon1>\d{3})(?P<lon2>[0-9.]{5})(?P<lonsign>[WE])"
    altregex = "A=(?P<alt>\d*)"
    regex = latregex + ".*?" + lonregex + ".?" + altregex
    regex = latregex + ".*?" + lonregex + ".*?" + altregex
    reg = re.compile(regex)
    m = re.search(regex,line)
    if(m):
        lat = float(m.group("lat1")) + (float(m.group("lat2"))/60.0)
        lat = lat if m.group("latsign") == "N" else (-1*lat)
        lon = float(m.group("lon1")) + (float(m.group("lon2"))/60.0)
        lon = lon if m.group("lonsign") == "E" else (-1*lon)
        data["altitude"] = int(m.group("alt"))
        data["latitude"] = lat
        data["longitude"] = lon
        data["error"] = False
        data["timestring"] = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        data["timestamp"] = time.time()*1000  #Gives ms as a floating point.
    else:
        print "Error parsing BRB data"
        data["error"] = True
    
    return json.dumps(data)

