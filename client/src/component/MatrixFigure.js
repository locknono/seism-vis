import React, { Component } from "react";

class MatrixFigure extends Component {
  constructor(props) {
    super(props);
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
    const { offsetX, offsetY } = e.nativeEvent;
  }

  render() {
    const { plane, depth } = this.props;
    return (
      <React.Fragment>
        <img
          src={`./imgs/${plane}/${depth}.png`}
          alt="Matrix"
          ref={this.figureRef}
          onClick={this.onClick}
        />
      </React.Fragment>
    );
  }
}

export default MatrixFigure;
