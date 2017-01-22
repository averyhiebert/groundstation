#Simply reads incoming data and displays it with timestamp

import subprocess
from time import localtime, strftime


def start_decoder(helper):
    args = ["bash","./decoder/runtest.sh"]
    process = subprocess.Popen(args,stdout=subprocess.PIPE)
    for line in iter(process.stdout.readline,''):
        helper(line.strip())

#Send a line of data to client
def handle_line(line):
    if len(line) > 0 and line[0] == "[":
        print line
    elif "alt" in line:
        print line
        print strftime("%Y-%m-%d %H:%M:%S\n",localtime())


start_decoder(handle_line)
