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
  fetchWellAttrData
} from "../API/mapAPI";
import {
  getFigURI,
  getWellIDNearLine,
  getWellIDNearLineIndex,
  getMatrixData
} from "../action/changeWell";
import { getTwoWellUc, storeUcData, getHeatData } from "../API/heatMap";
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
  UNSAFE_circlesLayer: L.LayerGroup;
}

class Map extends React.Component<Props, object> {
  constructor(props: Props) {
    super(props);
    this.mapRef = React.createRef();
    this.UNSAFE_IDStore = [];
    this.UNSAFE_internalCoupleLayerStore = [];
    this.UNSAFE_XYStore = [];
  }
  componentDidMount() {
    this.deployMap();
    this.generateGrid().then(layerControl => {
      this.drawWells(layerControl);
    });
  }

  componentDidUpdate(prevProps: Props, prevState: Props, snapshot: any) {
    const self = this;
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
      const wellIDNearLineLayer = [];
      for (let i = 0; i < allWells.length; i++) {
        for (let j = 0; j < wellIDNearLine.length; j++) {
          if (wellIDNearLine[j] === allWells[i].id) {
            const circle = L.circle(allWells[i].latlng, {
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
    const zoom: number = 14.5;
    const preferCanvas: boolean = true;
    const zoomControl: boolean = false;
    const attributionControl: boolean = false;
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
        const allCircles: any[] = [];
        const allWells: object[] = [];
        wellLocationData.map((well: Well) => {
          let xOnMatrix = Math.floor((well.x - xStart) / xySection);
          let yOnMatrix = Math.floor((well.y - yStart) / xySection);
          allWells.push({ ...well, xOnMatrix, yOnMatrix });
          let circle = L.circle(well.latlng, {
            radius: 5,
            stroke: false,
            fillOpacity: 1
          }).on("click", function() {
            self.UNSAFE_IDStore.push(well.id);
            self.UNSAFE_XYStore.push([well.x, well.y]);
            getCoupleWell(self.UNSAFE_IDStore);
            if (self.UNSAFE_IDStore.length === 2) {
              const pointsOnLine = getPointsOnLine(self.UNSAFE_XYStore);
              const [
                wellIDNearLine,
                wellIDNearLineIndexOnLine
              ] = mapapi_getWellIDNearLine(
                pointsOnLine,
                allWells,
                self.UNSAFE_IDStore
              );
              fetchWellAttrData(
                self.UNSAFE_IDStore[0],
                self.UNSAFE_IDStore[1]
              ).then(data => {
                getWellAttrData(data);
              });

              self.UNSAFE_IDStore = [];
              getWellIDNearLine(wellIDNearLine);
              getWellIDNearLineIndex(wellIDNearLineIndexOnLine);
              fetchMatrixData(pointsOnLine).then(matrixData => {
                getMatrixData(matrixData);
              });
              self.UNSAFE_XYStore = [];
            }
          });
          circlesLayer.addLayer(circle);
          allCircles.push(circle);
        });
        getAllWells(allWells);
        getHeatData(allWells).then((heatData: any) => {
          const heatLayer = (L as any).heatLayer(heatData, { radius: 8 });
          layerControl.addOverlay(heatLayer, "Heatmap");
        });
      });
    circlesLayer.addTo(this.map);
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
