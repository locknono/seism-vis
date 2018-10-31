from itertools import islice
from obspy.io.segy.segy import iread_segy
import csv
from global_variable import *
from pymongo import MongoClient
import logging
import pymongo
import time

logging.basicConfig(level=logging.INFO)

"""
iread_segy(segyFile,unpack_headers=True)
"""

client = MongoClient('localhost', 27017)
db = client.zh_seism
trace = db.trace
zCollection = db.z


# 321*309
def createTraceCollection():
    #trace.drop()
    for index, tr in enumerate(iread_segy(segyFile)):
        logging.info(index)
        colNumber = (index % yDepth)
        rowNumber = ((index // yDepth))

        xCoor = xStart + xySection * colNumber
        yCoor = yStart + xySection * rowNumber
        trace.insert_one({"x": xCoor, "y": yCoor, "z": (tr.data).tolist()})


def dropZColeection():
    #zCollection.drop()


def createZCollection():
    arrayCount = 50
    for level in range(0, 3000, arrayCount):
        zArrays = []
        for i in range(arrayCount):
            zArrays.append([])
            zArrays.append([])
        cur = time.time()
        logging.info(level)
        for index, tr in enumerate(iread_segy(segyFile)):
            rowNumber = index // yDepth
            colNumber = index % yDepth
            if colNumber == 0:
                for i in range(arrayCount):
                    zArrays[i].append([])
            for i in range(arrayCount):
                zArrays[i][rowNumber].append(float(tr.data[level+i]))
        logging.info(time.time() - cur)
        for i in range(arrayCount):
            zCollection.insert_one({"z": zArrays[i], "level": level+i})

def createIndex():
    trace.create_index([('x', pymongo.ASCENDING)])
    print("x索引建立完成")

    trace.create_index([('x', pymongo.ASCENDING), ("y", pymongo.ASCENDING)])
    print("x,y 索引建立完成")

    trace.create_index([('y', pymongo.ASCENDING)])
    print("y索引建立完成")

    zCollection.create_index([('level', pymongo.ASCENDING)])

if __name__ == '__main__':
    #dropZColeection()
    createZCollection()
    createTraceCollection()
    createIndex()
