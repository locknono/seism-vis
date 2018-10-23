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
        this.setState({ width, height });
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
    const { x, y } = this.getXY(e);
    this.x1 = e.nativeEvent.offsetX;
    this.y1 = e.nativeEvent.offsetY;
  }
  onMouseMove(e) {
    if (this.props.plane !== "xy") return;
    if (this.mousedownFlag) {
      this.x2 = e.nativeEvent.offsetX;
      this.y2 = e.nativeEvent.offsetY;
      this.setState({
        x1: this.x1,
        x2: this.x2,
        y1: this.y1,
        y2: this.y2
      });
    }
  }
  onMouseUp(e) {
    if (this.props.plane !== "xy") return;
    this.mousedownFlag = false;
    const { x, y } = this.getXY(e);
    this.x2 = e.nativeEvent.offsetX;
    this.y2 = e.nativeEvent.offsetY;
    this.setState({
      x1: this.x1,
      x2: this.x2,
      y1: this.y1,
      y2: this.y2
    });
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
    const { zData, width, height, x1, x2, y1, y2 } = this.state;
    const className = "figurePosition";
    const lineCoors = [[x1, y1], [x2, y2]];
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
          {plane === "xy" && (
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
