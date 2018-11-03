import React, { Component } from "react";
import L from "leaflet";
import { toLatLon, fromLatLon } from "utm";
import proj4 from "proj4";
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

    var utm = "+proj=utm +zone=50";
    var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

    let w1 = proj4(utm, wgs84, [xStart, yStart]).reverse();
    console.log('w1: ', w1);
    let w2 = proj4(utm, wgs84, [xStart, yEnd]).reverse();
    console.log('w2: ', w2);
    let w3 = proj4(utm, wgs84, [xEnd, yStart]).reverse();
    console.log('w3: ', w3);
    let w4 = proj4(utm, wgs84, [xEnd, yEnd]).reverse();
    console.log('w4: ', w4);

    let ww = [w1, w2, w4, w3];
    let polygonww = L.polygon(ww, { color: "blue" }).addTo(this.map);

    /*   let p1 = this.getLatLngArray(toLatLon(xStart, yStart, 51, "N"));
    let p2 = this.getLatLngArray(toLatLon(xStart, yEnd, 51, "N"));
    let p3 = this.getLatLngArray(toLatLon(xEnd, yStart, 51, "N"));
    let p4 = this.getLatLngArray(toLatLon(xEnd, yEnd, 51, "N")); */

    let latlngs = [p1, p2, p4, p3];
    fetch("./data/well_logging.json")
      .then(res => res.json())
      .then(loggingData => {
        let allWellRowColNumber = [];
        let minEasting = Number.MAX_VALUE,
          maxEasting = Number.MIN_VALUE;
        let minNorthing = Number.MAX_VALUE,
          maxNorthing = Number.MIN_VALUE;

        loggingData.map(logging => {
          L.circle(logging.latlng, { radius: 10 }).addTo(this.map);
          const { easting, northing } = fromLatLon(...logging.latlng);
          if (easting < minEasting) {
            minEasting = easting;
          }
          if (easting > maxEasting) {
            maxEasting = easting;
          }
          if (northing < minNorthing) {
            minNorthing = northing;
          }
          if (northing > maxNorthing) {
            maxNorthing = northing;
          }
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

        minEasting -= 250;
        maxEasting += 250;
        maxNorthing += 250;
        minNorthing = 4190300.16;
        console.log("minEasting: ", minEasting);
        console.log("maxEasting: ", maxEasting);
        console.log("minNorthing: ", minNorthing);
        console.log("maxNorthing: ", maxNorthing);
        let p1 = this.getLatLngArray(
          toLatLon(minEasting, minNorthing, 51, "N")
        );
        let p2 = this.getLatLngArray(
          toLatLon(minEasting, maxNorthing, 51, "N")
        );
        let p3 = this.getLatLngArray(
          toLatLon(maxEasting, minNorthing, 51, "N")
        );
        let p4 = this.getLatLngArray(
          toLatLon(maxEasting, maxNorthing, 51, "N")
        );

        let latlngs = [p1, p2, p4, p3];
        L.circle(p1, { radius: 300, color: "white" }).addTo(this.map);
        L.circle(p2, { radius: 300, color: "red" }).addTo(this.map);
        L.circle(p3, { radius: 300, color: "purple" }).addTo(this.map);
        L.circle(p4, { radius: 300, color: "black" }).addTo(this.map);

        let polygon = L.polygon(latlngs, { color: "red" }).addTo(this.map);
        self.props.onGetAllWellRowColNumber(allWellRowColNumber);
      });
    let p1 = this.getLatLngArray(toLatLon(xStart, yStart, 51, "N"));
    let p2 = this.getLatLngArray(toLatLon(xStart, yEnd, 51, "N"));
    let p3 = this.getLatLngArray(toLatLon(xEnd, yStart, 51, "N"));
    let p4 = this.getLatLngArray(toLatLon(xEnd, yEnd, 51, "N"));
    let latlngs2 = [p1, p2, p4, p3];

    L.circle(p1, { radius: 300, color: "white" }).addTo(this.map);
    L.circle(p2, { radius: 300, color: "red" }).addTo(this.map);
    L.circle(p3, { radius: 300, color: "purple" }).addTo(this.map);
    L.circle(p4, { radius: 300, color: "black" }).addTo(this.map);

    let polygon = L.polygon(latlngs2, { color: "red" }).addTo(this.map);
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
