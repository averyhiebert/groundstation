import subprocess

import logging
import sys
import time
import thread
from twisted.python import log
from twisted.internet import reactor

from autobahn.twisted.websocket import WebSocketServerProtocol
from autobahn.twisted.websocket import WebSocketServerFactory


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
        if line[0] == "[":
            helper(line.strip())

#Send a line of data to client
def handle_line(line):
    #frameText = line.split(":",2)[1]
    APRSServerProtocol.broadcast_message(line)
    print line




def main():
    #start decoder
    thread.start_new_thread(lambda:start_decoder(handle_line),())

    #create and start server
    factory = WebSocketServerFactory()
    factory.protocol = APRSServerProtocol
    reactor.listenTCP(9000, factory)
    reactor.run()
    

main()
