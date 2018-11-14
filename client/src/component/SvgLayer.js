import * as React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state, ownProps) => {
  const { figWidth, figHeight, figLeft, figTop, scaler } = state.figReducer;
  return {
    width: figWidth,
    height: figHeight,
    left: figLeft,
    top: figTop,
    scaler
  };
};

interface Props {
  width: number;
  height: number;
  left: number;
  top: number;
}

class SvgLayer extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const { width, height, left, top } = this.props;
    const style = {
      position: "absolute",
      width,
      height,
      left,
      top
    };
    return <svg style={style} />;
  }
}

export default connect(mapStateToProps)(SvgLayer);
