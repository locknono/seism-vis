import React, { Component } from "react";
import L from "leaflet";
import { toLatLon, fromLatLon } from "utm";
import proj4 from "proj4";
import { connect } from "react-redux";
import {
  getAllWells,
  getCoupleWell,
  getCoupleWellLayer
} from "../action/changeWell";
const mapStateToProps = (state, ownProps) => {
  const scaler = state.figReducer.scaler;
  const { allWells, coupleWell, coupleWellLayer } = state.wellReducer;
  return { scaler, allWells, coupleWell, coupleWellLayer };
};

const mapDispathToProps = {
  getAllWells,
  getCoupleWell,
  getCoupleWellLayer
};

class Map extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.internalCoupleIDStore = [];
    this.internalCoupleLayerStore = [];
  }
  componentDidMount() {
    this.deployMap();
    this.generateBound();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let self = this;

    if (prevProps.scaler === null) {
      const { scaler, getAllWells, getCoupleWell } = this.props;
      const wellLayers = [];
      const circlesLayer = L.layerGroup();
      fetch("./data/wellFullLocation.json")
        .then(res => {
          if (res.ok) {
            return res.json();
          }
        })
        .then(wellLocationData => {
          const allWells = [];
          wellLocationData.map(well => {
            let xOnSvg = scaler.xScaler(well.x);
            let yOnSvg = scaler.yScaler(well.y);
            allWells.push({ ...well, xOnSvg, yOnSvg });
            let circle = L.circle(well.latlng, { radius: 10 }).on(
              "click",
              function() {
                self.internalCoupleIDStore.push(well.id);
                getCoupleWell(self.internalCoupleIDStore);
                if (self.internalCoupleIDStore.length === 2) {
                  self.internalCoupleIDStore = [];
                }
              }
            );
            circlesLayer.addLayer(circle);
          });
          getAllWells(allWells);
        });
      circlesLayer.addTo(this.map);
    }

    if (this.props.coupleWell.length !== prevProps.coupleWell.length) {
      const {
        scaler,
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
            radius: 10,
            color: "red"
          });
          self.internalCoupleLayerStore.push(circle);
          getCoupleWellLayer(self.internalCoupleLayerStore);
          if (self.internalCoupleLayerStore.length === 2) {
            self.internalCoupleLayerStore = [];
          }
          circle.addTo(this.map);
          break;
        }
      }
    }
  }

  deployMap() {
    const center = [37.867271959429445, 118.78092767561518];
    const zoom = 13;
    const preferCanvas = true;
    const zoomControl = false;
    const attributionControl = false;
    const options = {
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
    let p1 = [37.83164815261103, 118.73221307817226];
    let p2 = [37.90098826849878, 118.73383750454309];
    let p3 = [37.899613830166174, 118.82475161382335];
    let p4 = [37.83027712360192, 118.82304212267306];
    let bound = [p1, p2, p3, p4];

    L.circle(p1, { radius: 100, color: "red" }).addTo(this.map);
    L.circle(p3, { radius: 100, color: "black" }).addTo(this.map);

    L.polygon(bound, { color: "blue" }).addTo(this.map);
  }

  generateGrid() {
    //TO-DO
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
