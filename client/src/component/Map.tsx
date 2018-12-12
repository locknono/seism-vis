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
  getMatrixData,
  getInsideWells
} from "../action/changeWell";
import {
  getTwoWellUc,
  storeUcData,
  getHeatData,
  storeVoronoiUcData
} from "../API/heatMap";
import { MatrixData, AllWells, WellAttrData, Well } from "../ts/Type";
import { diff } from "../API/wellAttrDiff";
import { ViewHeading } from "./ViewHeading";
import "leaflet.pm";
import "leaflet.pm/dist/leaflet.pm.css";
import MapviewHeading from "./MapviewHeading";
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
  getWellAttrData,
  getInsideWells
};

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
  getInsideWells: typeof getInsideWells;
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
  layerControl: any;
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
    const options = {
      position: "topleft", // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
      useFontAwesome: false, // use fontawesome instead of glyphicons (you need to include fontawesome yourself)
      drawMarker: true, // adds button to draw markers
      drawPolyline: true, // adds button to draw a polyline
      drawRectangle: true, // adds button to draw a rectangle
      drawPolygon: true, // adds button to draw a polygon
      drawCircle: true, // adds button to draw a cricle
      cutPolygon: true, // adds button to cut a hole in a polygon
      editMode: true, // adds button to toggle edit mode for all layers
      removalMode: true // adds a button to remove layers
    };
    const drawOptions = {
      snappable: true,
      snapDistance: 20,
      snapMiddle: false,
      allowSelfIntersection: true,
      templineStyle: {
        color: "blue"
      },
      hintlineStyle: {
        color: "blue",
        dashArray: [5, 5]
      },
      cursorMarker: false,
      finishOn: null,
      markerStyle: {
        fillColor: "none",
        stroke: "blue",
        opacity: 0,
        draggable: true,
        pointerEvents: `none`
      },
      pathOptions: {
        fill: "blue",
        fillOpacity: 0,
        color: "blue",
        fillColor: "none",
        pointerEvents: `none`
      }
    };
    const self = this;
    this.map.pm.addControls(options);
    this.map.pm.enableDraw("Circle", drawOptions);
    //this.map.pm.disableDraw("circle");
    this.map.on("pm:create", function(e1: any) {
      const { allWells, getInsideWells } = self.props;
      const radius = e1.layer._radius;
      const center: [number, number] = [
        e1.layer._latlng.lat,
        e1.layer._latlng.lng
      ];
      const insideWells: AllWells = [];
      for (let well of allWells) {
        if (ifInside(well.latlng, center, radius)) {
          insideWells.push(well);
        }
      }
      getInsideWells(insideWells);
      withDataVoronoi(insideWells, self.map).then(voronoiLayer => {
        self.layerControl.addOverlay(voronoiLayer, "Selected");
        e1.layer.remove();
      });
    });

    function ifInside(p: [number, number], c: [number, number], r: number) {
      if (
        Math.sqrt(
          Math.pow(
            self.map.latLngToLayerPoint(p).x - self.map.latLngToLayerPoint(c).x,
            2
          ) +
            Math.pow(
              self.map.latLngToLayerPoint(p).y -
                self.map.latLngToLayerPoint(c).y,
              2
            )
        ) <= r
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  componentDidUpdate(prevProps: Props, prevState: Props, snapshot: any) {
    const self = this;
    const {
      coupleWell,
      allWells,
      coupleWellLayer,
      getCoupleWellLayer,
      wellIDNearLine
    } = this.props;
    console.log("wellIDNearLine: ", wellIDNearLine);

    if (wellIDNearLine !== prevProps.wellIDNearLine) {
      for (let i = 0; i < allWells.length; i++) {
        for (let j = 0; j < prevProps.wellIDNearLine.length; j++) {
          if (prevProps.wellIDNearLine[j] === allWells[i].id) {
            resetCircleStyle(this.UNSAFE_AllCircles[i]);
            break;
          }
        }
      }
      for (let i = 0; i < allWells.length; i++) {
        for (let j = 0; j < wellIDNearLine.length; j++) {
          if (wellIDNearLine[j] === allWells[i].id) {
            setSelectedCircleStyle(this.UNSAFE_AllCircles[i]);
            break;
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
        this.layerControl = layerControl;
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
          })
            .on("click", function() {
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
                getNearWellIndex(self.UNSAFE_IDStore[0], allWells)
                  .then(indexList => {
                    for (let index of indexList) {
                      allCircles[index].setStyle({
                        color: "#3388ff" //default
                      });
                    }
                    self.UNSAFE_IndexStore.map(index => {
                      setSelectedCircleStyle(allCircles[index]);
                    });
                  })
                  .then(() => {
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
                    fetchMatrixData(pointsOnLine).then(
                      (matrixData: MatrixData) => {
                        getMatrixData(matrixData);
                      }
                    );
                    self.UNSAFE_XYStore = [];
                  });
              }
            })
            .on("mouseover", function() {
              console.log("xOnMatrix: ", xOnMatrix);
              console.log("yOnMatrix: ", yOnMatrix);
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
        <div className="panel panel-primary map-container">
          <MapviewHeading height={22} title={`Map View`} />
          <div id="map" ref={this.mapRef} className="panel panel-default" />
        </div>
      </React.Fragment>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispathToProps
)(Map);
