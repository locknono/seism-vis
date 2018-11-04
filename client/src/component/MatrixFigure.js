import React, { Component } from "react";
import FigureSvgLayer from "./FigureSvgLayer";
class MatrixFigure extends Component {
  constructor(props) {
    super(props);
    this.state = { lineCoors: [[], []] };
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
        const { top, left } = figuerNode.getBoundingClientRect();
        const padLength = width / this.props.colCount;
        this.props.onGetFigureHeight(height);
        this.setState({ width, height, padLength, top, left });
      }.bind(this),
      0
    );
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    return null;
  }
  componentDidUpdate(prevProps, prevState) {
    const figuerNode = this.figureRef.current;
    const { height } = figuerNode;
    if (height !== prevState.height) {
      this.setState({ height });
      this.props.onGetFigureHeight(height);
    }
  }

  onClick(e) {
    //x for colCount,y for rowCount

    //TO-DO:store Global variables such as
    //row number ,vmin into `context`
    if (this.props.plane !== "xy") return;
    const { x, y } = this.getXY(e);
    fetch(`http://localhost:5000/xy/${x}-${y}`)
      .then(response => response.json())
      .then(zData => {
        this.props.onClickChangeZData(zData);
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
    this.setState({
      lineCoors,
      matrixCoors,
      pointsOnLine
    });
    fetch("http://localhost:5000/drawLine/", {
      body: JSON.stringify(pointsOnLine), // must match 'Content-Type' header
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "content-type": "application/json"
      },
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors" // no-cors, cors, *same-origin
    })
      .then(res => res.text())
      .then(imgURI => {
        this.props.onChangeImgURI(imgURI);
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

    return { matrixCoors, pointsOnLine };
  }
  getXY(e) {
    const { offsetX, offsetY } = e.nativeEvent;
    const { width, height } = this.state;
    const x = Math.floor((offsetX / width) * this.props.colCount);
    const y = Math.floor((offsetY / height) * this.props.rowCount);
    return { x, y };
  }
  render() {
    const {
      plane,
      depth,
      selectedWellRowNumber,
      selectedWellColNumber,
      rowCount,
      colCount,
      allWellRowColNumber
    } = this.props;
    const {
      top,
      left,
      width,
      height,
      lineCoors,
    } = this.state;
    const selectedWellXOnSvg = (selectedWellColNumber / colCount) * colCount;
    const selectedWellYOnSvg = (selectedWellRowNumber / rowCount) * height;
    const allWellXY = allWellRowColNumber.map(v => {
      return [(v[0] / rowCount) * height, (v[1] / colCount) * colCount];
    });
    const className = "figurePosition";
    return (
      <div className="matrix-figure panel panel-default">
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
              left={left}
              top={top}
              width={width}
              height={height}
              lineCoors={lineCoors}
              selectedWellXOnSvg={selectedWellXOnSvg}
              selectedWellYOnSvg={selectedWellYOnSvg}
              allWellXY={allWellXY}
            />
          )}
      </div>
    );
  }
}

export default MatrixFigure;
