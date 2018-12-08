import * as React from "react";
import * as L from "leaflet";
import "leaflet.heat";
import { connect } from "react-redux";
import {
  getAllWells,
  getCoupleWell,
  getCoupleWellLayer,
  getWellAttrData
} from "../action/changeWell";
import {
  idIndexMap,
  getNearIndexList,
  getPointsOnLine,
  mapapi_getWellIDNearLine,
  fetchMatrixData,
  fetchWellAttrData,
  getNearWellIndex,
  resetCircleStyle,
  setSelectedCircleStyle,
  generateVoronoi,
  withDataVoronoi
} from "../API/mapAPI";
import {
  getFigURI,
  getWellIDNearLine,
  getWellIDNearLineIndex,
  getMatrixData
} from "../action/changeWell";
import {
  getTwoWellUc,
  storeUcData,
  getHeatData,
  storeVoronoiUcData
} from "../API/heatMap";
import { MatrixData, AllWells, WellAttrData } from "../ts/Type";
import { diff } from "../API/wellAttrDiff";
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
  getWellIDNearLine,
  getWellIDNearLineIndex,
  getMatrixData,
  getWellAttrData
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
  getWellIDNearLineIndex: any;
  getMatrixData: any;
  getWellAttrData: any;
}

interface Map {
  map: any;
  mapRef: any;
  UNSAFE_IDStore: string[];
  UNSAFE_internalCoupleLayerStore: any[];
  UNSAFE_XYStore: [number, number][];
  UNSAFE_IndexStore: number[];
  UNSAFE_circlesLayer: L.LayerGroup;
  UNSAFE_AllCircles: L.Circle[];
}

class Map extends React.Component<Props, object> {
  constructor(props: Props) {
    super(props);
    this.mapRef = React.createRef();
    this.UNSAFE_IDStore = [];
    this.UNSAFE_internalCoupleLayerStore = [];
    this.UNSAFE_XYStore = [];
    this.UNSAFE_IndexStore = [];
    this.UNSAFE_AllCircles = [];
  }
  componentDidMount() {
    this.deployMap();
    this.generateGrid().then(layerControl => {
      this.drawWells(layerControl);
    });
  }

  componentDidUpdate(prevProps: Props, prevState: Props, snapshot: any) {
    const self = this;
    const {
      coupleWell,
      allWells,
      coupleWellLayer,
      getCoupleWellLayer
    } = this.props;

    if (this.props.wellIDNearLine !== prevProps.wellIDNearLine) {
      const { allWells, wellIDNearLine } = this.props;
      for (let i = 0; i < allWells.length; i++) {
        for (let j = 0; j < prevProps.wellIDNearLine.length; j++) {
          if (prevProps.wellIDNearLine[j] === allWells[i].id) {
            resetCircleStyle(this.UNSAFE_AllCircles[i]);
          }
        }
      }
      for (let i = 0; i < allWells.length; i++) {
        for (let j = 0; j < wellIDNearLine.length; j++) {
          if (wellIDNearLine[j] === allWells[i].id) {
            setSelectedCircleStyle(this.UNSAFE_AllCircles[i]);
          }
        }
      }
    }
  }

  fetchMatchFig(pointsOnLine: any) {
    return fetch("http://localhost:5000/drawLine/", {
      body: JSON.stringify(pointsOnLine),
      credentials: "same-origin",
      headers: {
        "content-type": "application/json"
      },
      method: "POST",
      mode: "cors"
    }).then(res => res.text());
  }

  deployMap() {
    const center: [number, number] = [37.867271959429445, 118.78092767561518];
    const zoom = 14.5;
    const preferCanvas = true;
    const zoomControl = false;
    const attributionControl = false;
    const options: object = {
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
    L.polygon(bound, { color: "blue", fill: false }).addTo(this.map);
  }

  generateGrid() {
    return fetch("./data/gridData.json", {})
      .then(res => res.json())
      .then(data => {
        const polylines: any[] = [];
        data.map((path: [number, number][]) => {
          const polyline = L.polyline(path, {
            color: "grey",
            weight: 0.5
          });
          polylines.push(polyline);
        });
        const polylinesLayerGroup = L.layerGroup(polylines);

        const imageUrl = "http://localhost:3000/imgs/xy/300.png";
        const imageBounds: [number, number][] = [
          [37.90098826849878, 118.73383750454309],
          [37.899613830166174, 118.82475161382335],
          [37.83027712360192, 118.82304212267306],
          [37.83164815261103, 118.73221307817226]
        ];
        const imgOverlay = L.imageOverlay(imageUrl, imageBounds);
        const overlayMaps = {
          Grid: polylinesLayerGroup,
          Grayscale: imgOverlay
        };
        const layerControl = L.control.layers(undefined, overlayMaps, {
          collapsed: false
        });
        layerControl.addTo(this.map);
        return layerControl;
      });
  }

  drawWells(layerControl: any) {
    const self = this;
    const {
      getAllWells,
      getCoupleWell,
      getFigURI,
      xStart,
      yStart,
      xySection,
      getWellIDNearLine,
      getMatrixData,
      getWellIDNearLineIndex,
      coupleWell,
      getWellAttrData
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
        const allCircles: L.Circle[] = [];
        const allWells: AllWells = [];
        wellLocationData.map((well: Well, index: number) => {
          let xOnMatrix = Math.floor((well.x - xStart) / xySection);
          let yOnMatrix = Math.floor((well.y - yStart) / xySection);
          allWells.push({ ...well, xOnMatrix, yOnMatrix, index: index });
          let circle = L.circle(well.latlng, {
            radius: 5,
            stroke: false,
            fillOpacity: 1
          }).on("click", function() {
            self.UNSAFE_IDStore.push(well.id);
            self.UNSAFE_XYStore.push([well.x, well.y]);
            self.UNSAFE_IndexStore.push(index);
            getCoupleWell(self.UNSAFE_IDStore);

            if (self.UNSAFE_IDStore.length === 1) {
              getNearWellIndex(self.UNSAFE_IDStore[0], allWells).then(
                indexList => {
                  for (let index of indexList) {
                    allCircles[index].setStyle({
                      color: "green"
                    });
                  }
                }
              );

              if (self.UNSAFE_IndexStore.length === 3) {
                resetCircleStyle(allCircles[self.UNSAFE_IndexStore[0]]);
                resetCircleStyle(allCircles[self.UNSAFE_IndexStore[1]]);
                self.UNSAFE_IndexStore.splice(0, 2);
              }
              setSelectedCircleStyle(allCircles[self.UNSAFE_IndexStore[0]]);
            }
            if (self.UNSAFE_IDStore.length === 2) {
              getNearWellIndex(self.UNSAFE_IDStore[0], allWells).then(
                indexList => {
                  for (let index of indexList) {
                    allCircles[index].setStyle({
                      color: "#3388ff" //default
                    });
                  }
                  self.UNSAFE_IndexStore.map(index => {
                    setSelectedCircleStyle(allCircles[index]);
                  });
                }
              );

              const pointsOnLine = getPointsOnLine(self.UNSAFE_XYStore);
              const [
                wellIDNearLine,
                wellIDNearLineIndexOnLine
              ] = mapapi_getWellIDNearLine(
                pointsOnLine,
                allWells,
                self.UNSAFE_IDStore as [string, string]
              );
              fetchWellAttrData(
                self.UNSAFE_IDStore[0],
                self.UNSAFE_IDStore[1]
              ).then((data: WellAttrData) => {
                getWellAttrData(data);
              });

              self.UNSAFE_IDStore = [];
              getWellIDNearLine(wellIDNearLine);
              getWellIDNearLineIndex(wellIDNearLineIndexOnLine);
              fetchMatrixData(pointsOnLine).then((matrixData: MatrixData) => {
                getMatrixData(matrixData);
              });
              self.UNSAFE_XYStore = [];
            }
          });
          circlesLayer.addLayer(circle);
          allCircles.push(circle);
        });
        self.UNSAFE_AllCircles = allCircles;
        getAllWells(allWells);
        //storeUcData(allWells);
        //storeVoronoiUcData(allWells);
        getHeatData(allWells).then((heatData: any) => {
          const heatLayer = (L as any).heatLayer(heatData, { radius: 8 });
          layerControl.addOverlay(heatLayer, "Heatmap");
        });

        withDataVoronoi(allWells, this.map).then(voronoiLayer => {
          layerControl.addOverlay(voronoiLayer, "Triangulation");
        });
        circlesLayer.addTo(this.map);
        L.control.scale().addTo(this.map);
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
