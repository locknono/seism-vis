from matplotlib import pyplot as plt
from matplotlib.patches import Rectangle
import matplotlib.cm as cm
import math
from global_variable import *
import matplotlib.colors as color
from matplotlib.collections import PatchCollection

"""
d=d0*(exp(beta*t0)-1)

d0=3846
beta=0.2444
t0 : two way time(s)
"""


def getMinMaxDepth():
    d0 = 3846
    beta = 0.2444
    min = d0 * (math.exp(beta * 0.002) - 1)
    max = d0 * (math.exp(beta * 6) - 1)
    return [min, max]


def getDepthList():
    d0 = 3846
    beta = 0.2444
    depthList = []
    for i in range(2, 6000 + 2, 2):
        depth = d0 * (math.exp(beta * i / 1000) - 1)
        depthList.append(depth)
        if (depth > 2000):
            break
    return depthList[500:]


def showDepthListFig():
    d0 = 3846
    beta = 0.2444
    depthList = []
    for i in range(2, 6000 + 2, 2):
        depth = d0 * (math.exp(beta * i / 1000) - 1)
        depthList.append(depth)
    plt.plot(depthList)
def meterToPixel(meter):
    return meter / 50


def getHeightPixelList(depthList):
    pixelList = []
    pixelList.append(meterToPixel(depthList[0]))
    for i in range(1, len(depthList)):
        p = depthList[i] - depthList[i - 1]
        pixelList.append(p)
    return pixelList


def getDepthPixelList(depthList):
    pixelList = []
    for i in range(len(depthList)):
        pixelList.append(meterToPixel(depthList[i]))
    return pixelList

[minDepth, maxDepth] = getMinMaxDepth()
depthList = getDepthList()
heightPixelList = getHeightPixelList(depthList)
depthPixelList = getDepthPixelList(depthList)
xySection = 25
colorScale = cm.ScalarMappable(color.Normalize(vmin=vmin, vmax=vmax), cmap=plt.get_cmap("Greys"))


def drawLineMatrix(matrix, sio):
    for i in range(len(matrix)):
        matrix[i] = matrix[i][0:len(depthList)]
    plt.axis('off')
    plt.ioff()
    plt.subplots_adjust(hspace=0, wspace=0)
    plt.figure(figsize=(50,15))
    currentAxes = plt.gca()
    currentAxes.get_xaxis().set_visible(False)
    currentAxes.get_yaxis().set_visible(False)
    currentAxes.set_aspect('equal', adjustable='box')

    patches = []
    for rowIndex, row in enumerate(matrix):
        x = meterToPixel(rowIndex * 25)
        width = meterToPixel(xySection)
        for index, value in enumerate(row):
            y = depthPixelList[index]
            height = heightPixelList[index]
            color = colorScale.to_rgba(value)
            patches.append(Rectangle((x, y), width, height, color=color))
    currentAxes.add_collection(PatchCollection(patches, match_original=True))
    plt.xlim(0, meterToPixel(len(matrix) * 25))
    plt.ylim(0, depthPixelList[-1])
    plt.savefig(sio, format='png', bbox_inches='tight', pad_inches=0)
