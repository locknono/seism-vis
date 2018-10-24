import React, { Component } from "react";

class MatrixSelectedLine extends Component {
  render() {
    const imgURI = this.props.imgURI;
    const style = { height: this.props.height };
    return (
      <div className="matrix-selected-line panel panel-default" style={style}>
        {imgURI && (
          <img alt="Selected Line" src={`data:image/png;base64,${imgURI}`} />
        )}
      </div>
    );
  }
}

export default MatrixSelectedLine;
