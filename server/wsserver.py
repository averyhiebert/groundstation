import subprocess

import logging
import sys
import json
import time
import thread
from twisted.python import log
from twisted.internet import reactor

from autobahn.twisted.websocket import WebSocketServerProtocol
from autobahn.twisted.websocket import WebSocketServerFactory

from time import localtime, strftime

from brbparser import parseBRB

# Load configuration:
try:
    f = open("config.json","r")
    configuration = json.loads(f.read())
    f.close()

    doWebSocket = configuration["doWebSocket"]
    doTestFromFile = configuration["doTestFromFile"]
    haveSDR = configuration["haveSDR"]
    doLogData = configuration["doLogData"]
    frequency = configuration["frequency"]
    doInitialPause = configuration["doInitialPause"]
    doRepeat = configuration["doRepeat"]
    playbackSpeed = configuration["playbackSpeed"]
    callsign = configuration["callsign"]
    filterCallsign = configuration["filterCallsign"]
except:
    doWebSocket = True
    doTestFromFile = True
    haveSDR = False
    doLogData = True
    frequency = "432.9M"

    playbackSpeed = 1
    doRepeat = True
    doInitialPause = True
    callsign = "INVALID"
    filterCallsign = False
    


datalog = [] #For use when logging data.

#Set up websocket protocol
latestMessage = "no data"
connections = list()
class APRSServerProtocol(WebSocketServerProtocol):

    def onMessage(self, payload, isBinary):
        print (payload)
        self.sendMessage(payload, isBinary)
    
    def onConnect(self, request):
        connections.append(self)
        print("Client connecting")
    
    #def onClose(self, wasClean, code, reason):
        #connections.remove(self)
    
    def onOpen(self):
        print("Connection open")
        s = "Initial message!"
        payload = s.encode('utf8')
        self.sendMessage(payload, isBinary = False)
    
    @classmethod
    def broadcast_message(cls,messageString):
        payload = messageString.encode('utf8')
        for c in connections:
            reactor.callFromThread(cls.sendMessage, c, payload)



def start_decoder(helper):
    args = ["bash","./decoder/runtest.sh"]
    if haveSDR:
        args = ["bash","./decoder/testingtools/decode.sh",frequency]
    process = subprocess.Popen(args,stdout=subprocess.PIPE)
    for line in iter(process.stdout.readline,''):
        helper(line.strip())

#Send a line of data to client
def send_line(line):
    # If filtering is enabled, ignore data from wrong callsign.
    if(filterCallsign and callsign not in line):
        return

    if len(line) > 0 and line[0] == "[":
        try:
            datapoint = parseBRB(line)
        except:
            datapoint = {}
            datapoint["error"] = True
            datapoint["errorMessage"] = sys.exc_info()[0]
            datapoint["timestring"] = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
            datapoint["timestamp"] = time.time()*1000  #Gives ms as a floating point.
            datapoint["raw"] = line

        if doWebSocket:
            APRSServerProtocol.broadcast_message(datapoint)
        logData(datapoint)
        #print parseBRB(line)
        print datapoint
    elif "alt" in line:
        print line
        print strftime("%Y-%m-%d %H:%M:%S\n",localtime())

#Repeatedly broadcast example data from a file.
def testFromFile(filename):
    f = open(filename)
    s = f.read()
    f.close()
    testData = json.loads(s)

    if doInitialPause:
        time.sleep(10)

    i = 0
    while True:
        if doWebSocket:
            APRSServerProtocol.broadcast_message(json.dumps(testData[i]))
        logData(json.dumps(testData[i]))
        print testData[i]
        i = (i + 1) % len(testData)
        if i == 0 and (not doRepeat):
            break
        time.sleep(playbackSpeed)
        

#log a data point, if the appropriate flag is set
def logData(latestData):
    if doLogData:
        #Stored as a comma-separated list of JSON objects,
        # which is not valid JSON but can easily be converted into a JSON list.
        f = open("log.json","a")
        f.write(latestData + ",\n")
        f.close() 

def main():
    #create and start server
    mainLooper = lambda:start_decoder(send_line)

    if doTestFromFile:
        mainLooper = lambda:testFromFile("data.json")
    else:
        mainLooper = lambda:start_decoder(send_line)


    if doWebSocket:
        #start decoder
        #thread.start_new_thread(lambda:start_decoder(send_line),())
        thread.start_new_thread(mainLooper,())

        factory = WebSocketServerFactory()
        factory.protocol = APRSServerProtocol
        reactor.listenTCP(9000, factory)
        reactor.run()
    else:
        mainLooper()
    

main()
