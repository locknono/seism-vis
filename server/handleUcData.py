import csv
import json

with open('./data/ucSum.csv', 'r')as f:
    csvF = csv.reader(f)
    map = {}
    writeList = []
    for row in csvF:
        id1 = row[0]
        id2 = row[1]
        value = int(row[2])
        if id1 in map:
            map[id1]['value'] += value
            map[id1]['count'] += 1
        else:
            map[id1] = {"value": value, "count": 1}
    for key in map:
        map[key]['value'] = map[key]['value'] / map[key]['count']
        write = {}
        write['id'] = key
        write['value'] = map[key]['value']
        writeList.append(write)
    with open('../client/public/data/ucSum.json', 'w')as f2:
        f2.write(json.dumps(writeList))
