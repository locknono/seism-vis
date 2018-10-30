import React, { Component } from "react";
import L from "leaflet";
import { toLatLon, fromLatLon } from "utm";

class Map extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }
  componentDidMount() {
    const { u1, u2, u3, u4 } = this.props.uCoors;
    this.deployMap();
    fetch("./data/well_logging.json")
      .then(res => res.json())
      .then(loggingData => {
        loggingData.map(logging => {
          L.circle(logging.latlng, { radius: 10 }).addTo(this.map);
          const { easting, northing } = fromLatLon(
            logging.latlng[0],
            logging.latlng[1]
          );
          if (easting > u1 && easting < u3 && northing > u2 && northing < u4) {
            L.circle(logging.latlng, { radius: 10, color: "red" }).addTo(
              this.map
            );
          }
        });
      });
    let p1 = this.getLatLngArray(toLatLon(u1, u2, 50, "N"));
    let p2 = this.getLatLngArray(toLatLon(u1, u4, 50, "N"));
    let p3 = this.getLatLngArray(toLatLon(u3, u2, 50, "N"));
    let p4 = this.getLatLngArray(toLatLon(u3, u4, 50, "N"));
    let latlngs = [p3, p1, p2, p4];
    let polygon = L.polygon(latlngs, { color: "red" }).addTo(this.map);
  }

  getLatLngArray(toLatLonResult) {
    return [toLatLonResult.latitude, toLatLonResult.longitude];
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
