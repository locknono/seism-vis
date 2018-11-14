import * as React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state, ownProps) => {
  const { figWidth, figHeight, figLeft, figTop, scaler } = state.figReducer;
  const { allWells } = state.wellReducer;
  return {
    width: figWidth,
    height: figHeight,
    left: figLeft,
    top: figTop,
    scaler,
    allWells
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
    const { width, height, left, top, allWells } = this.props;
    const wells = allWells.map(e => (
      <circle key={e.id} cx={e.xOnSvg} cy={e.yOnSvg} r={2} fill="blue" />
    ));
    const style = {
      position: "absolute",
      width,
      height,
      left,
      top
    };
    return <svg style={style}>{wells}</svg>;
  }
}

export default connect(mapStateToProps)(SvgLayer);
