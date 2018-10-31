import React, { Component } from "react";
import L from "leaflet";
import { toLatLon, fromLatLon } from "utm";

class Map extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.inBound = this.inBound.bind(this);
  }
  componentDidMount() {
    const { xStart, yStart, xEnd, yEnd, xySection } = this.props.uCoors;
    this.deployMap();
    const self = this;
    fetch("./data/well_logging.json")
      .then(res => res.json())
      .then(loggingData => {
        let allWellRowColNumber = [];
        loggingData.map(logging => {
          L.circle(logging.latlng, { radius: 10 }).addTo(this.map);
          const { easting, northing } = fromLatLon(...logging.latlng);
          if (this.inBound(easting, northing)) {
            L.circle(logging.latlng, { radius: 10, color: "red" })
              .on("mouseover", function(e) {
                let { lat, lng } = e.latlng;
                let { easting, northing } = fromLatLon(lat, lng);
                let colNumber = parseInt((easting - xStart) / xySection);
                let rowNumber = parseInt((northing - yStart) / xySection);
                self.props.onGetSelectedWellRowColNumber(rowNumber, colNumber);
              })
              .addTo(this.map);
            let colNumber = parseInt((easting - xStart) / xySection);
            let rowNumber = parseInt((northing - yStart) / xySection);
            allWellRowColNumber.push([rowNumber, colNumber]);
          }
        });
        self.props.onGetAllWellRowColNumber(allWellRowColNumber);
      });
    let p1 = this.getLatLngArray(toLatLon(xStart, yStart, 50, "N"));
    let p2 = this.getLatLngArray(toLatLon(xStart, yEnd, 50, "N"));
    let p3 = this.getLatLngArray(toLatLon(xEnd, yStart, 50, "N"));
    let p4 = this.getLatLngArray(toLatLon(xEnd, yEnd, 50, "N"));
    let latlngs = [p1, p2, p4, p3];

    L.circle(p1, { radius: 300, color: "white" }).addTo(this.map);
    L.circle(p2, { radius: 300, color: "red" }).addTo(this.map);
    L.circle(p3, { radius: 300, color: "purple" }).addTo(this.map);
    L.circle(p4, { radius: 300, color: "black" }).addTo(this.map);

    let polygon = L.polygon(latlngs, { color: "red" }).addTo(this.map);
  }
  inBound(easting, northing) {
    const { xStart, yStart, xEnd, yEnd } = this.props.uCoors;
    return (
      easting > xStart && easting < xEnd && northing > yStart && northing < yEnd
    );
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
