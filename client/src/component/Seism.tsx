import * as React from "react";
import Map from "./Map";
import Matrix from "./Matrix";
import WellMatch from "./WellMatch";
import { AttrDiff } from "./AttrDiff";
import ControlPanel from "./ControlPanel";
import InfoPanel from "./InfoPanel/InfoPanel";
import { connect } from "react-redux";
import { AllDiff } from "src/ts/Type";

const mapStateToProps = (state: any, ownProps?: any) => {
  const { allDiff } = state.wellReducer;
  return { allDiff };
};
interface Props {
  allDiff: AllDiff;
}

const Seism = function(props: Props) {
  const { allDiff } = props;
  console.log("allDiff: ", allDiff);
  return (
    <React.Fragment>
      <div className="seism">
        <Map />
        <div className="right-side">
          <WellMatch />
          <AttrDiff allDiff={allDiff} />
        </div>
      </div>
      <ControlPanel />
      <InfoPanel />
    </React.Fragment>
  );
};

export default connect(mapStateToProps)(Seism);
