import * as React from "react";
import Map from "./Map";
import Matrix from "./Matrix";
import WellMatch from "./WellMatch";
import AttrDiff from "./AttrDiff";
import ControlPanel from "./ControlPanel";
import InfoPanel from "./InfoPanel/InfoPanel";
import { connect } from "react-redux";
import { AllDiff, CurSelectedIndex } from "src/ts/Type";

const mapStateToProps = (state: any, ownProps?: any) => {
  const { allDiff, curSelectedIndex } = state.wellReducer;
  return { allDiff, curSelectedIndex };
};
interface Props {
  allDiff: AllDiff;
  curSelectedIndex: CurSelectedIndex;
}

const Seism = function(props: Props) {
  const { allDiff, curSelectedIndex } = props;
  return (
    <React.Fragment>
      <div className="seism">
        <InfoPanel />
        <Map />
        <div className="right-side">
          <WellMatch />
          <AttrDiff allDiff={allDiff} curSelectedIndex={curSelectedIndex} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default connect(mapStateToProps)(Seism);
