import math
from global_variable import *
import json


def GetLatLon2(C, B, IsSix=True):
    # 带号
    D = math.trunc(C / 1000000)
    # 中央经线（单位：弧度）
    K = 0
    if IsSix:
        K = D * 6 - 3  # 6度带计算
    else:
        K = D * 3  # 3度带计算
    L = B / (6378245 * (1 - 0.006693421623) * 1.0050517739)
    M = L + (0.00506237764 * math.sin(2 * L) / 2 - 0.00001062451 * math.sin(4 * L) / 4 + 0.0000002081 * math.sin(
        6 * L) / 6) / 1.0050517739
    N = L + (0.00506237764 * math.sin(2 * M) / 2 - 0.00001062451 * math.sin(4 * M) / 4 + 0.0000002081 * math.sin(
        6 * M) / 6) / 1.0050517739
    O = L + (0.00506237764 * math.sin(2 * N) / 2 - 0.00001062451 * math.sin(4 * N) / 4 + 0.0000002081 * math.sin(
        6 * N) / 6) / 1.0050517739
    P = L + (0.00506237764 * math.sin(2 * O) / 2 - 0.00001062451 * math.sin(4 * O) / 4 + 0.0000002081 * math.sin(
        6 * O) / 6) / 1.0050517739
    Q = L + (0.00506237764 * math.sin(2 * P) / 2 - 0.00001062451 * math.sin(4 * P) / 4 + 0.0000002081 * math.sin(
        6 * P) / 6) / 1.0050517739
    R = L + (0.00506237764 * math.sin(2 * Q) / 2 - 0.00001062451 * math.sin(4 * Q) / 4 + 0.0000002081 * math.sin(
        6 * Q) / 6) / 1.0050517739
    S = math.tan(R)
    T = 0.006738525415 * (math.cos(R)) ** 2
    U = 6378245 / math.sqrt(1 - 0.006693421623 * (math.sin(R)) ** 2)
    V = 6378245 * (1 - 0.006693421623) / (math.sqrt((1 - 0.006693421623 * (math.sin(R)) ** 2))) ** 3
    W = 5 + 3 * S ** 2 + T - 9 * T * S ** 2
    X = 61 + 90 * S ** 2 + 45 * S ** 4
    Y = 1 + 2 * S ** 2 + T ** 2
    Z = 5 + 28 * S ** 2 + 24 * S ** 4 + 6 * T + 8 * T * S ** 2
    Lat = (180 / math.pi) * (
            R - (C - D * 1000000 - 500000) ** 2 * S / (2 * V * U) + (C - D * 1000000 - 500000) ** 4 * W / (
            24 * U ** 3 * V) - (C - D * 1000000 - 500000) ** 6 * X / (7200 * U ** 5 * V))
    Lon = (180 / math.pi) * (C - D * 1000000 - 500000) * (
            1 - (C - D * 1000000 - 500000) ** 2 * Y / (6 * U ** 2) + (C - D * 1000000 - 500000) ** 4 * Z / (
            120 * U ** 4)) / (U * math.cos(P))
    Lat = Lat
    Lon = K + Lon
    return [Lat, Lon]


def generateGrid():
    paths = []
    for x in range(xStart, xEnd + xySection, xySection):
        p1 = GetLatLon2(x, yStart)
        p2 = GetLatLon2(x, yEnd)
        paths.append([p1, p2])
    for y in range(int(yStart), int(yEnd + xySection), xySection):
        p1 = GetLatLon2(xStart, y+0.16)
        p2 = GetLatLon2(xEnd, y+0.16)
        paths.append([p1, p2])
    with open('../client/public/data/gridData.json', 'w', encoding='utf-8')as f:
        f.write(json.dumps(paths))


if __name__ == '__main__':
    print(GetLatLon2(xStart, yStart))
    print(GetLatLon2(xStart, yEnd))
    print(GetLatLon2(xEnd, yEnd))
    print(GetLatLon2(xEnd, yStart))
    generateGrid()