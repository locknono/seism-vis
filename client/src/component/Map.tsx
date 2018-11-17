import * as React from "react";
import * as L from "leaflet";
import { connect } from "react-redux";
import {
  getAllWells,
  getCoupleWell,
  getCoupleWellLayer
} from "../action/changeWell";
import { getFigURI, getWellIDNearLine } from "../action/changeWell";
import { number } from "prop-types";

const mapStateToProps = (state: any, ownProps?: any) => {
  const scaler = state.figReducer.scaler;
  const {
    allWells,
    coupleWell,
    coupleWellLayer,
    wellIDNearLine
  } = state.wellReducer;
  const { xStart, yStart, xEnd, yEnd, xySection } = state.globalVarReducer;
  return {
    scaler,
    allWells,
    coupleWell,
    coupleWellLayer,
    wellIDNearLine,
    xStart,
    yStart,
    xEnd,
    yEnd,
    xySection
  };
};

const mapDispathToProps = {
  getAllWells,
  getCoupleWell,
  getCoupleWellLayer,
  getFigURI,
  getWellIDNearLine
};

interface Well {
  x: number;
  y: number;
  latlng: [number, number];
  id: string;
  xOnSvg?: number;
  yOnSvg?: number;
  xOnMatrix: number;
  yOnMatrix: number;
}
interface Props {
  scaler: any;
  allWells: Well[];
  coupleWell: string[];
  coupleWellLayer: any;
  readonly xStart: number;
  readonly yStart: number;
  readonly xEnd: number;
  readonly yEnd: number;
  readonly xySection: number;
  wellIDNearLine: string[];
  getAllWells: any;
  getCoupleWell: any;
  getCoupleWellLayer: any;
  getFigURI: any;
  getWellIDNearLine: any;
}

interface Map {
  map: any;
  mapRef: any;
  UNSAFE_internalCoupleIDStore: string[];
  UNSAFE_internalCoupleLayerStore: any[];
  UNSAFE_internalCoupleXYStore: [number, number][];
  UNSAFE_circlesLayer: L.LayerGroup;
}

class Map extends React.Component<Props, object> {
  constructor(props: Props) {
    super(props);
    this.mapRef = React.createRef();
    this.UNSAFE_internalCoupleIDStore = [];
    this.UNSAFE_internalCoupleLayerStore = [];
    this.UNSAFE_internalCoupleXYStore = [];
    this.getPointsOnLine = this.getPointsOnLine.bind(this);
    this.getWellIDNearLine = this.getWellIDNearLine.bind(this);
  }
  componentDidMount() {
    this.deployMap();
    this.generateBound();
    this.generateGrid();
  }

  componentDidUpdate(prevProps: Props, prevState: Props, snapshot: any) {
    let self = this;

    if (prevProps.scaler === null) {
      const {
        scaler,
        getAllWells,
        getCoupleWell,
        getFigURI,
        xStart,
        yStart,
        xySection
      } = this.props;
      const circlesLayer = L.layerGroup();
      fetch("./data/wellFullLocation.json")
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          return undefined;
        })
        .then(wellLocationData => {
          const allWells: any[] = [];
          wellLocationData.map((well: Well) => {
            let xOnSvg = scaler.xScaler(well.x);
            let yOnSvg = scaler.yScaler(well.y);
            let xOnMatrix = Math.floor((well.x - xStart) / xySection);
            let yOnMatrix = Math.floor((well.y - yStart) / xySection);
            allWells.push({ ...well, xOnSvg, yOnSvg, xOnMatrix, yOnMatrix });
            let circle = L.circle(well.latlng, {
              radius: 5,
              stroke: false,
              fillOpacity: 1
            }).on("click", function() {
              self.UNSAFE_internalCoupleIDStore.push(well.id);
              self.UNSAFE_internalCoupleXYStore.push([well.x, well.y]);
              getCoupleWell(self.UNSAFE_internalCoupleIDStore);
              if (self.UNSAFE_internalCoupleIDStore.length === 2) {
                self.UNSAFE_internalCoupleIDStore = [];

                const pointsOnLine = self.getPointsOnLine(
                  self.UNSAFE_internalCoupleXYStore
                );
                const wellIDNearLine = self.getWellIDNearLine(pointsOnLine);
                self.props.getWellIDNearLine(wellIDNearLine);
                const figURI = self.fetchMatchFig(pointsOnLine).then(figURI => {
                  getFigURI(figURI);
                });
                getFigURI(figURI);
                self.UNSAFE_internalCoupleXYStore = [];
              }
            });
            circlesLayer.addLayer(circle);
          });
          getAllWells(allWells);
        });
      circlesLayer.addTo(this.map);
    }

    if (this.props.coupleWell.length !== prevProps.coupleWell.length) {
      const {
        coupleWell,
        allWells,
        coupleWellLayer,
        getCoupleWellLayer
      } = this.props;
      if (coupleWellLayer.length === 2) {
        coupleWellLayer[0].remove();
        coupleWellLayer[1].remove();
      }
      for (let i = 0; i < allWells.length; i++) {
        if (coupleWell[coupleWell.length - 1] === allWells[i].id) {
          let circle = L.circle(allWells[i].latlng, {
            radius: 5,
            color: "red"
          });
          circle.addTo(this.map);
          self.UNSAFE_internalCoupleLayerStore.push(circle);
          getCoupleWellLayer(self.UNSAFE_internalCoupleLayerStore);
          if (self.UNSAFE_internalCoupleLayerStore.length === 2) {
            self.UNSAFE_internalCoupleLayerStore = [];
          }
          break;
        }
      }
    }

    if (this.props.wellIDNearLine !== prevProps.wellIDNearLine) {
      if (this.UNSAFE_circlesLayer) {
        this.UNSAFE_circlesLayer.remove();
      }
      const { allWells, wellIDNearLine } = this.props;
      let wellIDNearLineLayer = [];
      for (let i = 0; i < allWells.length; i++) {
        for (let j = 0; j < wellIDNearLine.length; j++) {
          if (wellIDNearLine[j] === allWells[i].id) {
            let circle = L.circle(allWells[i].latlng, {
              radius: 5,
              color: "green"
            });
            wellIDNearLineLayer.push(circle);
            break;
          }
          if (wellIDNearLineLayer.length === wellIDNearLine.length) break;
        }
      }
      const circlesLayer = L.layerGroup(wellIDNearLineLayer);
      circlesLayer.addTo(this.map);
      this.UNSAFE_circlesLayer = circlesLayer;
    }
  }

  getPointsOnLine(line: [number, number][]): any[] {
    const { xStart, yStart, xySection } = this.props;
    let x1 = (line[0][0] - xStart) / xySection;
    let y1 = (line[0][1] - yStart) / xySection;
    let x2 = (line[1][0] - xStart) / xySection;
    let y2 = (line[1][1] - yStart) / xySection;
    const matrixCoors = [[x1, y1], [x2, y2]].map(e => e.map(Math.floor));
    const k =
      (matrixCoors[0][1] - matrixCoors[1][1]) /
      (matrixCoors[0][0] - matrixCoors[1][0]);
    const b = matrixCoors[0][1] - matrixCoors[0][0] * k;
    let smallerX = matrixCoors[0][0] < matrixCoors[1][0] ? 0 : 1;
    let biggerX = matrixCoors[0][0] < matrixCoors[1][0] ? 1 : 0;
    let pointsOnLine: any[] = [];
    for (
      let x = matrixCoors[smallerX][0];
      x < matrixCoors[biggerX][0];
      x += 0.1
    ) {
      let y = Math.floor(k * x + b);
      let exist = false;
      for (let i = 0; i < pointsOnLine.length; i++) {
        if (
          equal(pointsOnLine[i][0], pointsOnLine[i][1], Math.floor(x), y) ===
          true
        ) {
          exist = true;
        }
      }
      if (exist === false) pointsOnLine.push([Math.floor(x), y]);
    }
    console.log("pointsOnLine: ", pointsOnLine);
    return pointsOnLine;
    function equal(x1: number, y1: number, x2: number, y2: number): boolean {
      return x1 === x2 && y1 === y2;
    }
  }

  getWellIDNearLine(pointsOnLine: number[][]): any {
    const { allWells } = this.props;
    /*this method can speed up by tranform the 
    structure of `allWells` from array to obj*/
    let wellIDNearLine = new Set();
    for (let i = 0; i < pointsOnLine.length; i++) {
      for (let j = 0; j < allWells.length; j++) {
        let cellPoint: [number, number] = [
          allWells[j].xOnMatrix,
          allWells[j].yOnMatrix
        ];
        if (isInCell(cellPoint, pointsOnLine[i])) {
          wellIDNearLine.add(allWells[j].id);
        }
      }
    }
    return Array.from(wellIDNearLine);

    function isInCell(
      cellPoint: [number, number],
      singlePointOnLine: number[]
    ): boolean {
      return (
        cellPoint[0] === singlePointOnLine[0] &&
        cellPoint[1] === singlePointOnLine[1]
      );
    }
  }

  fetchMatchFig(pointsOnLine: any) {
    return fetch("http://localhost:5000/drawLine/", {
      body: JSON.stringify(pointsOnLine), // must match 'Content-Type' header
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "content-type": "application/json"
      },
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors" // no-cors, cors, *same-origin
    }).then(res => res.text());
  }

  deployMap() {
    const center: [number, number] = [37.867271959429445, 118.78092767561518];
    const zoom: number = 13;
    const preferCanvas: boolean = true;
    const zoomControl: boolean = false;
    const attributionControl: boolean = false;
    const options: any = {
      center,
      zoom,
      zoomControl,
      attributionControl,
      preferCanvas
    };
    this.map = L.map(this.mapRef.current.id, options);
    L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).addTo(
      this.map
    );
  }

  generateBound() {
    //clockwise from left-bottom
    type point = [number, number]; //like a interface represents tuple
    let p1: point = [37.83164815261103, 118.73221307817226];
    let p2: point = [37.90098826849878, 118.73383750454309];
    let p3: point = [37.899613830166174, 118.82475161382335];
    let p4: point = [37.83027712360192, 118.82304212267306];
    let bound = [p1, p2, p3, p4];
    L.polygon(bound, { color: "blue" }).addTo(this.map);
  }

  generateGrid() {
    fetch("./data/gridData.json", {})
      .then(res => res.json())
      .then(data => {
        const polylines: any[] = [];
        data.map((path: [number, number][]) => {
          const polyline = L.polyline(path, { color: "grey", weight: 0.5 });
          polylines.push(polyline);
        });
        const polylinesLayerGroup = L.layerGroup(polylines);
        polylinesLayerGroup.addTo(this.map);
      });
  }

  render() {
    return (
      <React.Fragment>
        <div
          id="map"
          ref={this.mapRef}
          className="leaflet-map panel panel-default"
        />
      </React.Fragment>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispathToProps
)(Map);
