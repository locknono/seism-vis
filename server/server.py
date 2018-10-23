from flask import Flask, Response, request
from seismdb import SeismDb
import json
from matrix import Drawer
import matplotlib.pyplot as plt
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

app = Flask(__name__)

db = SeismDb()


@app.route('/')
def hello():
    return 'Hello World'


# coors should be in "x-y" form
@app.route('/xy/<coors>')
def sendPolyLineData(coors):
    x = int(coors.split('-')[0])
    y = int(coors.split('-')[1])
    drawer = Drawer()
    drawer.drawCoors(x, y)
    sio = io.BytesIO()
    plt.savefig(sio, format='png')
    sio.seek(0)

    data = base64.encodebytes(sio.getvalue()).decode()

    html = '''
          <img src="data:image/png;base64,{}" />    
        '''

    res = Response(html.format(data), mimetype='text/xml')
    res.headers['Access-Control-Allow-Origin'] = '*'
    sio.close()
    plt.close()
    return res


@app.route('/showXY/', methods=['GET', 'POST'])
def show_user_profiile2():
    xyArray = request.values
    ods = request.data.decode("utf-8")
    ox = int(ods.split(',')[0])
    oy = int(ods.split(',')[1])
    tx = int(ods.split(',')[2])
    ty = int(ods.split(',')[3])

    drawer = Drawer()
    fig = drawer.drawBound(ox, oy, tx, ty)
    sio = io.BytesIO()
    plt.savefig(sio, format='png')
    sio.seek(0)

    data = base64.encodebytes(sio.getvalue()).decode()

    html = '''
              <img src="data:image/png;base64,{}" />    
            '''
    res = Response(html.format(data), mimetype='text/xml')

    res.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    res.headers['Access-Control-Allow-Methods'] = 'POST'
    sio.close()
    plt.close()
    return res


if __name__ == '__main__':
    app.run(threaded=False)
