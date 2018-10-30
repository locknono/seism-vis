import React, { Component } from "react";
import L from "leaflet";
import { toLatLon, fromLatLon } from "utm";

class Map extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }
  componentDidMount() {
    const u1 = 652500,
      u2 = 4190300,
      u3 = 660525,
      u4 = 4198025;
    this.deployMap();
    fetch("./data/well_logging.json")
      .then(res => res.json())
      .then(loggingData => {
        let connt = 0;
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

    let p1 = [
      toLatLon(u1, u2, 50, "N").latitude,
      toLatLon(u1, u2, 50, "N").longitude
    ];
    let p2 = [
      toLatLon(u1, u4, 50, "N").latitude,
      toLatLon(u1, u4, 50, "N").longitude
    ];
    let p3 = [
      toLatLon(u3, u2, 50, "N").latitude,
      toLatLon(u3, u2, 50, "N").longitude
    ];
    let p4 = [
      toLatLon(u3, u4, 50, "N").latitude,
      toLatLon(u3, u4, 50, "N").longitude
    ];
    var latlngs = [p3, p1, p2, p4];
    var polygon = L.polygon(latlngs, { color: "red" }).addTo(this.map);
  }
  bd09togcj02(bd_lat, bd_lon) {
    var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lat, gg_lng];
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
