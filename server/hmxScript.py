import csv
import pymongo
import json

"""
writeList = []
with open('./data/allDept.json', 'r') as f:
    for row in f.readlines():
        jsonRow = json.loads(row)
        jsonRow.pop('_id')
        jsonRow.pop('latlng')
        jsonRow.pop('basic_attr')
        writeList.append(jsonRow)

with open('./data/allDept2.json', 'w') as f:
    f.write(json.dumps(writeList))
"""


f = open("./data/id_loc_final.csv", 'r')
id_data = csv.reader(f)
id_arr = []
index = 0
for row in id_data:
    if index > 0:
        id_arr.append(row[0])
    index += 1
print(id_arr)

mongoClient = pymongo.MongoClient("localhost", port=27017)
db = mongoClient['well']
collection = db['allDept']
co_range = db['dept_rangeData']


def judge(cd):
    return (cd[0] >= 1000) and (cd[0] <= 1444)


index = 0
for id in id_arr:
    print(index)
    tmp_data = collection.find({'id': id})
    for t in tmp_data:
        tmp_value = t['value']
        fcd = list(filter(judge, tmp_value))
        t['value'] = fcd
        co_range.insert_one(t)
    index += 1