from itertools import islice
from obspy.io.segy.segy import iread_segy
import csv

segyFile = './data/zh1qu_gudaofulin_3d.segy'
segyFile='./data/gudao_sgy.sgy'

"""
iread_segy(segyFile,unpack_headers=True)
"""

_index=0
for tr in iread_segy(segyFile):
    tr=tr
    tf = tr.stats.segy.textual_file_header
    bf = tr.stats.segy.binary_file_header
    tfe = tr.stats.segy.textual_file_header_encoding
    de = tr.stats.segy.data_encoding
    e = tr.stats.segy.endian
    _index+=1
    if _index>=100:
        break
