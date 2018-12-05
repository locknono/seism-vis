import * as React from "react";
import { connect } from "react-redux";
import { Panel } from "react-bootstrap";
import { WellCircle } from "./WellCircle";
const mapStateToProps = (state: any, ownProps?: any) => {
  const { planeName, depth } = state.figReducer;
  const { xStart, yStart, xEnd, yEnd } = state.globalVarReducer;
  const { coupleWell } = state.wellReducer;
  return { planeName, depth, xStart, yStart, xEnd, yEnd, coupleWell };
};

const InfoPanel = (props: any) => {
  const { planeName, depth, coupleWell } = props;
  console.log("coupleWell: ", coupleWell);
  return (
    <div className="panel panel-default">
      <Panel bsStyle="primary">
        <Panel.Heading>
          <Panel.Title componentClass="h3">Data Information</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <WellCircle coupleWell={coupleWell} />
        </Panel.Body>
      </Panel>
    </div>
  );
};

export default connect(mapStateToProps)(InfoPanel);
