from obspy.io.segy.segy import iread_segy

filename = './data/zh1qu_gudaofulin_3d.segy'




for index, tr in enumerate(iread_segy(filename)):
    print(tr)