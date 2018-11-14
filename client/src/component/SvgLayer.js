import * as React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state, ownProps) => {
  const { figWidth, figHeight } = state;
  return { width: figWidth, height: figHeight };
};

interface Props {
  width: number;
  height: number;
}

class SvgLayer extends React.Component<Props> {
  render() {
    const { width, height } = this.props;
    const style = {
      width,
      height
    };
    return <svg style={style} />;
  }
}

export default connect(mapStateToProps)(SvgLayer);
