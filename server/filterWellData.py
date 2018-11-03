import csv
import json
import math


def attrVaild(attrName, d):
    if attrName in d:
        try:
            float(d[attrName])
            return True
        except:
            return False


filterWellData = []
with open('./data/originalWellData.json', 'r', encoding='utf-8') as f:
    wellData = json.loads(f.read())
    for d in wellData:
        well = {}
        well['fullID'] = d['ID_full']
        well['x'] = float(d['X'])
        well['y'] = float(d['Y'])
        well['flag'] = d['Flag']
        if attrVaild('Top_depth', d) and attrVaild('Bot_depth', d):
            well['topDepth'] = float(d['Top_depth'])
            well['bottomDepth'] = float(d['Bot_depth'])
            well['height'] = float(format(math.fabs(float(d['Top_depth']) - float(d['Bot_depth'])), '.1f'))
            # 如果top>bottom要调换
            if well['topDepth'] > well['bottomDepth']:
                temp = well['topDepth']
                well['topDepth'] = well['bottomDepth']
                well['bottomDepth'] = temp
        elif attrVaild('Top_depth', d) and attrVaild('Sandstone', d):
            well['topDepth'] = float(d['Top_depth'])
            well['height'] = float(d['Sandstone'])
            well['bottomDepth'] = float(d['Top_depth']) + float(d['Sandstone'])
        elif attrVaild('Bot_depth', d) and attrVaild('Sandstone', d):
            well['bottomDepth'] = float(d['Bot_depth'])
            well['height'] = float(d['Sandstone'])
            well['topDepth'] = float(d['Bot_depth']) - float(d['Sandstone'])
        # 如果topDepth和botDepth都无效，那么高度自然也就没有意义
        filterWellData.append(well)
with open('./data/filteredWellData.json', 'w', encoding='utf-8') as f:
    f.write(json.dumps(filterWellData))

idSet = set()
flags=[]

for d in filterWellData:
    idSet.add(d['fullID'])

for d in filterWellData:
    flags.append(d['flag'])
    if len(flags) == 33:
        break

groupWellData = []

for wellID in list(idSet):
    well = {}
    well['id'] = wellID
    well['value'] = []
    for d in filterWellData:
        ID = d['fullID']
        x = d['x']
        y = d['y']
        if ID == well['id']:
            well['x'] = x
            well['y'] = y
            if 'topDepth' in d:
                value = {'topDepth': d['topDepth'], 'bottomDepth': d['bottomDepth'], 'height': d['height'],
                         'flag': d['flag']}
                well['value'].append(value)
            else:
                continue
    groupWellData.append(well)

for d in groupWellData:
    values=[]
    for flag in flags:
        for layer in d['value']:
            if layer['flag']==flag:
                flagLayer=layer
                break
        else:
            flagLayer={"flag":flag}
        values.append(flagLayer)
    d['value']=values
"""
with open('./groupWellData.json', 'w', encoding='utf-8') as f:
    f.write(json.dumps(groupWellData))
"""