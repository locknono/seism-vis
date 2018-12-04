import json
import csv


writeList = []
with open('./data/rangeDept_gzy.json', 'r') as f:
    for row in f.readlines():
        jsonRow = json.loads(row)
        jsonRow.pop('_id')
        jsonRow.pop('latlng')
        jsonRow.pop('basic_attr')
        writeList.append(jsonRow)

with open('./data/rangeDept_gzy2.json', 'w') as f:
    f.write(json.dumps(writeList))



"""
with open('./data/rangeDept2.json', 'r') as f:
    writeList = json.loads(f.read())
    minList = [99999, 99999, 99999, 99999, 99999, 99999]
    maxList = [-99999, -99999, -99999, -99999, -9999, -99999]
    for well in writeList:
        wellValue = well['value']
        for values in wellValue:
            for index, value in enumerate(values):
                if index == 0:
                    continue
                try:
                    if value <= -9999:
                        continue
                    if value < minList[index]:
                        minList[index] = value
                    if value > maxList[index]:
                        maxList[index] = value
                except:
                    pass
"""