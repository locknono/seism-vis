import React, { Component } from "react";

class MatrixSelectedLine extends Component {
  render() {
    const imgURI = this.props.imgURI;
    return (
      <div className="matrix-selected-line-div panel panel-default">
        {imgURI && (
          <img
            alt="Selected Line"
            src={`data:image/png;base64,${imgURI}`}
            className="matrix-selected-line-img"
          />
        )}
      </div>
    );
  }
}

export default MatrixSelectedLine;
