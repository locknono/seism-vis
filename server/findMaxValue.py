from itertools import islice
from obspy.io.segy.segy import iread_segy
import csv
from global_variable import *
from pymongo import MongoClient
import logging
import pymongo
import time

min = 0
max = 0
for index, tr in enumerate(iread_segy(segyFile)):
    for value in tr.data:
        if value > max:
            max = value
        if value < min:
            min = value
print(min, max)
