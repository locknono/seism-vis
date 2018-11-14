import * as React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state, ownProps) => {
  const { figWidth, figHeight, figLeft, figTop } = state;
  return { width: figWidth, height: figHeight, left: figLeft, top: figTop };
};

interface Props {
  width: number;
  height: number;
  left: number;
  top: number;
}

class SvgLayer extends React.Component<Props> {



  showAllWells() {
    fetch('./wellFullLocation').then(res=>res.json())
    .then(locationData=>{
      locationData.map(e=>{
      })
    })
    return undefined;
  }

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
