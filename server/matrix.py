import matplotlib.pyplot as plt
from mpl_toolkits.axes_grid1 import make_axes_locatable
import os
from seismdb import SeismDb
import matplotlib
import logging
from global_variable import *


class Drawer():
    def __init__(self):
        self.db = SeismDb()

    def drawTightMatrix(self, plane_name, depth, saveDir=''):
        matrix = self.db.queryMatrix(plane_name, depth)
        print(matrix)
        fig = plt.imshow(matrix, vmin=vmin, vmax=vmax, cmap=plt.get_cmap("Greys"))
        fig.axes.get_xaxis().set_visible(False)
        fig.axes.get_yaxis().set_visible(False)
        if saveDir == '':
            plt.show()
        else:
            path = os.path.join(saveDir, '{0}.png'.format(depth))
            if os.path.exists(path):
                logging.info('{0}已存在'.format(depth))
            else:
                try:
                    plt.savefig(path, bbox_inches='tight', pad_inches=0)
                    logging.info('{0}_{1}绘制完成'.format(plane_name, depth))
                    plt.close()
                except FileNotFoundError:
                    os.mkdir(saveDir)
                    plt.savefig(path, bbox_inches='tight', pad_inches=0)
        plt.ioff()
        plt.axis('off')

    def drawMatrix(self, plane_name, depth, saveDir=''):
        matrix = self.db.queryMatrix(plane_name, depth)
        fig, ax = plt.subplots()
        im = ax.matshow(matrix, vmin=vmin, vmax=vmax)
        divider = make_axes_locatable(ax)
        cax = divider.new_horizontal(size="5%", pad=0.3, pack_start=False)
        fig.add_axes(cax)
        cbar = fig.colorbar(im, cax=cax, orientation="vertical", extend='both')
        cbar.minorticks_on()
        if saveDir == '':
            plt.show()
        else:
            path = os.path.join(saveDir, '{0}.png'.format(depth))
            if os.path.exists(path):
                logging.info('{0}已存在'.format(depth))
            else:
                try:
                    plt.savefig(path)
                    plt.close(fig)
                    logging.info('{0}_{1}绘制完成'.format(plane_name, depth))
                except FileNotFoundError:
                    os.mkdir(saveDir)
                    plt.savefig(path)
                    plt.close(fig)

    def drawCoors(self, x, y):
        matrix = [self.db.queryByOneCoord(x, y)]
        fig = plt.imshow(matrix, vmin=vmin, vmax=vmax, aspect='auto')
        fig.axes.get_xaxis().set_visible(False)
        fig.axes.get_yaxis().set_visible(False)
        return fig

    def drawBound(self, ox, oy, tx, ty):
        matrix = self.db.queryBound(ox, oy, tx, ty)
        fig = plt.imshow(matrix, vmin=vmin, vmax=vmax, aspect='auto')
        fig.axes.get_xaxis().set_visible(False)
        fig.axes.get_yaxis().set_visible(False)
        return fig


def drawAll():
    logging.basicConfig(level=logging.INFO)
    matplotlib.use('Agg')
    plt.ioff()
    plt.axis('off')

    drawer = Drawer()
    """
    for i in range(0, zDepth):
        drawer.drawTightMatrix("xy", i, './imgs/xy/')
    
    for i in range(0,rowCount):
        drawer.drawTightMatrix('xz', i, './imgs/{0}/'.format('xz'))

    for i in range(0, colCount):
        drawer.drawTightMatrix('yz', i, './imgs/{0}/'.format('yz'))
    """


if __name__ == '__main__':
    drawer = Drawer()
    drawAll()
