import React, { Component } from "react";
import Button from "react-bootstrap/lib/Button";

class PlaneChooseButton extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick() {
    this.props.onChangePlane(this.props.plane);
  }
  render() {
    return (
      <div>
        <Button onClick={this.onClick}>{this.props.plane}</Button>
      </div>
    );
  }
}

export default PlaneChooseButton;
