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

# Set congfiguration settings
# (TODO: read from config file)
doWebSocket = True
doTestFromFile = True
frequency = "144M"


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
    process = subprocess.Popen(args,stdout=subprocess.PIPE)
    for line in iter(process.stdout.readline,''):
        helper(line.strip())

#Send a line of data to client
def send_line(line):
    if len(line) > 0 and line[0] == "[":
        if doWebSocket:
            APRSServerProtocol.broadcast_message(parseBRB(line))
        #print parseBRB(line)
        print line
    elif "alt" in line:
        print line
        print strftime("%Y-%m-%d %H:%M:%S\n",localtime())

def testFromFile(filename):
    f = open(filename)
    s = f.read()
    f.close()
    testData = json.loads(s)

    i = 0
    while True:
        if doWebSocket:
            APRSServerProtocol.broadcast_message(json.dumps(testData[i]))
        print testData[i]
        i = (i + 1) % len(testData)
        time.sleep(1)

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
