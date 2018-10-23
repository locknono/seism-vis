import React, { Component } from "react";
import PolylineSvg from "./PolylineSvg";
import FigureSvgLayer from "./FigureSvgLayer";
class MatrixFigure extends Component {
  constructor(props) {
    super(props);
    this.state = { zData: [] };
    this.figureRef = React.createRef();
    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.getXY = this.getXY.bind(this);
  }
  componentDidMount() {
    /**Browser loads img asynchronously,
     * Even After the component is mouted,
     * the img will not load immediately
     * */
    setTimeout(
      function() {
        const figuerNode = this.figureRef.current;
        const { width, height } = figuerNode;
        const padLength = width / 886;
        this.setState({ width, height, padLength });
      }.bind(this),
      0
    );
  }
  onClick(e) {
    //x for 886,y for 716

    //TO-DO:store Global variables such as
    //row number ,vmin into `context`
    if (this.props.plane !== "xy") return;
    const { x, y } = this.getXY(e);
    fetch(`http://localhost:5000/xy/${x}-${y}`)
      .then(response => response.json())
      .then(zData => {
        this.setState({ zData });
      });
  }

  onMouseDown(e) {
    e.preventDefault();
    if (this.props.plane !== "xy") return;
    this.mousedownFlag = true;
    this.offsetX1 = e.nativeEvent.offsetX;
    this.offsetY1 = e.nativeEvent.offsetY;
  }
  onMouseMove(e) {
    if (this.props.plane !== "xy") return;
    if (this.mousedownFlag) {
      this.offsetX2 = e.nativeEvent.offsetX;
      this.offsetY2 = e.nativeEvent.offsetY;
      const lineCoors = [
        [this.offsetX1, this.offsetY1],
        [this.offsetX2, this.offsetY2]
      ];
      this.setState({
        lineCoors
      });
    }
  }
  onMouseUp(e) {
    if (this.props.plane !== "xy") return;
    this.mousedownFlag = false;
    const { x, y } = this.getXY(e);
    this.offsetX2 = e.nativeEvent.offsetX;
    this.offsetY2 = e.nativeEvent.offsetY;
    const lineCoors = [
      [this.offsetX1, this.offsetY1],
      [this.offsetX2, this.offsetY2]
    ];
    const { matrixCoors, pointsOnLine } = this.getCoorsAndPointsOnLine(
      lineCoors
    );
    fetch("http://localhost:5000", {
      body: JSON.stringify(pointsOnLine), // must match 'Content-Type' header
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "content-type": "application/json"
      },
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors" // no-cors, cors, *same-origin
    });
    this.setState({
      lineCoors,
      matrixCoors,
      pointsOnLine
    });
  }
  getCoorsAndPointsOnLine(lineCoors) {
    const matrixCoors = lineCoors.map(v => {
      return v.map(m => {
        return Math.floor(m / this.state.padLength);
      });
    });
    const k =
      (matrixCoors[0][1] - matrixCoors[1][1]) /
      (matrixCoors[0][0] - matrixCoors[1][0]);
    const b = matrixCoors[0][1] - matrixCoors[0][0] * k;
    let smallerX = matrixCoors[0][0] < matrixCoors[1][0] ? 0 : 1;
    let biggerX = matrixCoors[0][0] < matrixCoors[1][0] ? 1 : 0;
    let pointsOnLine = [];
    for (let x = matrixCoors[smallerX][0]; x < matrixCoors[biggerX][0]; x++) {
      let y = k * x + b;
      pointsOnLine.push([x, y]);
    }
    console.log("pointsOnLine: ", pointsOnLine);
    return { matrixCoors, pointsOnLine };
  }
  getXY(e) {
    const { offsetX, offsetY } = e.nativeEvent;
    const { width, height } = this.state;
    const x = Math.floor((offsetX / width) * 886);
    const y = Math.floor((offsetY / height) * 716);
    return { x, y };
  }
  render() {
    const { plane, depth } = this.props;
    const {
      zData,
      width,
      height,
      lineCoors,
      matrixCoors,
      pointsOnLine
    } = this.state;
    const className = "figurePosition";
    return (
      <React.Fragment>
        <div>
          <img
            src={`./imgs/${plane}/${depth}.png`}
            alt="Matrix"
            className={className}
            ref={this.figureRef}
            onClick={this.onClick}
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            onMouseUp={this.onMouseUp}
          />
          {plane === "xy" &&
            lineCoors && (
              <FigureSvgLayer
                className={className}
                width={width}
                height={height}
                lineCoors={lineCoors}
              />
            )}
        </div>
        <PolylineSvg zData={zData} width={1000} height={200} />
      </React.Fragment>
    );
  }
}

export default MatrixFigure;
