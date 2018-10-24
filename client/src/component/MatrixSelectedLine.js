import React, { Component } from "react";

class MatrixSelectedLine extends Component {
  render() {
    const imgURI = this.props.imgURI;
    return (
      <div>
        {imgURI && (
          <img alt="Selected Line" src={`data:image/png;base64,${imgURI}`} />
        )}
      </div>
    );
  }
}

export default MatrixSelectedLine;
