import React, { Component } from "react";
import PolylineSvg from "./PolylineSvg";
class MatrixFigure extends Component {
  constructor(props) {
    super(props);
    this.state = { zData: [] };
    this.figureRef = React.createRef();
    this.onClick = this.onClick.bind(this);
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
    const { offsetX, offsetY } = e.nativeEvent;
    const { width, height } = this.state;
    const x = Math.floor((offsetX / width) * 886);
    const y = Math.floor((offsetY / height) * 716);
    fetch(`http://localhost:5000/xy/${x}-${y}`)
      .then(response => response.json())
      .then(zData => {
        this.setState({ zData });
      });
  }

  render() {
    const { plane, depth } = this.props;
    const { zData } = this.state;
    return (
      <React.Fragment>
        <img
          src={`./imgs/${plane}/${depth}.png`}
          alt="Matrix"
          ref={this.figureRef}
          onClick={this.onClick}
        />
        <PolylineSvg zData={zData} width={1000} height={200} />
      </React.Fragment>
    );
  }
}

export default MatrixFigure;
