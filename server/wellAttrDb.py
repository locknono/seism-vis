from pymongo import MongoClient
import pymongo
import time

import threading
import multiprocessing as mp
from multiprocessing import Pool
import numpy as np
from global_variable import *
import logging
import json

logging.basicConfig(level=logging.INFO)
client = MongoClient('localhost', 27017)
db = client.zh_seism
wellAttr=db.wellAttr


def createWellAttrCollectionIndex():
    wellAttr.create_index([('id', pymongo.ASCENDING)])
    print('索引建立完成')
createWellAttrCollectionIndex()