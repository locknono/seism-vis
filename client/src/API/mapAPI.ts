import { Well, AllWells, Path, CoupleWell } from "../ts/Type";
import { voronoi } from "d3";
import * as L from "leaflet";
import { voronoiStrokeWidth, voronoiStrokeColor } from "../constraint";
import * as d3 from "d3";
const xStart = 20652500;
const yStart = 4190300.16;
const xySection = 25;

export function idIndexMap(allWells: AllWells) {
  const map: Map<string, number> = new Map();
  allWells.map((e, i: number) => {
    map.set(e.id, i);
  });
  return map;
}

export function getNearIndexList(allWells: AllWells) {
  const map = idIndexMap(allWells);
  return fetch("./data/nearList.json")
    .then(r => r.json())
    .then((data: any) => {
      const indexList: [number, number][] = [];
      for (const w of data) {
        const index1 = map.get(w.id);
        for (const nearWellID of w.nearList) {
          const index2 = map.get(nearWellID);
          indexList.push([index1 as number, index2 as number]);
        }
      }
      return indexList;
    });
}

export function getNearWellIndex(id: string, allWells: AllWells) {
  const map = idIndexMap(allWells);
  return fetch("./data/nearList.json")
    .then(r => r.json())
    .then((data: any) => {
      const indexList: number[] = [];
      for (const w of data) {
        if (w.id === id) {
          for (const nearWellID of w.nearList) {
            const index = map.get(nearWellID);
            indexList.push(index as number);
          }
        }
      }
      return indexList;
    });
}

export function getPointsOnLine(line: Path): [number, number][] {
  const x1: number = (line[0][0] - xStart) / xySection;
  const y1: number = (line[0][1] - yStart) / xySection;
  const x2: number = (line[1][0] - xStart) / xySection;
  const y2: number = (line[1][1] - yStart) / xySection;
  const matrixCoors: any = [[x1, y1], [x2, y2]].map(e => e.map(Math.floor));
  const smallerX = matrixCoors[0][0] < matrixCoors[1][0] ? 0 : 1;
  const biggerX = matrixCoors[0][0] < matrixCoors[1][0] ? 1 : 0;
  let k;
  const pointsOnLine: [number, number][] = [];
  if (matrixCoors[0][0] - matrixCoors[1][0] !== 0) {
    k =
      (matrixCoors[0][1] - matrixCoors[1][1]) /
      (matrixCoors[0][0] - matrixCoors[1][0]);
    const b = matrixCoors[0][1] - matrixCoors[0][0] * k;
    for (
      let x = matrixCoors[smallerX][0];
      x <= matrixCoors[biggerX][0];
      x += 0.05
    ) {
      let y = Math.floor(k * x + b);
      let exist = false;
      for (let i = 0; i < pointsOnLine.length; i++) {
        let p = pointsOnLine[i];
        if (equal(p[0], p[1], Math.floor(x), y)) exist = true;
      }
      if (!exist) pointsOnLine.push([Math.floor(x), y]);
    }
    let lastPoint = pointsOnLine[pointsOnLine.length - 1];
    if (
      lastPoint[0] !== matrixCoors[biggerX][0] ||
      lastPoint[1] !== matrixCoors[biggerX][1]
    ) {
      pointsOnLine.push([matrixCoors[biggerX][0], matrixCoors[biggerX][1]]);
    }
  } else {
    for (let i = matrixCoors[smallerX][1]; i <= matrixCoors[biggerX][1]; i++) {
      pointsOnLine.push([matrixCoors[0][0], i]);
    }
  }
  if (pointsOnLine.length === 0) {
    return matrixCoors;
  }
  if (matrixCoors[0][0] === pointsOnLine[0][0]) {
    return pointsOnLine;
  } else {
    return pointsOnLine.reverse();
  }
  //Ensure the last point is on line

  function equal(x1: number, y1: number, x2: number, y2: number): boolean {
    return x1 === x2 && y1 === y2;
  }
}

export function mapapi_getWellIDNearLine(
  pointsOnLine: number[][],
  allWells: AllWells,
  coupleWell: CoupleWell
): [string[], number[]] {
  /*this method can speed up by tranform the 
  structure of `allWells` from list to hashmap*/
  const wellIDNearLine: Set<string> = new Set();
  const wellIDNearLineIndexOnLine = [];
  for (let i = 0; i < pointsOnLine.length; i++) {
    for (let j = 0; j < allWells.length; j++) {
      let cellPoint: [number, number] = [
        allWells[j].xOnMatrix,
        allWells[j].yOnMatrix
      ];
      if (ifInCell(cellPoint, pointsOnLine[i])) {
        wellIDNearLine.add(allWells[j].id);
        wellIDNearLineIndexOnLine.push((i + 1) / pointsOnLine.length);
        break;
      }
    }
  }

  let wellIDNearLineList = Array.from(wellIDNearLine);
  //ensure the first well of couple well is gotten
  //in the first cell
  wellIDNearLineList[0] = coupleWell[0];
  wellIDNearLineList[wellIDNearLineList.length - 1] = coupleWell[1];

  wellIDNearLineIndexOnLine[0] = 0;
  wellIDNearLineIndexOnLine[wellIDNearLineIndexOnLine.length - 1] = 1;

  return [wellIDNearLineList, wellIDNearLineIndexOnLine];

  function ifInCell(
    cellPoint: [number, number],
    pointOnLine: number[]
  ): boolean {
    return cellPoint[0] === pointOnLine[0] && cellPoint[1] === pointOnLine[1];
  }
}

export function fetchMatrixData(pointsOnLine: [number, number][]) {
  return fetch("http://localhost:5000/returnDrawLineData/", {
    body: JSON.stringify(pointsOnLine),
    credentials: "same-origin",
    headers: {
      "content-type": "application/json"
    },
    method: "POST",
    mode: "cors"
  }).then(res => {
    if (res.ok) {
      return res.json();
    }
    return [[]];
  });
}

export function fetchWellAttrData(id1: string, id2: string) {
  const coupleWellId = `${id1}_${id2}`;
  return fetch(`http://localhost:5000/wellAttr/${coupleWellId}`, {}).then(
    res => {
      if (res.ok) {
        return res.json();
      }
      return [];
    }
  );
}

export function resetCircleStyle(circle: L.Circle) {
  circle.setRadius(5).setStyle({
    color: "#3388ff"
  });
}

export function setSelectedCircleStyle(circle: L.Circle) {
  circle.setRadius(5).setStyle({
    color: "#E80D0C"
  });
}

export function getWellLatLngBound() {}
export function generateVoronoi(wells: AllWells, map: L.Map) {
  //TODO:result coule be memorized
  const voronoiView = voronoi()
    .x(function(d: any) {
      return d.latlng[1];
    })
    .y(function(d: any) {
      return d.latlng[0];
    })
    .extent([[-1, -1], [200, 200]]);
  const withDataVoronoi = voronoiView(wells as any);
  const links = withDataVoronoi.links();
  const polygons = withDataVoronoi.polygons();
  const triangles = withDataVoronoi.triangles();
  const cells = withDataVoronoi.cells;
  const edges = withDataVoronoi.edges;
  const voronoiLayers: L.Polyline[] = [];
  for (let link of links) {
    const points = [(link.source as any).latlng, (link.target as any).latlng];
    const voronoiPath = L.polyline(points, {
      fill: false,
      color: voronoiStrokeColor,
      weight: voronoiStrokeWidth //TODO:width should depend on uncertainty);
    });
    voronoiLayers.push(voronoiPath);
  }
  const voronoiLayerGroup = L.layerGroup(voronoiLayers).setZIndex(-200); //z-index does not work
  voronoiLayerGroup.addTo(map);
}

export function withDataVoronoi(wells: AllWells, map: L.Map) {
  const mapCollection = idIndexMap(wells);
  return d3.csv("./data/voronoi_uc.csv").then(data => {
    const voronoiLayers: L.Polyline[] = [];
    const values = [];
    for (let link of data) {
      const { id1, id2, value } = link;
      if (!id1 || !id2 || !value) return;
      values.push(parseInt(value));
      if (!mapCollection.has(id1) || !mapCollection.has(id2)) continue;
      const well1 = wells[mapCollection.get(id1) as number];
      const well2 = wells[mapCollection.get(id2) as number];
      const points = [(well1 as any).latlng, (well2 as any).latlng];
      const color = colorScale(parseInt(value));
      const voronoiPath = L.polyline(points, {
        fill: false,
        color: color,
        interactive: false,
        weight: voronoiStrokeWidth //TODO:width should depend on uncertainty);
      });
      voronoiLayers.push(voronoiPath);
    }
    const voronoiLayerGroup = L.layerGroup(voronoiLayers).setZIndex(-200); //z-index does not work
    voronoiLayerGroup.addTo(map);
    return voronoiLayerGroup;
  });
}

function colorScale(value: number) {
  const min = 5;
  const max = 40;
  const scale = d3
    .scaleLinear()
    .domain([min, max])
    .range([0, 1]);
  const color = d3.interpolate("yellow", "red");
  return color(scale(value));
}
