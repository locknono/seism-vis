from sklearn.neighbors import NearestNeighbors
import numpy as np
import json

with open('./data/well_location.json', 'r')as f:
    wells = json.loads(f.read())
    points = []
    for well in wells:
        point = [well['x'], well['y']]
        points.append(point)
    X = np.array(points)
    nbrs = NearestNeighbors(n_neighbors=6, algorithm='ball_tree').fit(X)
    distances, indices = nbrs.kneighbors(X)

    nearIDOutput = []
    for index, row in enumerate(indices):
        wellID = wells[index]['id']
        nearIDList = []
        for nearIndex in row:
            nearIDList.append(wells[nearIndex]['id'])
        nearIDList.pop(0)
        thisWell = {"id": wellID, "nearList": nearIDList}
        nearIDOutput.append(thisWell)
    with open('./data/nearList.json', 'w') as f2:
        f2.write(json.dumps(nearIDOutput))

    distances
