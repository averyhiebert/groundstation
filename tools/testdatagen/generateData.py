import numpy as np
import random
import json
import time

def normalize(v):
    norm = np.linalg.norm(v)
    if norm == 0:
        return v
    return v/norm

datapoints = []
currentLocation = np.array([-123.31116666666667,48.46066666666667])
delta1 = np.array([0,0])
delta2 = np.array([0,0])
currentAlt = 285
ad1 = 0
ad2 = 0
for i in range(3600):
   d = 0.01*normalize(np.array([random.gauss(0,1),random.gauss(0,1)]))
   ad = random.gauss(0,10)

   delta2 = delta1
   delta1 = d
   currentLocation = currentLocation + delta1 + delta2
   if abs(currentLocation[0]) > 179 or abs(currentLocation[1]) > 80:
      currentLocation = np.array([-123.31116666666667,48.46066666666667])


   ad2 = ad1
   ad1 = ad
   currentAlt = currentAlt + ad1 + ad2

   point = {}
   point["latitude"] = currentLocation[1]
   point["longitude"] = currentLocation[0]
   point["altitude"] = currentAlt
   point["raw"] = "Test data"
   point["error"] = False
   point["timestring"] = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
   point["timestamp"] = time.time()*1000  #Gives ms as a floating point.

  
   datapoints.append(point) 

f = open("data.json","w")
f.write(json.dumps(datapoints))
f.close()
