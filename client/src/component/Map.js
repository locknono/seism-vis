import React, { Component } from "react";
import L from "leaflet";

class Map extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }
  componentDidMount() {
    this.deployMap();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {}
  deployMap() {
    const center = [30.16, 120.12];
    const zoom = 14;
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
