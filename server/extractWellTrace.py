from itertools import islice
from obspy.io.segy.segy import iread_segy
import csv
from pymongo import MongoClient
import logging
import pymongo
import time
from global_variable import *
import math
import json

dict2 = {}
outList = []
with open('./data/allWells.json', 'r') as f:
    allWells = json.loads(f.read())
    for index, tr in enumerate(iread_segy(segyFile)):
        logging.info(index)
        colNumber = (index % yDepth)
        rowNumber = ((index // yDepth))
        id = '_' + str(colNumber) + '-' + str(rowNumber)
        for well in allWells:
            xy = '_' + str(well['xOnMatrix']) + '-' + str(well['xOnMatrix'])
            if xy == id:
                out = {}
                out['id'] = well['id']
                out['value'] = tr.data.tolist()
                outList.append(out)
        logging.log(colNumber, rowNumber)
with open('./data/12.8data.json', 'w') as f:
    f.write(json.dumps(outList))
