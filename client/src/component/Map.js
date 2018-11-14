import React, { Component } from "react";
import L from "leaflet";
import { toLatLon, fromLatLon } from "utm";
import proj4 from "proj4";

class Map extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }
  componentDidMount() {
    this.deployMap();
    this.generateBound();

    const utm = "+proj=utm +zone=50";
    const wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

    const circlesLayer = L.layerGroup();
    fetch("./data/wellFullLocation.json")
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(wellLocationData => {
        wellLocationData.map(well => {
          circlesLayer.addLayer(
            L.circle(well.latlng, { radius: 10, color: "red" })
          );
        });
      });
    circlesLayer.addTo(this.map);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

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
export default Map;
