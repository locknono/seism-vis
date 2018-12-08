import * as React from "react";
import { connect } from "react-redux";
import { Panel } from "react-bootstrap";
import { WellCircle } from "./WellCircle";
import { ViewHeading } from "../ViewHeading";
const mapStateToProps = (state: any, ownProps?: any) => {
  const { planeName, depth } = state.figReducer;
  const { xStart, yStart, xEnd, yEnd } = state.globalVarReducer;
  const { coupleWell } = state.wellReducer;
  return { planeName, depth, xStart, yStart, xEnd, yEnd, coupleWell };
};

const InfoPanel = (props: any) => {
  const { planeName, depth, coupleWell } = props;
  return (
    <div className="info-panel panel panel-primary">
      <ViewHeading height={22} title={`Info`} />
      <WellCircle coupleWell={coupleWell} />
    </div>
  );
};

export default connect(mapStateToProps)(InfoPanel);
