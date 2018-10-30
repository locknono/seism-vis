from obspy.io.segy.core import _read_segy
from obspy.core.util import get_example_file
# or 'from obspy import read' if file wide headers are of no interest
filename = './data/gudao_sgy.sgy'
#filename = './data/zh1qu_gudaofulin_3d.segy'
st = _read_segy(filename,unpack_trace_headers=True)
print(st[0].stats.segy.trace_header)
