import React, { Component } from "react";
import * as d3 from "d3";
import SingleWell from "./SingleWell";
class Wells extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minEasting: 20652500,
      maxEasting: 20660500,
      minNorthing: 4190300.16,
      maxNorthing: 4198000.16,
      wells: [],
      twoWellID: ["GD1-2X815", "GD1-6-611"],
      nearIDList: []
    };
    this.getTwoCoorsID = this.getTwoCoorsID.bind(this);
  }
  componentDidMount() {
    const { minEasting, maxEasting, minNorthing, maxNorthing } = this.state;
    let svg = d3.select(".well-svg");
    let svgWidth = parseFloat(svg.style("width").split("px")[0]);
    let svgHeight = parseFloat(svg.style("height").split("px")[0]);
    let xScale = d3
      .scaleLinear()
      .domain([minEasting, maxEasting])
      .range([0, svgWidth]);
    let yScale = d3
      .scaleLinear()
      .domain([minNorthing, maxNorthing])
      .range([0, svgHeight]);
    this.setState({ svgWidth, svgHeight, xScale, yScale });

    d3.json("./data/well_location.json").then(d => {
      let wells = [];
      for (let i = 0; i < d.length; i++) {
        let x = xScale(d[i].x);
        let y = yScale(d[i].y);
        let id = d[i].id;
        wells.push({ id, x, y });
      }
      this.setState({ wells });
    });
  }
  getTwoCoorsID(id) {
    if (this.state.twoWellID.length === 1) {
      this.setState((state, props) => {
        const twoIDs = [state.twoWellID[0], id];
        this.props.getWellIDs(twoIDs);
        return { twoWellID: twoIDs, nearIDList: [] };
      });
    } else {
      this.setState({ twoWellID: [id] });
      fetch("./data/nearList.json")
        .then(r => r.json())
        .then(d => {
          for (let well of d) {
            if (well["id"] === id) {
              let nearList = well["nearList"];
              this.setState({ nearIDList: nearList });
              break;
            }
          }
        });
    }
  }
  render() {
    const { wells, twoWellID, nearIDList } = this.state;
    const renderWells = wells.map(e => {
      return (
        <SingleWell
          key={e.id}
          cx={e.x}
          cy={e.y}
          id={e.id}
          r={5}
          selected={twoWellID.includes(e.id)}
          isNear={nearIDList.includes(e.id)}
          getTwoCoorsID={this.getTwoCoorsID}
        />
      );
    });
    return (
      <div className="panel panel-default well-svg-div">
        <svg className="well-svg">{renderWells}</svg>
      </div>
    );
  }
}

export default Wells;
