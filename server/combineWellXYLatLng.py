import csv
import json

with open('./data/well_logging.json', 'r') as f:
    data = json.loads(f.read())
    csvList = []
    with open('./data/id_loc_ori.csv', 'r') as f2:
        csvF = csv.reader(f2)
        for row in csvF:
            csvList.append(row)
    for d in data:
        for row in csvList:
            if d['id'] == row[0]:
                d['x'] = float(row[1])
                d['y'] = float(row[2])
    with open('./data/well_location.json', 'w') as f3:
        f3.write(json.dumps(data))
