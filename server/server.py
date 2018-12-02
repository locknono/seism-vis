from flask import Flask, Response, request
from seismdb import SeismDb
import json
import matplotlib.pyplot as plt
import matplotlib
from flask import Flask
import io
import base64
from flask_cors import CORS
from global_variable import *
from drawRect import drawLineMatrix
import csv

app = Flask(__name__)
CORS(app)

db = SeismDb()


@app.route('/')
def hello():
    return 'Hello World'


# coors should be in "x-y" form
@app.route('/xy/<coors>')
def sendPolyLineData(coors):
    colNumber = int(coors.split('-')[0])
    rowNumber = int(coors.split('-')[1])
    zData = db.queryByOneCoord(colNumber, rowNumber)

    res = Response(json.dumps(zData), mimetype='application/json')

    return res


@app.route('/nearLineCurve/', methods=['GET', 'POST'])
def nearLineCurve():
    ids = json.loads(request.data.decode("utf-8"))
    with open('./data/groupWellData.json', 'r') as f:
        wellData = json.loads(f.read())
        returnMatchData = []
        for i in range(len(ids)):
            for j in range(len(wellData)):
                if (wellData[j]['id'] == ids[i]):
                    returnMatchData.append(wellData[j])
                    break
        res = Response(json.dumps(returnMatchData), mimetype='application/json')
        res.headers['Access-Control-Allow-Methods'] = 'POST'
        return res


@app.route('/drawLine/', methods=['GET', 'POST'])
def drawLine():
    plt.ioff()
    matplotlib.use('Agg')
    plt.axis('off')
    ods = json.loads(request.data.decode("utf-8"))
    matrix = []
    for p in ods:
        result = db.trace.find_one({"x": xStart + p[0] * xySection, "y": yStart + p[1] * xySection})
        zArray = result['z']
        matrix.append(zArray)
    sio = io.BytesIO()
    drawLineMatrix(matrix, sio)
    sio.seek(0)
    data = base64.encodebytes(sio.getvalue()).decode()
    resURL = Response(data, mimetype='text/xml')
    resURL.headers['Access-Control-Allow-Methods'] = 'POST'
    sio.close()

    return resURL


@app.route('/returnDrawLineData/', methods=['GET', 'POST'])
def returnDrawLineData():
    ods = json.loads(request.data.decode("utf-8"))
    matrix = []
    for p in ods:
        result = db.trace.find_one({"x": xStart + p[0] * xySection, "y": yStart + p[1] * xySection})
        zArray = result['z']
        matrix.append(zArray)
    for i in range(len(matrix)):
        matrix[i] = matrix[i][500:650]
    resURL = Response(str(matrix), mimetype='text/xml')
    resURL.headers['Access-Control-Allow-Methods'] = 'POST'
    return resURL


@app.route('/wellMatch/<twoID>')
def sendWellData(twoID):
    ID = twoID.split('_')[0]
    ID2 = twoID.split('_')[1]
    with open('./data/groupWellData.json', 'r') as f:
        wellData = json.loads(f.read())
        twoWellData = []
        for d in wellData:
            if d['id'] == ID or d['id'] == ID2:
                twoWellData.append(d)
            if len(twoWellData) == 2:
                break
        res = Response(json.dumps(twoWellData), mimetype='application/json')
        return res


@app.route('/storeUcSum/', methods=['GET', 'POST'])
def storeUcSum():
    try:
        data = json.loads(request.data.decode("utf-8"))
        id1 = data['id1']
        id2 = data['id2']
        value = data['value']
        with open('./data/ucSum.csv', 'a+', newline='') as f:
            csvF = csv.writer(f)
            csvF.writerow([str(id1), str(id2), str(value)])
    except:
        return 'err'
    return 'store'


@app.route('/wellAttr/<twoID>')
def sendWellData(twoID):
    ID = twoID.split('_')[0]
    ID2 = twoID.split('_')[1]
    returnData=db.queryWellAttr(ID,ID2)
    res = Response(json.dumps(returnData), mimetype='application/json')
    return res


if __name__ == '__main__':
    plt.ioff()
    matplotlib.use('Agg')
    app.run()
