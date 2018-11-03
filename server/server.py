from flask import Flask, Response, request
from seismdb import SeismDb
import json
from matrix import Drawer
import matplotlib.pyplot as plt
import matplotlib
import numpy as np
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.figure import Figure
import random
from flask import send_file
import io

from flask import Flask, make_response
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import io
import base64
from flask_cors import CORS
from global_variable import *

app = Flask(__name__)
CORS(app)

db = SeismDb()
plt.ioff()
plt.axis('off')
matplotlib.use('Agg')


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


@app.route('/drawLine/', methods=['GET', 'POST'])
def drawLine():
    ods = json.loads(request.data.decode("utf-8"))
    matrix = []
    for p in ods:
        zArray = db.trace.find_one({"x": xStart + p[0] * xySection, "y": yStart + int(p[1]) * xySection})['z']
        matrix.append(zArray)

    fig = plt.imshow((matrix), vmin=vmin, vmax=vmax, cmap=plt.get_cmap("Greys"))
    fig.axes.get_xaxis().set_visible(False)
    fig.axes.get_yaxis().set_visible(False)
    sio = io.BytesIO()
    plt.savefig(sio, format='png', bbox_inches='tight', pad_inches=0)
    sio.seek(0)

    data = base64.encodebytes(sio.getvalue()).decode()

    """
    html = '''
              <img src="data:image/png;base64,{}" />    
            '''
    res = Response(html.format(data), mimetype='text/xml')
    res.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    res.headers['Access-Control-Allow-Methods'] = 'POST'
    """
    resURL = Response(data, mimetype='text/xml')
    resURL.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    resURL.headers['Access-Control-Allow-Methods'] = 'POST'

    sio.close()

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


if __name__ == '__main__':
    app.run()
