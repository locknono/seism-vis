import * as React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: any, ownProps?: any) => {
  const { planeName, depth } = state.figReducer;
  const { xStart, yStart, xEnd, yEnd } = state.globalVarReducer;
  const { coupleWell } = state.wellReducer;
  return { planeName, depth, xStart, yStart, xEnd, yEnd, coupleWell };
};

const InfoPanel = (props: any) => {
  const { planeName, depth, coupleWell } = props;
  return (
    <div className="panel panel-default">
      {planeName}
      <br />
      {depth}
      <br />
      {coupleWell.join("---")}
    </div>
  );
};

export default connect(mapStateToProps)(InfoPanel);
